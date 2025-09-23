import { Button } from "@/components/ui/button";

const SignUp = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Get Subscribe To Our Latest News & Update
        </h2>
        <div className="max-w-md mx-auto flex space-x-4">
             <input
            type="Name"
            placeholder="Name"
            className="flex-1  px-2  py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
          />
          <input
            type="email"
            placeholder="Email"
            className="flex-1 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coral"
          />
          <Button className="bg-rose-400   py-2 rounded-[5px] hover:bg-coral/90 text-white px-10">
            Subscribe Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SignUp;