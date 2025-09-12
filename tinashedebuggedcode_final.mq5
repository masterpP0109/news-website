//+------------------------------------------------------------------+
//| ARF_MB_EA_Professional.mq5                                      |
//| Professional-grade EA with FVG, Liquidity Sweeps & S/R          |
//| Fully corrected and debugged                                    |
//+------------------------------------------------------------------+
#property version   "2.1"
#property strict
#include <Trade\Trade.mqh>
#property description "Advanced FVG + Liquidity Sweep + S/R EA"
#property description "Includes proper SuperTrend, risk management"
#property description "and error handling for live trading"

CTrade trade;

// -------------------- USER INPUTS ----------------------------------
input group "Symbol & Risk"
input string   SymbolListCSV           = "EURUSD,GBPUSD,USDJPY,XAUUSD";
input double   Risk_Percent            = 1.0;
input bool     DebugMode               = true;

input group "Strategy Filters"
input int      SuperTrend_ATRPeriod    = 10;
input double   SuperTrend_Mult         = 2.0;
input int      EMA50_Period            = 50;
input int      ADX_Period              = 14;
input int      Donchian_Period         = 20;

input group "FVG Settings"
input int      FVG_LookbackBars        = 30;
input double   FVG_Entry_Buffer_Pct    = 10.0;
input double   FVG_Min_Gap_ATR         = 0.5;

input group "Liquidity Sweep Settings"
input int      LiquiditySweep_Lookback   = 20;
input double   LiquiditySweep_Threshold  = 0.001;
input bool     EnableLiquiditySweepCheck = true;

input group "S/R & Targeting"
input int      SR_SwingPeriod         = 5;
input bool     Use_SR_for_Targets     = true;
input double   Stop_ATR_Multiplier     = 2.0;
input double   Take_ATR_Multiplier     = 3.0;
input double   SR_Padding_ATR         = 0.5;
input double   SR_Confluence_ATR_Mult = 1.2;

input group "Notifications"
input bool     EnablePushNotifications = true;
input bool     EnableChartArrows       = true;
input int      Signal_Detail_Level    = 2;
input int      Max_Arrows_To_Keep     = 50;

input group "Volatility Multipliers"
input double   Volatility1             = 1.0;
input double   Volatility2             = 1.5;
input double   Volatility3             = 2.0;

input group "Trade Execution"
input int      Max_Trades_Per_Symbol   = 1;
input int      Min_Bars_Between_Trades = 3;
input int      Max_Slippage            = 3;

input group "Debug"
input int      DebugModeLevel          = 0;

// -------------------- STRUCTURES -----------------------------------
struct SSignalDetails
{
    string   symbol;
    string   direction;
    double   entryPrice;
    double   stopLoss;
    double   takeProfit;
    double   lotSize;
    double   srLevel1;
    double   srLevel2;
    string   message;
};

struct SIndicators
{
    bool     isBull;
    double   atr;
    double   stValue;
    double   ema50;
    double   adx;
    double   donchianHigh;
    double   donchianLow;
    double   previousST;
};

struct STradeHistory
{
    datetime time;
    double   entry;
    double   stop;
    double   target;
    int      type;
};

struct SCachedIndicators
{
    datetime lastBarTime;
    double   atr;
    double   stValue;
    double   ema50;
    double   adx;
    double   donchianHigh;
    double   donchianLow;
};

// -------------------- GLOBAL VARIABLES -----------------------------
string            SymbolsArray[];
double            LotSizeForSymbol[];
datetime          lastSignalTime[];
datetime          lastTradeTime[];
STradeHistory     tradeHistory[];

