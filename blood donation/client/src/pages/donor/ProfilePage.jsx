import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services';
import { User, Phone, MapPin, Mail, Droplet, Calendar, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || '',
    gender: user?.gender || 'MALE'
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await userService.updateProfile(formData);
      updateUser(res.data);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Donor Profile</h1>
        <p className="text-sm text-slate-600 mt-1">
          Keep your contact information up to date so camp organizers can reach you
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8">
        {/* Read-Only Essential Medical Details */}
        <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Blood Group</div>
            <div className="text-2xl font-black text-red-600 mt-0.5">{user?.bloodGroup}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Non-editable</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Donation Count</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {user?.donationCount || 0}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verified times</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Role</div>
            <div className="text-sm font-bold text-slate-900 mt-1.5">{user?.role}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Registered Email</div>
            <div className="text-xs font-semibold text-slate-700 mt-2 truncate">{user?.email}</div>
          </div>
        </div>

        {/* Editable Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Residential Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address / landmark"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
