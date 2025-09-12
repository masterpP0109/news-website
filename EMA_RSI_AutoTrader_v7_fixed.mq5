//+------------------------------------------------------------------+
//|                                        EMA_RSI_AutoTrader_v7.mq5|
//| EMA crossover + RSI filter + ATR SL/TP + risk management (v7)    |
//| Fully patched: safe position iteration, debug logs, normalized   |
//+------------------------------------------------------------------+
#property copyright "Example"
#property version   "1.40"
#property strict

#include <Trade\Trade.mqh>
CTrade trade;

//--- inputs
input int    FastEMA        = 9;
input int    SlowEMA        = 21;
input int    RSIperiod      = 14;
input double RSImin         = 30.0;
input double RSImax         = 70.0;
input int    ATRperiod      = 14;
input double ATRMultiplier  = 1.5;
input bool   UseRiskPercent = true;
input double RiskPercent    = 0.5;
input double Lots           = 0.01;
input int    Magic          = 20250911;
input int    Slippage       = 5;
input int    MaxTrades      = 1;
input bool   UseTrailing    = true;
input double TrailingStart  = 20;
input double TrailingStep   = 10;
input ENUM_TIMEFRAMES SignalTimeframe = PERIOD_M5;
input bool   TradeOnMonday  = true;
input bool   TradeOnFriday  = true;
input bool   debug          = true;

//--- indicator handles
int hEMA_fast = INVALID_HANDLE;
int hEMA_slow = INVALID_HANDLE;
int hRSI      = INVALID_HANDLE;
int hATR      = INVALID_HANDLE;

//--- helpers ---------------------------------------------------------
bool IsMarketOpen()
{
   datetime t = TimeCurrent();
   MqlDateTime dt; TimeToStruct(t, dt);
   if(dt.day_of_week==0 || dt.day_of_week==6) return false;
   if(!TradeOnMonday && dt.day_of_week==1) return false;
   if(!TradeOnFriday && dt.day_of_week==5) return false;
   return true;
}

int VolumeDigitsFromStep(double step)
{
   if(step<=0.0) return 2;
   int d=0;
   while(step < 1.0-1e-12 && d<10) { step *= 10.0; d++; }
   return d;
}

double NormalizeLot(double lot)
{
   double minLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double lotStep = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   double maxLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   if(minLot<=0 || lotStep<=0) return NormalizeDouble(lot,2);
   if(lot < minLot) lot = minLot;
   lot = MathFloor(lot / lotStep) * lotStep;
   if(lot < minLot) lot = minLot;
   if(maxLot>0 && lot>maxLot) lot = maxLot;
   int digits = VolumeDigitsFromStep(lotStep);
   return NormalizeDouble(lot, digits);
}

double GetLotSizeFromRisk(double stopLossPoints)
{
   if(stopLossPoints <= 0.0) return Lots;
   if(!UseRiskPercent) return Lots;

   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskAmount = balance * RiskPercent / 100.0;
   if(riskAmount<=0.0) return Lots;

   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tickSize  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   if(tickValue<=0 || tickSize<=0) return Lots;
   double valuePerPointPerLot = tickValue / tickSize;
   if(valuePerPointPerLot<=0) return Lots;

   double lot = riskAmount / (stopLossPoints * valuePerPointPerLot);
   return NormalizeLot(lot);
}

int CountOpenPositions(int direction)
{
   int cnt=0;
   int total = PositionsTotal();
   for(int i=0;i<total;i++)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(!PositionSelectByTicket(ticket)) continue;
      if(PositionGetInteger(POSITION_MAGIC)!=Magic) continue;
      if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;
      long type = PositionGetInteger(POSITION_TYPE);
      if(direction==1 && type==POSITION_TYPE_BUY) cnt++;
      if(direction==-1 && type==POSITION_TYPE_SELL) cnt++;
   }
   return cnt;
}

void ManageTrailing()
{
   if(!UseTrailing) return;
   int total = PositionsTotal();
   for(int i=0;i<total;i++)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(!PositionSelectByTicket(ticket)) continue;
      if(PositionGetInteger(POSITION_MAGIC)!=Magic) continue;
      if(PositionGetString(POSITION_SYMBOL)!=_Symbol) continue;

      long type = PositionGetInteger(POSITION_TYPE);
      double open_price = PositionGetDouble(POSITION_PRICE_OPEN);
      double cur_price = (type==POSITION_TYPE_BUY) ? SymbolInfoDouble(_Symbol,SYMBOL_BID) : SymbolInfoDouble(_Symbol,SYMBOL_ASK);
      if(open_price<=0 || cur_price<=0) continue;

      double profitPoints = (type==POSITION_TYPE_BUY) ? (cur_price - open_price)/_Point : (open_price - cur_price)/_Point;
      if(profitPoints <= TrailingStart) continue;

      double new_sl = (type==POSITION_TYPE_BUY) ? cur_price - TrailingStep*_Point : cur_price + TrailingStep*_Point;
      new_sl = NormalizeDouble(new_sl, _Digits);

      double curTP = PositionGetDouble(POSITION_TP);
      double curSL = PositionGetDouble(POSITION_SL);
      bool shouldModify = false;
      if(type==POSITION_TYPE_BUY && (curSL==0.0 || new_sl > curSL)) shouldModify = true;
      if(type==POSITION_TYPE_SELL && (curSL==0.0 || new_sl < curSL)) shouldModify = true;
      if(shouldModify)
      {
         if(!trade.PositionModify(_Symbol, new_sl, curTP))
            Print("PositionModify failed: ", trade.ResultComment(), " rc=", trade.ResultRetcode());
      }
   }
}