ENUM_TIMEFRAMES   Timeframes[] = { PERIOD_H1, PERIOD_M15, PERIOD_M5 };
double            superTrendValues[][3];
SCachedIndicators cachedIndicators[];

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    // Parse symbol list
    int symbolCount = StringSplit(SymbolListCSV, ',', SymbolsArray);
    int tfCount = ArraySize(Timeframes);

    // Initialize arrays
    ArrayResize(SymbolsArray, symbolCount);
    ArrayResize(LotSizeForSymbol, symbolCount);
    ArrayResize(lastSignalTime, symbolCount * tfCount);
    ArrayResize(lastTradeTime, symbolCount);
    ArrayResize(tradeHistory, symbolCount);
    ArrayResize(superTrendValues, symbolCount * tfCount);
    ArrayResize(cachedIndicators, symbolCount * tfCount);

    for(int i = 0; i < symbolCount; i++)
    {
        string trimmedSymbol = StringTrim(SymbolsArray[i]);
        if(i < ArraySize(SymbolsArray))
            SymbolsArray[i] = trimmedSymbol;

        // Check if symbol is tradable
        if(SymbolInfoInteger(SymbolsArray[i], SYMBOL_TRADE_MODE) == SYMBOL_TRADE_MODE_DISABLED)
        {
            Print("Symbol ", SymbolsArray[i], " is not tradable. Removing from list.");
            ArrayRemove(SymbolsArray, i, 1);
            symbolCount--;
            i--;
            continue;
        }

        if(!SymbolSelect(SymbolsArray[i], true))
            Print("Failed to select symbol: ", SymbolsArray[i]);
    }

    Print("EA initialized. Monitoring ", symbolCount, " symbols");
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // Clean up chart objects (only our arrows)
    int total = ObjectsTotal(0, -1, OBJ_ARROW);
    for(int i = total-1; i >= 0; i--)
    {
        string name = ObjectName(0, i, -1, OBJ_ARROW);
        if(StringFind(name, "BUY_") >= 0 || StringFind(name, "SELL_") >= 0)
            ObjectDelete(0, name);
    }
    Print("EA deinitialized");
}

//+------------------------------------------------------------------+
//| Get indicator values for a symbol (with caching)                 |
//+------------------------------------------------------------------+
SIndicators GetIndicators(const string sym, const ENUM_TIMEFRAMES tf, const int symbolIndex, const int tfIndex)
{
    SIndicators indicators;
    ZeroMemory(indicators);

    int cacheIndex = symbolIndex * ArraySize(Timeframes) + tfIndex;

    // Check if we have cached values for this bar
    datetime currentBarTime = iTime(sym, tf, 0);
    if(cacheIndex >= 0 && cacheIndex < ArraySize(cachedIndicators) &&
       cachedIndicators[cacheIndex].lastBarTime == currentBarTime)
    {
        // Return cached values
        indicators.atr = cachedIndicators[cacheIndex].atr;
        indicators.stValue = cachedIndicators[cacheIndex].stValue;
        indicators.ema50 = cachedIndicators[cacheIndex].ema50;
        indicators.adx = cachedIndicators[cacheIndex].adx;
        indicators.donchianHigh = cachedIndicators[cacheIndex].donchianHigh;
        indicators.donchianLow = cachedIndicators[cacheIndex].donchianLow;

        // Calculate trend from stored SuperTrend value
        int stIndex = symbolIndex * ArraySize(Timeframes) + tfIndex;
        if(stIndex >= 0 && stIndex < ArraySize(superTrendValues) && superTrendValues[stIndex][1] != 0)
            indicators.isBull = (superTrendValues[stIndex][1] > 0);
        else
            indicators.isBull = (iClose(sym, tf, 0) > indicators.stValue);

        return indicators;
    }

    // Get ATR first
    int atrHandle = iATR(sym, tf, SuperTrend_ATRPeriod);
    if(atrHandle != INVALID_HANDLE)
    {
        double atrBuffer[1];
        if(CopyBuffer(atrHandle, 0, 1, 1, atrBuffer) > 0)
            indicators.atr = atrBuffer[0];
        IndicatorRelease(atrHandle);
    }
    if(indicators.atr <= 0) return indicators;

    // Calculate proper SuperTrend with flip logic
    double hl2 = (iHigh(sym, tf, 1) + iLow(sym, tf, 1)) / 2.0;
    double finalUpper = hl2 + SuperTrend_Mult * indicators.atr;
    double finalLower = hl2 - SuperTrend_Mult * indicators.atr;
    double close = iClose(sym, tf, 1);

    // Get previous SuperTrend value from history
    int stIndex = symbolIndex * ArraySize(Timeframes) + tfIndex;
    double previousST = (stIndex >= 0 && stIndex < ArraySize(superTrendValues) && superTrendValues[stIndex][0] != 0) ?
                        superTrendValues[stIndex][0] : finalLower;
    int previousTrend = (stIndex >= 0 && stIndex < ArraySize(superTrendValues) && superTrendValues[stIndex][1] != 0) ?
                        (int)superTrendValues[stIndex][1] : 1;

    // Store previous value for next calculation
    if(stIndex >= 0 && stIndex < ArraySize(superTrendValues))
        superTrendValues[stIndex][2] = previousST;

    // Calculate current SuperTrend with proper flip logic
    if(previousTrend > 0) // Previous trend was bullish
    {
        if(close > finalLower)
        {
            indicators.stValue = finalLower;
            indicators.isBull = true;
        }
        else
        {
            indicators.stValue = finalUpper;
            indicators.isBull = false;
        }
    }
    else // Previous trend was bearish
    {
        if(close < finalUpper)
        {
            indicators.stValue = finalUpper;
            indicators.isBull = false;
        }
        else
        {
            indicators.stValue = finalLower;
            indicators.isBull = true;
        }
    }

    // Store current values for next calculation
    if(stIndex >= 0 && stIndex < ArraySize(superTrendValues))
    {
        superTrendValues[stIndex][0] = indicators.stValue;
        superTrendValues[stIndex][1] = indicators.isBull ? 1 : -1;
    }

    // EMA
    int emaHandle = iMA(sym, tf, EMA50_Period, 0, MODE_EMA, PRICE_CLOSE);
    if(emaHandle != INVALID_HANDLE)
    {
        double emaBuffer[1];
        if(CopyBuffer(emaHandle, 0, 1, 1, emaBuffer) > 0)
            indicators.ema50 = emaBuffer[0];
        IndicatorRelease(emaHandle);
    }

    // ADX
    int adxHandle = iADX(sym, tf, ADX_Period);
    if(adxHandle != INVALID_HANDLE)
    {
        double adxBuffer[1];
        if(CopyBuffer(adxHandle, 0, 1, 1, adxBuffer) > 0)
            indicators.adx = adxBuffer[0];
        IndicatorRelease(adxHandle);
    }

    // Donchian Channel
    int highestIndex = iHighest(sym, tf, MODE_HIGH, Donchian_Period, 1);
    int lowestIndex = iLowest(sym, tf, MODE_LOW, Donchian_Period, 1);
    if(highestIndex >= 0) indicators.donchianHigh = iHigh(sym, tf, highestIndex);
    if(lowestIndex >= 0) indicators.donchianLow = iLow(sym, tf, lowestIndex);

    // Cache the values
    if(cacheIndex >= 0 && cacheIndex < ArraySize(cachedIndicators))
    {
        cachedIndicators[cacheIndex].lastBarTime = currentBarTime;
        cachedIndicators[cacheIndex].atr = indicators.atr;
        cachedIndicators[cacheIndex].stValue = indicators.stValue;
        cachedIndicators[cacheIndex].ema50 = indicators.ema50;
        cachedIndicators[cacheIndex].adx = indicators.adx;
        cachedIndicators[cacheIndex].donchianHigh = indicators.donchianHigh;
        cachedIndicators[cacheIndex].donchianLow = indicators.donchianLow;
    }

    return indicators;
}

