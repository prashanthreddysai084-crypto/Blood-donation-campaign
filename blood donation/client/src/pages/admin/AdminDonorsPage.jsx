import React, { useEffect, useState } from 'react';
import { userService } from '../../services';
import { Users, Mail, Phone, MapPin, Droplet, CheckCircle2, XCircle } from 'lucide-react';

export const AdminDonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({ role: 'DONOR', search, bloodGroup, limit: 100 });
      setDonors(res.data || []);
    } catch (err) {
      console.error('Failed to load donors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodGroup]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await userService.toggleUserStatus(id, !currentStatus);
      setDonors((prev) =>
        prev.map((d) => (d._id === id ? { ...d, isActive: !currentStatus } : d))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
          Registry Management
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registered Donors</h1>
        <p className="text-sm text-slate-600 mt-1">
          Search verified community volunteers, filter by blood group, or manage activity status
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-96 flex gap-2">
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>

        <div className="w-full sm:w-auto">
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-red-600"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
      ) : donors.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Donor Name</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Donation Count</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donors.map((donor) => (
                  <tr key={donor._id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{donor.name}</div>
                      <div className="text-xs text-slate-400 capitalize">{donor.gender?.toLowerCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                        {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{donor.email}</div>
                      <div className="text-slate-400 mt-0.5">{donor.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-slate-800">{donor.city}</div>
                      <div className="text-slate-400 truncate max-w-xs">{donor.address || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-900">{donor.donationCount || 0}</span> times
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          donor.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {donor.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(donor._id, donor.isActive)}
                        className={`text-xs font-bold transition-colors ${
                          donor.isActive
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-emerald-600 hover:text-emerald-800'
                        }`}
                      >
                        {donor.isActive ? 'Deactivate' : 'Activate'}
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
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No donors found</h3>
          <p className="text-sm text-slate-500 mt-1">No donor accounts match your filter criteria.</p>
        </div>
      )}
    </div>
  );
};
