import { Button } from "@/components/ui/button";

const NewsletterSignup = () => {
  return (
    <section className=" py-16">
       <div className="bg-blue-700 text-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Daily Newsletter</h3>
        <p className="text-sm text-white/80 mb-3">Get the latest insights news from our team directly to your inbox</p>
        <Button className="bg-coral hover:bg-coral/90 text-white px-4 py-2 rounded text-sm font-medium w-full">
          Subscribe
        </Button>
      </div>
    </section>
  );
};

export default NewsletterSignup;