//+------------------------------------------------------------------+
//| Get symbol index in SymbolsArray                                 |
//+------------------------------------------------------------------+
int GetSymbolIndex(const string sym)
{
    for(int i = 0; i < ArraySize(SymbolsArray); i++)
        if(SymbolsArray[i] == sym)
            return i;
    return -1;
}

//+------------------------------------------------------------------+
//| Find Fair Value Gap (reverse loop for most recent)               |
//+------------------------------------------------------------------+
bool FindMostRecentFVG(const string sym, const ENUM_TIMEFRAMES tf, const int lookback,
                       double &fvgLow, double &fvgHigh, bool &isBull, int &foundShift)
{
    int bars = MathMin(Bars(sym, tf), lookback);
    if(bars < 3) return false;

    int atrHandle = iATR(sym, tf, SuperTrend_ATRPeriod);
    double atr = 0;
    if(atrHandle != INVALID_HANDLE)
    {
        double atrBuffer[1];
        if(CopyBuffer(atrHandle, 0, 1, 1, atrBuffer) > 0)
            atr = atrBuffer[0];
        IndicatorRelease(atrHandle);
    }
    double minGap = atr * FVG_Min_Gap_ATR;

    // Reverse loop to find the most recent FVG first
    for(int i = bars-1; i >= 3; i--)
    {
        // Check for bullish FVG (current low > previous high)
        if(iLow(sym, tf, i-2) > iHigh(sym, tf, i))
        {
            double gapSize = iLow(sym, tf, i-2) - iHigh(sym, tf, i);
            if(gapSize >= minGap)
            {
                fvgLow = iHigh(sym, tf, i);
                fvgHigh = iLow(sym, tf, i-2);
                isBull = true;
                foundShift = i-2;
                return true;
            }
        }

        // Check for bearish FVG (current high < previous low)
        if(iHigh(sym, tf, i-2) < iLow(sym, tf, i))
        {
            double gapSize = iLow(sym, tf, i) - iHigh(sym, tf, i-2);
            if(gapSize >= minGap)
            {
                fvgLow = iHigh(sym, tf, i-2);
                fvgHigh = iLow(sym, tf, i);
                isBull = false;
                foundShift = i-2;
                return true;
            }
        }
    }

    return false;
}

