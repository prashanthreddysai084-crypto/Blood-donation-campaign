import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../../services';
import { PlusCircle, Edit3, Trash2, Calendar, MapPin, Users } from 'lucide-react';

export const AdminCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await campaignService.getAll({ limit: 50 });
      setCampaigns(res.data || []);
    } catch (err) {
      console.error('Failed to load admin campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete campaign "${title}"?`)) return;
    try {
      await campaignService.delete(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Operations</h1>
          <p className="text-sm text-slate-600 mt-1">Create, edit, schedule, or cancel blood drives</p>
        </div>

        <Link
          to="/admin/campaigns/create"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Campaign
        </Link>
      </div>

      {loading ? (
        <div className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
      ) : campaigns.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Title & Organizer</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((camp) => (
                  <tr key={camp._id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{camp.title}</div>
                      <div className="text-xs text-slate-400">{camp.organizer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{new Date(camp.date).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">
                        {camp.startTime} - {camp.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{camp.location}</div>
                      <div className="text-xs text-slate-400">{camp.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{camp.registeredCount}</span> /{' '}
                      {camp.capacity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          camp.status === 'UPCOMING'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : camp.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : camp.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/campaigns/${camp._id}/edit`}
                        className="inline-flex p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit campaign"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(camp._id, camp.title)}
                        className="inline-flex p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No campaigns found</h3>
          <p className="text-sm text-slate-500 mt-1">Get started by creating your first drive.</p>
        </div>
      )}
    </div>
  );
};
