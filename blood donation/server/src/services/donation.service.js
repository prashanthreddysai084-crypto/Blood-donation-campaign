const Donation = require('../models/Donation');
const Registration = require('../models/Registration');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { getPagination, formatPaginatedResponse } = require('../utils/pagination');

class DonationService {
  async recordDonation(data) {
    const { registrationId, quantity = 450, notes = '' } = data;

    // Check registration
    const registration = await Registration.findById(registrationId)
      .populate('donor')
      .populate('campaign');

    if (!registration) {
      throw new ApiError(404, 'Registration not found', 'REGISTRATION_NOT_FOUND');
    }

    // Check if donation already recorded for this registration
    const existingDonation = await Donation.findOne({ registration: registrationId });
    if (existingDonation) {
      throw new ApiError(409, 'Donation has already been recorded for this registration', 'DONATION_ALREADY_EXISTS');
    }

    // Create donation record
    const donation = await Donation.create({
      donor: registration.donor._id,
      campaign: registration.campaign._id,
      registration: registration._id,
      bloodGroup: registration.bloodGroup || registration.donor.bloodGroup,
      quantity,
      donationDate: new Date(),
      status: 'VERIFIED',
      notes
    });

    // Mark registration as COMPLETED
    registration.status = 'COMPLETED';
    await registration.save();

    // Update user stats: donationCount and lastDonationDate
    await User.findByIdAndUpdate(registration.donor._id, {
      $inc: { donationCount: 1 },
      lastDonationDate: donation.donationDate
    });

    return donation;
  }

  async getMyDonations(donorId, query) {
    const { page, limit, skip } = getPagination(query);

    const [donations, total] = await Promise.all([
      Donation.find({ donor: donorId })
        .populate('campaign', 'title date location city')
        .skip(skip)
        .limit(limit)
        .sort({ donationDate: -1 }),
      Donation.countDocuments({ donor: donorId })
    ]);

    return formatPaginatedResponse({
      data: donations,
      total,
      page,
      limit,
      message: 'Donation history retrieved successfully'
    });
  }

  async getAllDonations(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.bloodGroup) filter.bloodGroup = query.bloodGroup;
    if (query.campaignId) filter.campaign = query.campaignId;

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate('donor', 'name email phone bloodGroup')
        .populate('campaign', 'title date city')
        .skip(skip)
        .limit(limit)
        .sort({ donationDate: -1 }),
      Donation.countDocuments(filter)
    ]);

    return formatPaginatedResponse({
      data: donations,
      total,
      page,
      limit,
      message: 'Donations retrieved successfully'
    });
  }

  async getDonationById(id) {
    const donation = await Donation.findById(id)
      .populate('donor', 'name email phone bloodGroup city')
      .populate('campaign', 'title date location city organizer');

    if (!donation) {
      throw new ApiError(404, 'Donation record not found', 'DONATION_NOT_FOUND');
    }

    return donation;
  }
}

module.exports = new DonationService();