//+------------------------------------------------------------------+
//| Check if price is inside FVG zone                               |
//+------------------------------------------------------------------+
bool IsPriceInsideFVG(const string sym, const ENUM_TIMEFRAMES tf,
                      const double fvgLow, const double fvgHigh, const double bufferPct)
{
    if(fvgLow == 0 || fvgHigh == 0) return false;

    double buffer = (fvgHigh - fvgLow) * bufferPct / 100.0;
    double currentLow = iLow(sym, tf, 0);
    double currentHigh = iHigh(sym, tf, 0);

    return (currentHigh >= fvgLow - buffer) && (currentLow <= fvgHigh + buffer);
}

//+------------------------------------------------------------------+
//| Confirm price bounce from FVG                                   |
//+------------------------------------------------------------------+
bool ConfirmBounce(const string sym, const ENUM_TIMEFRAMES tf, const bool isBull)
{
    // More robust confirmation: check for bullish/bearish engulfing
    if(isBull)
    {
        return (iClose(sym, tf, 0) > iOpen(sym, tf, 0)) &&
               (iClose(sym, tf, 0) > iClose(sym, tf, 1)) &&
               (iOpen(sym, tf, 0) < iClose(sym, tf, 1));
    }
    else
    {
        return (iClose(sym, tf, 0) < iOpen(sym, tf, 0)) &&
               (iClose(sym, tf, 0) < iClose(sym, tf, 1)) &&
               (iOpen(sym, tf, 0) > iClose(sym, tf, 1));
    }
}

//+------------------------------------------------------------------+
//| Check for liquidity sweep (Low) - Improved logic                |
//+------------------------------------------------------------------+
bool CheckLiquiditySweepLow(const string sym, const ENUM_TIMEFRAMES tf, const int lookback,
                            const double threshold, int &swingLowBarIndex)
{
    int bars = MathMin(Bars(sym, tf), lookback);
    if(bars < 5) return false;

    // Find the most recent swing low
    double lowestLow = DBL_MAX;
    int lowestIndex = -1;

    for(int i = 2; i < bars-2; i++)
    {
        if(iLow(sym, tf, i) < iLow(sym, tf, i-1) &&
           iLow(sym, tf, i) < iLow(sym, tf, i-2) &&
           iLow(sym, tf, i) < iLow(sym, tf, i+1) &&
           iLow(sym, tf, i) < iLow(sym, tf, i+2))
        {
            if(iLow(sym, tf, i) < lowestLow)
            {
                lowestLow = iLow(sym, tf, i);
                lowestIndex = i;
            }
        }
    }

    if(lowestIndex == -1) return false;

    // Check if price swept below this low (from swing bar to current)
    for(int i = lowestIndex-1; i >= 0; i--)
    {
        if(iLow(sym, tf, i) < lowestLow - threshold)
        {
            swingLowBarIndex = lowestIndex;
            return true;
        }
    }

    return false;
}

//+------------------------------------------------------------------+
//| Check for liquidity sweep (High) - Improved logic               |
//+------------------------------------------------------------------+
bool CheckLiquiditySweepHigh(const string sym, const ENUM_TIMEFRAMES tf, const int lookback,
                             const double threshold, int &swingHighBarIndex)
{
    int bars = MathMin(Bars(sym, tf), lookback);
    if(bars < 5) return false;

    // Find the most recent swing high
    double highestHigh = -DBL_MAX;
    int highestIndex = -1;

    for(int i = 2; i < bars-2; i++)
    {
        if(iHigh(sym, tf, i) > iHigh(sym, tf, i-1) &&
           iHigh(sym, tf, i) > iHigh(sym, tf, i-2) &&
           iHigh(sym, tf, i) > iHigh(sym, tf, i+1) &&
           iHigh(sym, tf, i) > iHigh(sym, tf, i+2))
        {
            if(iHigh(sym, tf, i) > highestHigh)
            {
                highestHigh = iHigh(sym, tf, i);
                highestIndex = i;
            }
        }
    }

    if(highestIndex == -1) return false;

    // Check if price swept above this high (from swing bar to current)
    for(int i = highestIndex-1; i >= 0; i--)
    {
        if(iHigh(sym, tf, i) > highestHigh + threshold)
        {
            swingHighBarIndex = highestIndex;
            return true;
        }
    }

    return false;
}

