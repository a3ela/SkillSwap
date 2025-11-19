import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Together,
            <span className="text-primary-600"> Grow Together</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with peers to exchange skills, share knowledge, and build
            meaningful learning relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Start Learning
            </Link>
            <Link
              to="/matches"
              className="border border-primary-500 text-primary-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Find Partners
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose SkillSwap?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Matching",
                description:
                  "Find perfect learning partners based on skills, availability, and learning goals.",
                icon: "🎯",
              },
              {
                title: "Real-time Learning",
                description:
                  "Video sessions, shared whiteboards, and interactive tools for effective learning.",
                icon: "💬",
              },
              {
                title: "Progress Tracking",
                description:
                  "Track your learning journey, earn achievements, and level up your skills.",
                icon: "📈",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
