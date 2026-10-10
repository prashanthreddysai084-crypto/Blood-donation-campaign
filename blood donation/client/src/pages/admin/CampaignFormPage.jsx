import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignService } from '../../services';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export const CampaignFormPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organizer: '',
    date: '2026-11-20',
    startTime: '09:00 AM',
    endTime: '04:00 PM',
    location: '',
    address: '',
    city: '',
    contactNumber: '',
    capacity: 50,
    requiredBloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800',
    status: 'UPCOMING'
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statuses = ['DRAFT', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

  useEffect(() => {
    if (isEditing) {
      const fetchCampaign = async () => {
        try {
          const res = await campaignService.getById(id);
          const c = res.data;
          setFormData({
            title: c.title,
            description: c.description,
            organizer: c.organizer,
            date: c.date ? c.date.split('T')[0] : '',
            startTime: c.startTime,
            endTime: c.endTime,
            location: c.location,
            address: c.address,
            city: c.city,
            contactNumber: c.contactNumber,
            capacity: c.capacity,
            requiredBloodGroups: c.requiredBloodGroups || bloodGroups,
            image: c.image || '',
            status: c.status || 'UPCOMING'
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCampaign();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupToggle = (bg) => {
    setFormData((prev) => {
      const exists = prev.requiredBloodGroups.includes(bg);
      return {
        ...prev,
        requiredBloodGroups: exists
          ? prev.requiredBloodGroups.filter((g) => g !== bg)
          : [...prev.requiredBloodGroups, bg]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await campaignService.update(id, formData);
      } else {
        await campaignService.create(formData);
      }
      navigate('/admin/campaigns');
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading campaign editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/campaigns')}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Set venue, dates, target donor capacity and medical requirements
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. City Youth Voluntary Blood Camp"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed schedule and instructions for participating donors..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Organizer Name *
            </label>
            <input
              type="text"
              name="organizer"
              required
              value={formData.organizer}
              onChange={handleChange}
              placeholder="Red Cross Youth Wing"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Helpdesk Contact Phone *
            </label>
            <input
              type="tel"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="9123456789"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Drive Date *
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Start Time
              </label>
              <input
                type="text"
                name="startTime"
                required
                value={formData.startTime}
                onChange={handleChange}
                placeholder="09:00 AM"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                End Time
              </label>
              <input
                type="text"
                name="endTime"
                required
                value={formData.endTime}
                onChange={handleChange}
                placeholder="04:00 PM"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Venue / Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Auditorium, Community Center"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="Hyderabad"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Street Address *
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Road 12, Financial District, Gachibowli"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Donor Slot Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              required
              min={1}
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Campaign Lifecycle Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-bold text-red-600"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Required Blood Groups (Check all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {bloodGroups.map((bg) => {
                const selected = formData.requiredBloodGroups.includes(bg);
                return (
                  <button
                    type="button"
                    key={bg}
                    onClick={() => handleBloodGroupToggle(bg)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      selected
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {bg}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Banner Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/admin/campaigns')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving...' : isEditing ? 'Update Campaign' : 'Publish Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};