//+------------------------------------------------------------------+
//| Calculate position size based on risk (improved for all instruments)
//+------------------------------------------------------------------+
double CalculateLotSize(const string sym, const double riskPercent,
                        const double atr, const double volMultiplier)
{
    double equity = AccountInfoDouble(ACCOUNT_EQUITY);
    double riskAmount = equity * riskPercent / 100.0;
    double tickValue = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_VALUE);
    double point = SymbolInfoDouble(sym, SYMBOL_POINT);

    // Handle cases where tickValue might be zero or incorrect
    if(tickValue <= 0 || point <= 0)
    {
        // Use contract size and conversion for proper calculation
        double contractSize = SymbolInfoDouble(sym, SYMBOL_TRADE_CONTRACT_SIZE);
        double tickSize = SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_SIZE);

        if(contractSize > 0 && tickSize > 0)
        {
            // For forex, contract size is usually 100,000
            // For commodities, we need to consider the conversion
            if(StringFind(sym, "XAU") >= 0 || StringFind(sym, "XAG") >= 0)
            {
                // Gold, Silver - typically quoted per ounce
                tickValue = tickSize * contractSize / point;
            }
            else
            {
                // Forex and other instruments
                tickValue = tickSize * contractSize * SymbolInfoDouble(sym, SYMBOL_TRADE_TICK_VALUE) / point;
            }
        }
        else
        {
            // Final fallback
            tickValue = point * 100000;
        }
    }

    if(point <= 0) point = 0.00001;
    if(tickValue <= 0) tickValue = point * 100000;

    double slDistance = atr * Stop_ATR_Multiplier * volMultiplier;
    double riskPoints = slDistance / point;
    double moneyRisk = riskPoints * tickValue;

    if(moneyRisk <= 0) return 0.01;

    double lotSize = riskAmount / moneyRisk;
    double minLot = SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN);
    double maxLot = SymbolInfoDouble(sym, SYMBOL_VOLUME_MAX);
    double lotStep = SymbolInfoDouble(sym, SYMBOL_VOLUME_STEP);

    lotSize = MathMax(lotSize, minLot);
    lotSize = MathMin(lotSize, maxLot);
    lotSize = MathRound(lotSize / lotStep) * lotStep;

    return lotSize;
}

//+------------------------------------------------------------------+
//| Find recent swing high (Resistance)                             |
//+------------------------------------------------------------------+
double FindRecentSwingHigh(const string sym, const ENUM_TIMEFRAMES tf,
                           const int swingPeriod, const int startBar=0)
{
    int bars = MathMin(Bars(sym, tf), startBar + 30);
    if(bars < swingPeriod * 2) return 0;

    double swingHigh = -DBL_MAX;

    for(int i = startBar + swingPeriod; i < bars - swingPeriod; i++)
    {
        bool isSwingHigh = true;
        double candidateHigh = iHigh(sym, tf, i);

        for(int j = 1; j <= swingPeriod; j++)
        {
            if(candidateHigh <= iHigh(sym, tf, i+j) ||
               candidateHigh <= iHigh(sym, tf, i-j))
            {
                isSwingHigh = false;
                break;
            }
        }

        if(isSwingHigh && candidateHigh > swingHigh)
            swingHigh = candidateHigh;
    }

    return (swingHigh != -DBL_MAX) ? swingHigh : 0;
}

//+------------------------------------------------------------------+
//| Find recent swing low (Support)                                 |
//+------------------------------------------------------------------+
double FindRecentSwingLow(const string sym, const ENUM_TIMEFRAMES tf,
                          const int swingPeriod, const int startBar=0)
{
    int bars = MathMin(Bars(sym, tf), startBar + 30);
    if(bars < swingPeriod * 2) return 0;

    double swingLow = DBL_MAX;

    for(int i = startBar + swingPeriod; i < bars - swingPeriod; i++)
    {
        bool isSwingLow = true;
        double candidateLow = iLow(sym, tf, i);

        for(int j = 1; j <= swingPeriod; j++)
        {
            if(candidateLow >= iLow(sym, tf, i+j) ||
               candidateLow >= iLow(sym, tf, i-j))
            {
                isSwingLow = false;
                break;
            }
        }

        if(isSwingLow && candidateLow < swingLow)
            swingLow = candidateLow;
    }

    return (swingLow != DBL_MAX) ? swingLow : 0;
}

