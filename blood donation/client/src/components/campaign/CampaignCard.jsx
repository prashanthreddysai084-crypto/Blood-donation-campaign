import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Droplet, ArrowRight } from 'lucide-react';

export const CampaignCard = ({ campaign }) => {
  const isFull = campaign.registeredCount >= campaign.capacity;
  const isCompleted = campaign.status === 'COMPLETED';
  const isCancelled = campaign.status === 'CANCELLED';

  const formattedDate = new Date(campaign.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col group">
      {/* Image header with status badge */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={campaign.image || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800'}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm ${
              isCompleted
                ? 'bg-slate-800 text-white'
                : isCancelled
                ? 'bg-red-700 text-white'
                : campaign.status === 'ACTIVE'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {campaign.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{campaign.startTime} - {campaign.endTime}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
            {campaign.title}
          </h3>

          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {campaign.description}
          </p>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{campaign.location}, {campaign.city}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Capacity: {campaign.registeredCount} / {campaign.capacity}</span>
              </div>
              {isFull && (
                <span className="text-amber-600 font-semibold">Slot Full</span>
              )}
            </div>
          </div>

          {/* Blood group pills */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1 items-center">
            <Droplet className="w-3.5 h-3.5 text-red-500 mr-1" />
            {campaign.requiredBloodGroups?.slice(0, 5).map((bg) => (
              <span
                key={bg}
                className="px-2 py-0.5 text-[11px] font-semibold bg-red-50 text-red-700 rounded-md border border-red-100"
              >
                {bg}
              </span>
            ))}
            {campaign.requiredBloodGroups?.length > 5 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +{campaign.requiredBloodGroups.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/campaigns/${campaign._id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            <span>View Details & Register</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
