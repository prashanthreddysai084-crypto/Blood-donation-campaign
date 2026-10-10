import React, { useEffect, useState } from 'react';
import { registrationService, donationService } from '../../services';
import { CheckCircle2, XCircle, Award, Calendar, Search } from 'lucide-react';

export const AdminRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // Use query filters if available
      const res = await registrationService.getMyRegistrations({ limit: 100 });
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await registrationService.updateStatus(id, status);
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? { ...reg, status } : reg))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteDonation = async (registrationId) => {
    const qty = prompt('Enter quantity in ml (standard is 450):', '450');
    if (!qty) return;

    try {
      await donationService.recordDonation({
        registrationId,
        quantity: parseInt(qty, 10) || 450,
        notes: 'Verified by camp administrator'
      });
      alert('Donation verified and user donation record updated successfully!');
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === registrationId ? { ...reg, status: 'COMPLETED' } : reg))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
          Registrations & Attendance
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Donor Registration Queue
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Approve incoming requests, check donor blood matches, and certify completed donations
        </p>
      </div>

      {loading ? (
        <div className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
      ) : registrations.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Date & Slot</th>
                  <th className="px-6 py-4">Blood Group</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50/80">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {reg.campaign?.title || 'Community Campaign'}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {reg.campaign?.date
                          ? new Date(reg.campaign.date).toLocaleDateString()
                          : 'Scheduled'}
                      </div>
                      <div className="text-xs text-slate-400">{reg.preferredTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                        {reg.bloodGroup || 'O+'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          reg.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : reg.status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : reg.status === 'REJECTED' || reg.status === 'CANCELLED'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {reg.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(reg._id, 'APPROVED')}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(reg._id, 'REJECTED')}
                            className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {reg.status === 'APPROVED' && (
                        <button
                          onClick={() => handleCompleteDonation(reg._id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          Mark Donated
                        </button>
                      )}
                      {reg.status === 'COMPLETED' && (
                        <span className="text-xs font-semibold text-emerald-600">
                          ✓ Verified & Logged
                        </span>
                      )}
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
          <h3 className="text-lg font-bold text-slate-800">No registrations found</h3>
          <p className="text-sm text-slate-500 mt-1">Registrations will populate here as donors book slots.</p>
        </div>
      )}
    </div>
  );
};
