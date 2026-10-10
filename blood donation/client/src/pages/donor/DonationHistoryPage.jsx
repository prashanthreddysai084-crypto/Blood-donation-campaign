import React, { useEffect, useState } from 'react';
import { donationService } from '../../services';
import { Heart, Calendar, Award, Droplet } from 'lucide-react';

export const DonationHistoryPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await donationService.getMyDonations();
        setDonations(res.data || []);
      } catch (err) {
        console.error('Failed to load donations history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Donation History</h1>
        <p className="text-sm text-slate-600 mt-1">
          Every completed donation recorded and verified by camp medical administrators.
        </p>
      </div>

      {loading ? (
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
      ) : donations.length > 0 ? (
        <div className="space-y-4">
          {donations.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Droplet className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.campaign?.title || 'Community Blood Drive'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.donationDate).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{item.campaign?.city || 'City Center'}</span>
                    <span>•</span>
                    <span className="font-bold text-red-600">{item.bloodGroup}</span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded-lg">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {item.status} ({item.quantity} ml)
                </span>
                <span className="text-xs text-slate-400 mt-1">Verified Certificate</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Donations Recorded Yet</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            When you attend an approved blood donation drive and complete your donation, the camp coordinator will verify and log your record here.
          </p>
        </div>
      )}
    </div>
  );
};