int OnInit()
{
   hEMA_fast = iMA(_Symbol, SignalTimeframe, FastEMA, 0, MODE_EMA, PRICE_CLOSE);
   hEMA_slow = iMA(_Symbol, SignalTimeframe, SlowEMA, 0, MODE_EMA, PRICE_CLOSE);
   hRSI      = iRSI(_Symbol, SignalTimeframe, RSIperiod, PRICE_CLOSE);
   hATR      = iATR(_Symbol, SignalTimeframe, ATRperiod);

   if(hEMA_fast==INVALID_HANDLE || hEMA_slow==INVALID_HANDLE || hRSI==INVALID_HANDLE || hATR==INVALID_HANDLE)
   {
      Print("OnInit: failed to create one or more indicator handles");
      return INIT_FAILED;
   }
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   if(hEMA_fast!=INVALID_HANDLE) IndicatorRelease(hEMA_fast);
   if(hEMA_slow!=INVALID_HANDLE) IndicatorRelease(hEMA_slow);
   if(hRSI!=INVALID_HANDLE) IndicatorRelease(hRSI);
   if(hATR!=INVALID_HANDLE) IndicatorRelease(hATR);
}

void OnTick()
{
   if(!IsMarketOpen()) return;
   ManageTrailing();

   const int COUNT = 2;
   double emaFast[2], emaSlow[2], rsiBuf[2], atrBuf[2];

   if(CopyBuffer(hEMA_fast, 0, 1, COUNT, emaFast) < COUNT) return;
   if(CopyBuffer(hEMA_slow, 0, 1, COUNT, emaSlow) < COUNT) return;
   if(CopyBuffer(hRSI,     0, 1, COUNT, rsiBuf)  < COUNT) return;
   if(CopyBuffer(hATR,     0, 1, COUNT, atrBuf)  < COUNT) return;

   double cur_fast  = emaFast[0];
   double prev_fast = emaFast[1];
   double cur_slow  = emaSlow[0];
   double prev_slow = emaSlow[1];
   double curRSI    = rsiBuf[0];
   double curATR    = atrBuf[0];

   if(curATR <= 0.0) return;

   bool crossUp   = (prev_fast < prev_slow && cur_fast > cur_slow);
   bool crossDown = (prev_fast > prev_slow && cur_fast < cur_slow);

   if(debug)
      Print("Signal check: crossUp=", crossUp, " crossDown=", crossDown,
            " RSI=", curRSI, " OpenPosBuy=", CountOpenPositions(1),
            " OpenPosSell=", CountOpenPositions(-1));

   if(crossUp && curRSI > RSImin && CountOpenPositions(1) < MaxTrades)
   {
      double price = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
      double sl = price - ATRMultiplier * curATR;
      double tp = price + ATRMultiplier * curATR * 2.0;
      double slPoints = MathAbs(price - sl) / _Point;
      double lot = GetLotSizeFromRisk(slPoints);

      trade.SetExpertMagicNumber(Magic);
      trade.SetDeviationInPoints(Slippage);
      if(!trade.Buy(lot, _Symbol, 0.0, sl, tp))
         Print("Buy failed: ", trade.ResultComment(), " rc=", trade.ResultRetcode());
   }
   else if(crossDown && curRSI < RSImax && CountOpenPositions(-1) < MaxTrades)
   {
      double price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
      double sl = price + ATRMultiplier * curATR;
      double tp = price - ATRMultiplier * curATR * 2.0;
      double slPoints = MathAbs(price - sl) / _Point;
      double lot = GetLotSizeFromRisk(slPoints);

      trade.SetExpertMagicNumber(Magic);
      trade.SetDeviationInPoints(Slippage);
      if(!trade.Sell(lot, _Symbol, 0.0, sl, tp))
         Print("Sell failed: ", trade.ResultComment(), " rc=", trade.ResultRetcode());
   }
}
//+------------------------------------------------------------------+