//+------------------------------------------------------------------+
//| Clean up old arrows from chart (only our arrows)                |
//+------------------------------------------------------------------+
void CleanOldArrows(const string sym)
{
    int total = ObjectsTotal(0, -1, OBJ_ARROW);
    if(total <= Max_Arrows_To_Keep) return;

    // Find the oldest arrows and remove them (only our arrows)
    datetime oldestTimes[];
    ArrayResize(oldestTimes, total);
    int count = 0;

    for(int i = 0; i < total; i++)
    {
        string name = ObjectName(0, i, -1, OBJ_ARROW);
        if(StringFind(name, sym + "_") == 0 &&
          (StringFind(name, "BUY_") > 0 || StringFind(name, "SELL_") > 0))
        {
            long createTimeLong = 0;
            if(ObjectGetInteger(0, name, OBJPROP_CREATETIME, createTimeLong))
            {
                oldestTimes[count++] = (datetime)createTimeLong;
            }
            else
            {
                // If ObjectGetInteger fails, skip this object
                continue;
            }
        }
    }

    if(count <= Max_Arrows_To_Keep) return;

    // Sort to find the oldest (ascending order)
    ArraySort(oldestTimes);
    int arrowsToRemove = count - Max_Arrows_To_Keep;

    for(int i = 0; i < arrowsToRemove; i++)
    {
        for(int j = 0; j < total; j++)
        {
            string name = ObjectName(0, j, -1, OBJ_ARROW);
            if(StringFind(name, sym + "_") == 0 &&
              (StringFind(name, "BUY_") > 0 || StringFind(name, "SELL_") > 0))
            {
                long createTimeLong = 0;
                if(ObjectGetInteger(0, name, OBJPROP_CREATETIME, createTimeLong))
                {
                    if((datetime)createTimeLong == oldestTimes[i])
                    {
                        ObjectDelete(0, name);
                        break;
                    }
                }
                else
                {
                    // If ObjectGetInteger fails, skip this object
                    continue;
                }
            }
        }
    }
}

//+------------------------------------------------------------------+
//| Send structured signal notification                             |
//+------------------------------------------------------------------+
void SendStructuredSignal(const SSignalDetails &details)
{
    if(DebugModeLevel >= 2) return; // Skip notifications in level 2

    int digits = (int)SymbolInfoInteger(details.symbol, SYMBOL_DIGITS);
    string signalText = "";

    switch(Signal_Detail_Level)
    {
        case 0:
            signalText = StringFormat("%s %s | Entry: %." + IntegerToString(digits) + "f",
                details.symbol, details.direction, details.entryPrice);
            break;

        case 1:
            signalText = StringFormat("%s %s | EN: %." + IntegerToString(digits) + "f | SL: %." + IntegerToString(digits) + "f | TP: %." + IntegerToString(digits) + "f | Lot: %.2f",
                details.symbol, details.direction, details.entryPrice,
                details.stopLoss, details.takeProfit, details.lotSize);
            break;

        case 2:
            signalText = StringFormat("SIGNAL - %s %s\n", details.symbol, details.direction);
            signalText += StringFormat("ENTRY: %." + IntegerToString(digits) + "f\n", details.entryPrice);
            signalText += StringFormat("STOP LOSS: %." + IntegerToString(digits) + "f\n", details.stopLoss);
            signalText += StringFormat("TAKE PROFIT: %." + IntegerToString(digits) + "f\n", details.takeProfit);
            signalText += StringFormat("LOT SIZE: %.2f\n", details.lotSize);
            signalText += StringFormat("TARGET S/R: %." + IntegerToString(digits) + "f\n", details.srLevel1);
            signalText += StringFormat("SUPPORTING S/R: %." + IntegerToString(digits) + "f\n", details.srLevel2);
            signalText += StringFormat("MESSAGE: %s", details.message);
            break;
    }

    Print(signalText);
    if(EnablePushNotifications)
        SendNotification(signalText);
}

//+------------------------------------------------------------------+
//| Plot signal arrow on chart                                      |
//+------------------------------------------------------------------+
void PlotSignalArrow(const string sym, const datetime time, const double price, const bool isBuy)
{
    if(DebugModeLevel >= 1) return; // Skip plotting in level 1 or higher

    CleanOldArrows(sym); // Clean up before adding new ones

    string arrowName = sym + "_" + (isBuy ? "BUY" : "SELL") + "_" + IntegerToString((int)time);

    if(ObjectFind(0, arrowName) < 0)
    {
        ObjectCreate(0, arrowName, OBJ_ARROW, 0, time, price);
        ObjectSetInteger(0, arrowName, OBJPROP_ARROWCODE, isBuy ? 233 : 234);
        ObjectSetInteger(0, arrowName, OBJPROP_COLOR, isBuy ? clrLime : clrRed);
        ObjectSetInteger(0, arrowName, OBJPROP_WIDTH, 2);
        ObjectSetInteger(0, arrowName, OBJPROP_BACK, false);
    }
}

