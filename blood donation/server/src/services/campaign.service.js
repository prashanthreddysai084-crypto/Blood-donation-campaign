const Campaign = require('../models/Campaign');
const ApiError = require('../utils/ApiError');
const { getPagination, formatPaginatedResponse } = require('../utils/pagination');

class CampaignService {
  async createCampaign(campaignData, creatorId) {
    // Validate campaign date
    const campaignDate = new Date(campaignData.date);
    if (isNaN(campaignDate.getTime())) {
      throw new ApiError(400, 'Invalid campaign date format', 'INVALID_DATE');
    }

    const campaign = await Campaign.create({
      ...campaignData,
      createdBy: creatorId
    });

    return campaign;
  }

  async getAllCampaigns(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    // Filter by status (default to public upcoming/active if not specified or admin)
    if (query.status) {
      filter.status = query.status;
    }

    // Filter by city
    if (query.city) {
      filter.city = new RegExp(query.city, 'i');
    }

    // Filter by blood group
    if (query.bloodGroup) {
      filter.requiredBloodGroups = query.bloodGroup;
    }

    // Search by title or description
    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }, { location: searchRegex }];
    }

    // Filter by date range
    if (query.startDate) {
      filter.date = { ...filter.date, $gte: new Date(query.startDate) };
    }
    if (query.endDate) {
      filter.date = { ...filter.date, $lte: new Date(query.endDate) };
    }

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .populate('createdBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ date: 1 }), // Upcoming first
      Campaign.countDocuments(filter)
    ]);

    return formatPaginatedResponse({
      data: campaigns,
      total,
      page,
      limit,
      message: 'Campaigns retrieved successfully'
    });
  }

  async getCampaignById(id) {
    const campaign = await Campaign.findById(id).populate('createdBy', 'name email');
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND');
    }
    return campaign;
  }

  async updateCampaign(id, updateData) {
    const campaign = await Campaign.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND');
    }

    return campaign;
  }

  async deleteCampaign(id) {
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND');
    }
    return campaign;
  }
}

module.exports = new CampaignService();
