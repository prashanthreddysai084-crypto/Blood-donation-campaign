import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Heart, Search, Users, Activity, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const HomePage = () => {
  const [upcomingCampaigns, setUpcomingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await campaignService.getAll({ limit: 3, status: 'UPCOMING' });
        setUpcomingCampaigns(res.data || []);
      } catch (err) {
        console.error('Failed to load home campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-red-50 via-white to-slate-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                Community Blood Campaign Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Give Blood. <br />
                <span className="text-red-600">Give Life.</span> Together.
              </h1>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Connect directly with certified community blood drives, manage donation capacity in real-time, and ensure every patient in need receives life-saving blood without delay.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/campaigns"
                  className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-600/25 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Find a Blood Drive
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs transition-all flex items-center gap-2"
                >
                  Register as Donor
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 text-slate-700">
                <div>
                  <div className="text-2xl font-black text-red-600">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Voluntary Drives</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Zero Fee</div>
                  <div className="text-xs text-slate-500 font-medium">Non-Commercial</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Verified</div>
                  <div className="text-xs text-slate-500 font-medium">Donation Records</div>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200 relative">
                <img
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1000&auto=format&fit=crop&q=80"
                  alt="Blood Donation Volunteers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-md">
                      Next Major Drive
                    </span>
                    <h3 className="text-xl font-bold mt-2">Community Youth Blood Camp</h3>
                    <p className="text-sm text-slate-200 mt-1">Gachibowli Community Hall, Hyderabad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Groups Grid */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Compatible Blood Groups Needed Daily
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every drop counts. Explore ongoing drives tailored specifically to your exact blood group.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodGroups.map((bg) => (
              <Link
                key={bg}
                to={`/campaigns?bloodGroup=${encodeURIComponent(bg)}`}
                className="group p-5 rounded-2xl bg-slate-50 hover:bg-red-600 border border-slate-200 hover:border-red-600 flex flex-col items-center justify-center transition-all shadow-xs hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 group-hover:bg-white text-red-600 group-hover:text-red-600 flex items-center justify-center font-black text-lg transition-colors">
                  {bg}
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-white mt-2 transition-colors">
                  Find Drives
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Upcoming Campaigns */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Join a Drive</div>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Upcoming Blood Campaigns</h2>
            <p className="text-sm text-slate-600 mt-1">Register now to reserve your donation slot and avoid queues.</p>
          </div>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700"
          >
            Browse All Campaigns
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : upcomingCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Heart className="w-10 h-10 text-red-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No campaigns scheduled right now</h3>
            <p className="text-sm text-slate-500 mt-1">Check back soon or create one from the Admin portal.</p>
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Step-by-step Process</span>
            <h2 className="text-3xl font-black mt-2">How Blood Donation Works</h2>
            <p className="text-sm text-slate-400 mt-2">Three simple steps to save up to 3 lives with a single donation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 relative">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Register as a Donor</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Create your account in under 60 seconds with your blood group, date of birth, and city.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 relative">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Book Your Slot</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Discover verified upcoming campaigns in your city and register for an available capacity slot.
              </p>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 relative">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Donate & Track</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Visit the camp venue, donate safely with medical staff, and get your donation verified digitally.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
