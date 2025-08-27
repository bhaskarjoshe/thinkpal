import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Button from "../ui/Button";
import BenfiitsContainer from "../containers/BenfiitsContainer";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Intro Section */}
      <section className="flex-1 w-full max-w-7xl mx-auto p-8 text-center">
        <div className="inline-block mb-4">
          <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-500">
            🚀 Powered by Advanced AI
          </span>
        </div>

        <h1 className="text-6xl md:text-5xl sm:text-4xl font-bold leading-tight bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Personal AI Learning Companion
        </h1>

        <p className="mt-6 text-lg sm:text-base max-w-3xl mx-auto text-gray-700">
          Experience the future of education with our intelligent tutoring
          system. Get personalized help, interactive explanations, and adaptive
          learning paths.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link to="/chat">
            <Button>Start Learning Now</Button>
          </Link>
          <Link to="/about">
            <button className="px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Learn More
            </button>
          </Link>
        </div>

        <img
          src="/ai-tutor.jpg"
          alt="AI Tutor"
          className="mx-auto mt-10 rounded-2xl w-full max-w-4xl shadow-xl"
        />
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose Our AI Tutor
          </h2>
          <BenfiitsContainer />
        </div>
      </section>

      {/* Outro Section */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-4xl sm:text-3xl font-bold mb-4">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-lg sm:text-base text-gray-700 max-w-2xl mx-auto mb-8">
          Join thousands of students who are already accelerating their
          education with our AI-powered tutoring platform.
        </p>
        <Link to="/chat">
          <Button>Start Your Learning Journey</Button>
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
