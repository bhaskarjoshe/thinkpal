import BenifitsCard from "../components/BenifitsCard";
import { GoBook, GoPeople } from "react-icons/go";
import { IoFlashOutline } from "react-icons/io5";
import { LuBrain } from "react-icons/lu";

const BenfiitsContainer = () => {
  return (
    <section className="py-16 px-8 bg-gray-50">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl sm:text-3xl max-sm:text-2xl font-bold mb-4">
          Why Choose ThinkPal?
        </h2>
        <p className="text-lg sm:text-base text-gray-700">
          Our platform combines cutting-edge AI technology with proven educational methods to deliver
          personalized learning experiences.
        </p>
      </div>

      {/* Benefits Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <BenifitsCard
          icon={<LuBrain size={32} />}
          title="AI-Powered Tutoring"
          description="Advanced AI that adapts to your learning style and provides personalized guidance"
        />
        <BenifitsCard
          icon={<GoBook size={32} />}
          title="Interactive Learning"
          description="Engage with dynamic content that responds to your questions in real-time"
        />
        <BenifitsCard
          icon={<IoFlashOutline size={32} />}
          title="Instant Feedback"
          description="Get immediate explanations and corrections to accelerate your learning"
        />
        <BenifitsCard
          icon={<GoPeople size={32} />}
          title="Progress Tracking"
          description="Monitor your learning journey with detailed analytics and achievements"
        />
      </div>
    </section>
  );
};

export default BenfiitsContainer;