//+------------------------------------------------------------------+
//| Check if we can trade for this symbol                           |
//+------------------------------------------------------------------+
bool CanTrade(const string sym)
{
    int symbolIndex = GetSymbolIndex(sym);
    if(symbolIndex < 0) return false;

    // Check if we've already traded recently
    if(TimeCurrent() - lastTradeTime[symbolIndex] < PeriodSeconds(PERIOD_CURRENT) * Min_Bars_Between_Trades)
        return false;

    // Check open positions for this symbol
    int positions = PositionsTotal();
    int tradesCount = 0;

    for(int i = 0; i < positions; i++)
    {
        ulong ticket = PositionGetTicket(i);
        if(ticket == 0) continue;
        if(!PositionSelectByTicket(ticket)) continue;
        if(PositionGetString(POSITION_SYMBOL) == sym)
            tradesCount++;
    }

    return tradesCount < Max_Trades_Per_Symbol;
}

//+------------------------------------------------------------------+
//| Execute trade with proper error handling                        |
//+------------------------------------------------------------------+
bool ExecuteTrade(const string sym, const double volume, const int orderType,
                  const double price, const double sl, const double tp, const string comment)
{
    MqlTradeRequest request;
    ZeroMemory(request);
    MqlTradeResult result;
    ZeroMemory(result);

    request.action = TRADE_ACTION_DEAL;
    request.symbol = sym;
    request.volume = volume;
    request.type = (orderType == ORDER_TYPE_BUY) ? ORDER_TYPE_BUY : ORDER_TYPE_SELL;
    request.price = price;
    request.sl = sl;
    request.tp = tp;
    request.deviation = Max_Slippage;
    request.comment = comment;

    // Get current price at execution time to avoid requotes
    if(orderType == ORDER_TYPE_BUY)
        request.price = SymbolInfoDouble(sym, SYMBOL_ASK);
    else
        request.price = SymbolInfoDouble(sym, SYMBOL_BID);

    bool success = OrderSend(request, result);

    if(success && result.retcode == TRADE_RETCODE_DONE)
    {
        Print("Trade executed: ", sym, " ", EnumToString((ENUM_ORDER_TYPE)orderType),
              " Volume: ", volume, " Price: ", request.price);
        return true;
    }
    else
    {
        Print("Trade failed: ", sym, " Error: ", GetLastError(),
              " Retcode: ", result.retcode, " Comment: ", result.comment);
        return false;
    }
}

