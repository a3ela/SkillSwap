import { Link } from "react-router-dom";
import { 
  Search, 
  Video, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap,
  ArrowRight 
} from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="relative bg-gradient-to-b from-primary-50 to-white overflow-hidden pt-16 pb-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
              New: Video Mentorship Sessions
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
              Master new skills by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                teaching what you know
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join a community of lifelong learners. Swap skills, share knowledge, and grow together in 1-on-1 video sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30 transition-all duration-200 transform hover:-translate-y-1"
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/matches"
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Browse Skills
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      <div className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="5,000+" label="Active Users" />
            <StatItem number="1,200+" label="Skills Listed" />
            <StatItem number="15k+" label="Sessions Completed" />
            <StatItem number="4.9/5" label="User Rating" />
          </div>
        </div>
      </div>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">How it works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Better learning through connection
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We removed the friction from finding a mentor. Here is how you can start swapping skills today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={Search} 
              title="Smart Matching" 
              desc="Our algorithm connects you with users who want to learn what you teach, and teach what you want to learn."
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={Video} 
              title="Virtual Sessions" 
              desc="Integrated video calls and whiteboards make remote learning feel like you're in the same room."
              color="bg-purple-500"
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Track Progress" 
              desc="Set goals, track hours, and earn verified skill badges to showcase on your profile."
              color="bg-green-500"
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                A safe community for <br/> serious learners.
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                We take quality seriously. SkillSwap is built on trust, verification, and mutual respect.
              </p>
              
              <div className="mt-8 space-y-4">
                <TrustItem icon={Shield} title="Verified Profiles" desc="All users go through email and social verification." />
                <TrustItem icon={Users} title="Community Moderated" desc="Rating system ensures high-quality interactions." />
                <TrustItem icon={Zap} title="Instant Scheduling" desc="Book sessions directly without back-and-forth emails." />
              </div>
            </div>
            <div className="mt-12 lg:mt-0 relative">
              <div className="absolute inset-0 bg-primary-100 transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-50"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center space-x-4 mb-6">
                   <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                   <div>
                     <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                     <div className="h-3 w-20 bg-gray-200 rounded"></div>
                   </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-100 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                  <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="h-8 w-24 bg-primary-100 rounded-md"></div>
                  <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ number, label }) => (
  <div>
    <div className="text-3xl font-bold text-gray-900">{number}</div>
    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
    <div className={`inline-flex items-center justify-center p-3 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors mb-6`}>
      <Icon className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const TrustItem = ({ icon: Icon, title, desc }) => (
  <div className="flex">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-500 text-white">
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="ml-4">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-base text-gray-500">{desc}</p>
    </div>
  </div>
);

export default Home;