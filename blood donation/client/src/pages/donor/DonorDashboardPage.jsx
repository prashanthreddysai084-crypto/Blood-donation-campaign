import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService, registrationService } from '../../services';
import {
  Heart,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Droplet,
  MapPin,
  XCircle
} from 'lucide-react';

export const DonorDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, regRes] = await Promise.all([
          dashboardService.getDonorStats(),
          registrationService.getMyRegistrations({ limit: 5 })
        ]);
        setStats(statsRes.data);
        setRecentRegistrations(regRes.data || []);
      } catch (err) {
        console.error('Failed to load donor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    try {
      await registrationService.cancelRegistration(id);
      setRecentRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? { ...reg, status: 'CANCELLED' } : reg))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Hero */}
      <div className="bg-linear-to-r from-red-600 to-rose-700 rounded-3xl p-8 sm:p-10 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider backdrop-blur-xs">
            Donor Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3">
            Welcome, {user?.name}!
          </h1>
          <p className="text-red-100 text-sm sm:text-base mt-2 leading-relaxed">
            Thank you for being a committed lifesaver. Your donations make a direct difference in our community hospitals.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/campaigns"
              className="px-5 py-2.5 rounded-xl bg-white text-red-700 font-bold text-sm shadow-sm hover:bg-red-50 transition-colors inline-flex items-center gap-2"
            >
              Browse Active Drives
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/profile"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
            >
              Update Profile
            </Link>
          </div>
        </div>
        <div className="absolute right-6 -bottom-6 opacity-20 hidden md:block">
          <Heart className="w-64 h-64 fill-current text-white" />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black text-xl">
            {user?.bloodGroup}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Blood Group</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{user?.bloodGroup} Type</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Donations Done</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {stats?.totalCompletedDonations ?? user?.donationCount ?? 0} Times
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Active Bookings</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {stats?.activeRegistrationsCount ?? 0}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Last Donated</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {user?.lastDonationDate
                ? new Date(user.lastDonationDate).toLocaleDateString()
                : 'Not recorded yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaign Registrations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Campaign Registrations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track your upcoming appointments and statuses</p>
          </div>
          <Link
            to="/campaigns"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            Find more campaigns
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {reg.campaign?.title || 'Community Campaign'}
                    </td>
                    <td className="px-6 py-4">
                      {reg.campaign?.date
                        ? new Date(reg.campaign.date).toLocaleDateString()
                        : 'Scheduled'}
                      <div className="text-xs text-slate-400">{reg.preferredTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      {reg.campaign?.location}, {reg.campaign?.city}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          reg.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : reg.status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : reg.status === 'CANCELLED'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {reg.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelRegistration(reg._id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No campaign registrations found</p>
            <p className="text-xs text-slate-500 mt-1">Register for an upcoming drive to donate blood</p>
            <Link
              to="/campaigns"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
            >
              Browse Campaigns
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
