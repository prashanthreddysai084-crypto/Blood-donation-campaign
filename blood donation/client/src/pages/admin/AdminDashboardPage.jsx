import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  PlusCircle,
  Droplet,
  ArrowRight,
  TrendingUp,
  ListOrdered
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await dashboardService.getAdminStats();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Aggregating live campaign analytics...</p>
      </div>
    );
  }

  const { counts, bloodGroupDistribution, recentRegistrations } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header bar with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Control Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time MongoDB aggregated statistics and campaign monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/campaigns/create"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Campaign
          </Link>
          <Link
            to="/admin/registrations"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
          >
            Manage Registrations
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Total Donors</span>
            <Users className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{counts?.totalDonors || 0}</div>
          <div className="text-xs text-slate-500 mt-2">Registered active citizens</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Campaigns</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{counts?.totalCampaigns || 0}</div>
          <div className="text-xs text-slate-500 mt-2">
            {counts?.upcomingCampaigns || 0} Upcoming • {counts?.completedCampaigns || 0} Completed
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Pending Regs</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600">
            {counts?.pendingRegistrations || 0}
          </div>
          <div className="text-xs text-slate-500 mt-2">Awaiting coordinator review</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Blood Units Verified</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {counts?.completedDonations || 0}
          </div>
          <div className="text-xs text-slate-500 mt-2">Successful donations recorded</div>
        </div>
      </div>

      {/* Blood Group Distribution Aggregation Grid */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-red-600 fill-current" />
              Donor Blood Group Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live aggregation from the users database collection
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
            MongoDB $group Aggregation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.entries(bloodGroupDistribution || {}).map(([group, count]) => (
            <div
              key={group}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center"
            >
              <div className="text-xs font-bold text-red-600 uppercase">{group}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{count}</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Donors</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Campaign Registrations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Donor Registrations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Review incoming applicant appointments</p>
          </div>
          <Link
            to="/admin/registrations"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            View all registrations
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Donor Name</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRegistrations?.map((reg) => (
                <tr key={reg._id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {reg.donor?.name || 'Anonymous Donor'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                      {reg.donor?.bloodGroup || 'O+'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{reg.campaign?.title}</td>
                  <td className="px-6 py-4">{reg.donor?.city}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        reg.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : reg.status === 'COMPLETED'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
