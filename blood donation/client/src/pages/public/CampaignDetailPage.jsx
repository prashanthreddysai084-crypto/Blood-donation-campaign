import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { campaignService, registrationService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Users,
  Droplet,
  CheckCircle2,
  AlertCircle,
  Building
} from 'lucide-react';

export const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isDonor } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await campaignService.getById(id);
        setCampaign(res.data);
      } catch (err) {
        setError(err.message || 'Campaign not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await registrationService.registerForCampaign(id, {
        preferredTime,
        notes
      });
      setMessage('Registration successful! Your appointment request has been submitted.');
      // Refresh campaign to show updated capacity
      const updated = await campaignService.getById(id);
      setCampaign(updated.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Campaign Not Found</h2>
        <p className="text-slate-600 mt-2">The campaign you are looking for does not exist or has been removed.</p>
        <Link to="/campaigns" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-xl font-bold">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const isFull = campaign.registeredCount >= campaign.capacity;
  const isAvailable = campaign.status === 'UPCOMING' || campaign.status === 'ACTIVE';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner Image */}
      <div className="relative h-72 md:h-96 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200 mb-8">
        <img
          src={campaign.image || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200'}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-8">
          <div className="text-white max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-sm inline-block mb-3">
              {campaign.status}
            </span>
            <h1 className="text-3xl md:text-4xl font-black">{campaign.title}</h1>
            <p className="text-slate-300 mt-1 flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-red-400" />
              Organized by: <span className="font-semibold text-white">{campaign.organizer}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About this Campaign</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {campaign.description}
            </p>

            <h3 className="text-base font-bold text-slate-900 mt-8 mb-3">
              Required Blood Groups
            </h3>
            <div className="flex flex-wrap gap-2">
              {campaign.requiredBloodGroups?.map((bg) => (
                <div
                  key={bg}
                  className="px-3.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-1.5"
                >
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  {bg}
                </div>
              ))}
            </div>
          </div>

          {/* Logistics Information */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Location & Timing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Date</div>
                  <div className="text-slate-600">
                    {new Date(campaign.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Time Window</div>
                  <div className="text-slate-600">{campaign.startTime} - {campaign.endTime}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Venue & City</div>
                  <div className="text-slate-600">{campaign.location}</div>
                  <div className="text-slate-500 text-xs">{campaign.address}, {campaign.city}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Helpdesk Contact</div>
                  <div className="text-slate-600">{campaign.contactNumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Registration Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-700">Donor Slots</span>
              <span className="text-sm font-bold text-slate-900">
                {campaign.registeredCount} / {campaign.capacity} filled
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 my-4 overflow-hidden">
              <div
                className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (campaign.registeredCount / campaign.capacity) * 100)}%`
                }}
              ></div>
            </div>

            {message && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {isFull ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm text-center font-medium">
                Capacity reached for this campaign.
              </div>
            ) : !isAvailable ? (
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm text-center font-medium">
                Registrations are currently closed for this campaign ({campaign.status}).
              </div>
            ) : user ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Blood Group
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.bloodGroup}
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-hidden focus:border-red-600"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Notes / Comments (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any health notes or dietary preferences..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-red-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  You need to be logged in as a registered donor to book a donation slot.
                </p>
                <Link
                  to="/login"
                  className="block text-center w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Sign In to Register
                </Link>
                <Link
                  to="/register"
                  className="block text-center w-full py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-sm transition-colors"
                >
                  Create New Donor Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