//+------------------------------------------------------------------+
//| OnTick function                                                 |
//+------------------------------------------------------------------+
void OnTick()
{
    double VolatilityMultipliers[] = {Volatility1, Volatility2, Volatility3};
    int tfCount = ArraySize(Timeframes);

    for(int s = 0; s < ArraySize(SymbolsArray); s++)
    {
        string sym = SymbolsArray[s];

        // Check if symbol has enough historical data
        if(Bars(sym, _Period) < 50) continue;

        for(int tfIdx = 0; tfIdx < tfCount; tfIdx++)
        {
            ENUM_TIMEFRAMES tf = Timeframes[tfIdx];

            // Check if this timeframe has enough data
            if(Bars(sym, tf) < 50) continue;

            datetime currentTime = iTime(sym, tf, 0);
            int signalIndex = s * tfCount + tfIdx;

            // Check if we've already processed this bar
            if(signalIndex >= 0 && signalIndex < ArraySize(lastSignalTime) &&
               lastSignalTime[signalIndex] == currentTime) continue;
            lastSignalTime[signalIndex] = currentTime;

            // Get indicator values
            SIndicators ind = GetIndicators(sym, tf, s, tfIdx);
            if(ind.adx < 15 || ind.atr <= 0) continue; // Low volatility or invalid ATR

            double currentClose = iClose(sym, tf, 0);

            // Trend filter checks
            if(ind.isBull && currentClose < ind.ema50) continue;
            if(!ind.isBull && currentClose > ind.ema50) continue;

            if(ind.isBull && currentClose < ind.donchianHigh) continue;
            if(!ind.isBull && currentClose > ind.donchianLow) continue;

            // Liquidity sweep check
            bool validSweep = false;
            int swingBarIndex = -1;

            if(EnableLiquiditySweepCheck)
            {
                if(ind.isBull)
                    validSweep = CheckLiquiditySweepLow(sym, tf, LiquiditySweep_Lookback,
                                                       LiquiditySweep_Threshold, swingBarIndex);
                else
                    validSweep = CheckLiquiditySweepHigh(sym, tf, LiquiditySweep_Lookback,
                                                        LiquiditySweep_Threshold, swingBarIndex);

                if(!validSweep) continue;
            }

            // FVG detection
            double fvgLow, fvgHigh;
            bool isBullFVG;
            int fvgShift;

            if(!FindMostRecentFVG(sym, tf, FVG_LookbackBars, fvgLow, fvgHigh, isBullFVG, fvgShift))
                continue;

            // FVG direction must match trend direction
            if(isBullFVG != ind.isBull) continue;

            // FVG must form after liquidity sweep (if sweep was found)
            if(validSweep && swingBarIndex >= 0 && fvgShift > swingBarIndex) continue;

            // Price must be inside FVG zone
            if(!IsPriceInsideFVG(sym, tf, fvgLow, fvgHigh, FVG_Entry_Buffer_Pct)) continue;

            // Price must show bounce confirmation
            if(!ConfirmBounce(sym, tf, isBullFVG)) continue;

            // Find S/R levels
            double recentSwingHigh = FindRecentSwingHigh(sym, tf, SR_SwingPeriod, 1);
            double recentSwingLow = FindRecentSwingLow(sym, tf, SR_SwingPeriod, 1);

            // Calculate entry price
            double entryPrice = isBullFVG ? SymbolInfoDouble(sym, SYMBOL_ASK) :
                                           SymbolInfoDouble(sym, SYMBOL_BID);

            // Calculate stop loss and take profit with ATR-based padding
            double atrPadding = ind.atr * SR_Padding_ATR;
            double stopLoss = 0, takeProfit = 0;

            if(Use_SR_for_Targets)
            {
                if(isBullFVG)
                {
                    stopLoss = MathMin(recentSwingLow, fvgLow) - atrPadding;
                    takeProfit = recentSwingHigh;
                }
                else
                {
                    stopLoss = MathMax(recentSwingHigh, fvgHigh) + atrPadding;
                    takeProfit = recentSwingLow;
                }
            }
            else
            {
                double atrStop = ind.atr * Stop_ATR_Multiplier;
                double atrTake = ind.atr * Take_ATR_Multiplier;

                stopLoss = isBullFVG ? entryPrice - atrStop : entryPrice + atrStop;
                takeProfit = isBullFVG ? entryPrice + atrTake : entryPrice - atrTake;
            }

            // S/R confluence check with flexible ATR multiplier
            bool hasSRConfluence = false;

            if(Use_SR_for_Targets)
            {
                if(isBullFVG)
                {
                    double distanceToSupport = MathAbs(entryPrice - recentSwingLow);
                    if(distanceToSupport < ind.atr * SR_Confluence_ATR_Mult) hasSRConfluence = true;
                }
                else
                {
                    double distanceToResistance = MathAbs(entryPrice - recentSwingHigh);
                    if(distanceToResistance < ind.atr * SR_Confluence_ATR_Mult) hasSRConfluence = true;
                }

                if(!hasSRConfluence) continue;
            }

            // Check if we can trade this symbol
            if(!CanTrade(sym)) continue;

            // Process each volatility multiplier
            for(int v = 0; v < ArraySize(VolatilityMultipliers); v++)
            {
                double volMultiplier = VolatilityMultipliers[v];
                double lotSize = CalculateLotSize(sym, Risk_Percent, ind.atr, volMultiplier);

                if(lotSize < SymbolInfoDouble(sym, SYMBOL_VOLUME_MIN)) continue;

                // Prepare signal details
                SSignalDetails signal;
                signal.symbol = sym;
                signal.direction = isBullFVG ? "BUY" : "SELL";
                signal.entryPrice = entryPrice;
                signal.stopLoss = stopLoss;
                signal.takeProfit = takeProfit;
                signal.lotSize = lotSize;
                signal.srLevel1 = isBullFVG ? recentSwingHigh : recentSwingLow;
                signal.srLevel2 = isBullFVG ? recentSwingLow : recentSwingHigh;
                string tfString = "";
                switch(tf)
                {
                    case PERIOD_H1: tfString = "H1"; break;
                    case PERIOD_M15: tfString = "M15"; break;
                    case PERIOD_M5: tfString = "M5"; break;
                    default: tfString = "Unknown"; break;
                }
                signal.message = StringFormat("FVG+LS+SR | TF: %s | Vol: %.1f",
                                             tfString, volMultiplier);

                // Send notification
                SendStructuredSignal(signal);

                // Plot arrow on chart
                PlotSignalArrow(sym, currentTime, entryPrice, isBullFVG);

                // Execute trade if not in debug mode
                if(!DebugMode)
                {
                    if(ExecuteTrade(sym, lotSize,
                                   isBullFVG ? ORDER_TYPE_BUY : ORDER_TYPE_SELL,
                                   entryPrice, stopLoss, takeProfit, signal.message))
                    {
                        if(s >= 0 && s < ArraySize(lastTradeTime))
                            lastTradeTime[s] = TimeCurrent();
                    }
                }
            }
        }
    }
}
//+------------------------------------------------------------------+