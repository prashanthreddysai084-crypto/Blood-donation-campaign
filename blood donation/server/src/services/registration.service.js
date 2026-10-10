const Registration = require('../models/Registration');
const Campaign = require('../models/Campaign');
const ApiError = require('../utils/ApiError');
const { getPagination, formatPaginatedResponse } = require('../utils/pagination');

class RegistrationService {
  async registerForCampaign(donorId, campaignId, data) {
    // 1. Fetch Campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND');
    }

    // 2. Business Rule: Check Campaign Status
    if (campaign.status === 'CANCELLED') {
      throw new ApiError(400, 'Cannot register for a cancelled campaign', 'CAMPAIGN_CANCELLED');
    }
    if (campaign.status === 'COMPLETED') {
      throw new ApiError(400, 'Cannot register for an already completed campaign', 'CAMPAIGN_COMPLETED');
    }

    // 3. Business Rule: Check Capacity
    if (campaign.registeredCount >= campaign.capacity) {
      throw new ApiError(400, 'Campaign capacity is already full', 'CAPACITY_REACHED');
    }

    // 4. Business Rule: Check Duplicate Registration
    const existingRegistration = await Registration.findOne({
      donor: donorId,
      campaign: campaignId
    });

    if (existingRegistration) {
      throw new ApiError(409, 'You are already registered for this campaign', 'DUPLICATE_REGISTRATION');
    }

    // 5. Create Registration & Increment Campaign registeredCount atomically
    const registration = await Registration.create({
      donor: donorId,
      campaign: campaignId,
      bloodGroup: data.bloodGroup,
      preferredTime: data.preferredTime || 'Morning',
      notes: data.notes || '',
      status: 'PENDING'
    });

    await Campaign.findByIdAndUpdate(campaignId, { $inc: { registeredCount: 1 } });

    return registration;
  }

  async getMyRegistrations(donorId, query) {
    const { page, limit, skip } = getPagination(query);

    const [registrations, total] = await Promise.all([
      Registration.find({ donor: donorId })
        .populate('campaign')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Registration.countDocuments({ donor: donorId })
    ]);

    return formatPaginatedResponse({
      data: registrations,
      total,
      page,
      limit,
      message: 'Registrations retrieved successfully'
    });
  }

  async getCampaignRegistrations(campaignId, query) {
    const { page, limit, skip } = getPagination(query);
    const filter = { campaign: campaignId };

    if (query.status) {
      filter.status = query.status;
    }

    const [registrations, total] = await Promise.all([
      Registration.find(filter)
        .populate('donor', 'name email phone bloodGroup city')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Registration.countDocuments(filter)
    ]);

    return formatPaginatedResponse({
      data: registrations,
      total,
      page,
      limit,
      message: 'Campaign registrations retrieved'
    });
  }

  async updateRegistrationStatus(id, newStatus) {
    const registration = await Registration.findById(id).populate('donor').populate('campaign');
    if (!registration) {
      throw new ApiError(404, 'Registration not found', 'REGISTRATION_NOT_FOUND');
    }

    registration.status = newStatus;
    await registration.save();

    return registration;
  }

  async cancelRegistration(id, user) {
    const registration = await Registration.findById(id);
    if (!registration) {
      throw new ApiError(404, 'Registration not found', 'REGISTRATION_NOT_FOUND');
    }

    // Only donor who owns it or Admin can cancel
    if (user.role !== 'ADMIN' && registration.donor.toString() !== user._id.toString()) {
      throw new ApiError(403, 'Unauthorized to cancel this registration', 'FORBIDDEN');
    }

    if (registration.status === 'COMPLETED') {
      throw new ApiError(400, 'Cannot cancel a completed donation registration', 'INVALID_OPERATION');
    }

    registration.status = 'CANCELLED';
    await registration.save();

    // Decrement campaign count
    await Campaign.findByIdAndUpdate(registration.campaign, {
      $inc: { registeredCount: -1 }
    });

    return registration;
  }
}

module.exports = new RegistrationService();
