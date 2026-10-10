import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { campaignService } from '../../services';
import { CampaignCard } from '../../components/campaign/CampaignCard';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const CampaignListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const bloodGroup = searchParams.get('bloodGroup') || '';
  const status = searchParams.get('status') || '';

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const query = {};
        if (search) query.search = search;
        if (city) query.city = city;
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (status) query.status = status;

        const res = await campaignService.getAll(query);
        setCampaigns(res.data || []);
        setTotal(res.pagination?.total || 0);
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Blood Donation Campaigns
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore upcoming drives in your neighborhood and register to donate.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search campaign title or venue..."
              value={search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* City Filter */}
          <div>
            <input
              type="text"
              placeholder="Filter by city (e.g. Hyderabad)..."
              value={city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              value={bloodGroup}
              onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Campaign List Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div>
          <div className="text-sm font-medium text-slate-500 mb-6">
            Showing <span className="font-bold text-slate-900">{campaigns.length}</span> campaign(s)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((camp) => (
              <CampaignCard key={camp._id} campaign={camp} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No campaigns match your search</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your keyword, changing city or blood group filter.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Show All Campaigns
          </button>
        </div>
      )}
    </div>
  );
};
