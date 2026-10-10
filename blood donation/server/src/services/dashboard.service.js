const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Registration = require('../models/Registration');
const Donation = require('../models/Donation');

class DashboardService {
  async getAdminStats() {
    // 1. Overall counts
    const [
      totalDonors,
      totalCampaigns,
      upcomingCampaigns,
      activeCampaigns,
      completedCampaigns,
      cancelledCampaigns,
      pendingRegistrations,
      approvedRegistrations,
      completedDonations
    ] = await Promise.all([
      User.countDocuments({ role: 'DONOR' }),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: 'UPCOMING' }),
      Campaign.countDocuments({ status: 'ACTIVE' }),
      Campaign.countDocuments({ status: 'COMPLETED' }),
      Campaign.countDocuments({ status: 'CANCELLED' }),
      Registration.countDocuments({ status: 'PENDING' }),
      Registration.countDocuments({ status: 'APPROVED' }),
      Donation.countDocuments()
    ]);

    // 2. Real MongoDB Aggregation for Blood Group Distribution among Donors
    const bloodGroupStats = await User.aggregate([
      { $match: { role: 'DONOR' } },
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format blood group map ensuring all standard types are represented
    const bloodGroupDistribution = {
      'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
      'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
    };
    bloodGroupStats.forEach((stat) => {
      if (stat._id) bloodGroupDistribution[stat._id] = stat.count;
    });

    // 3. Blood collected by type (from verified donations)
    const donationsByBloodGroup = await Donation.aggregate([
      { $match: { status: 'VERIFIED' } },
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: 1 },
          totalMl: { $sum: '$quantity' }
        }
      }
    ]);

    // 4. Recent activity
    const recentRegistrations = await Registration.find()
      .populate('donor', 'name bloodGroup city')
      .populate('campaign', 'title date')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      counts: {
        totalDonors,
        totalCampaigns,
        upcomingCampaigns,
        activeCampaigns,
        completedCampaigns,
        cancelledCampaigns,
        pendingRegistrations,
        approvedRegistrations,
        completedDonations
      },
      bloodGroupDistribution,
      donationsByBloodGroup,
      recentRegistrations
    };
  }

  async getDonorStats(donorId) {
    const [user, myRegistrationsCount, myDonationsCount, upcomingCampaignsCount] = await Promise.all([
      User.findById(donorId),
      Registration.countDocuments({ donor: donorId, status: { $in: ['PENDING', 'APPROVED'] } }),
      Donation.countDocuments({ donor: donorId }),
      Campaign.countDocuments({ status: { $in: ['UPCOMING', 'ACTIVE'] } })
    ]);

    return {
      donationCount: user ? user.donationCount : 0,
      lastDonationDate: user ? user.lastDonationDate : null,
      activeRegistrationsCount: myRegistrationsCount,
      totalCompletedDonations: myDonationsCount,
      availableCampaignsCount: upcomingCampaignsCount
    };
  }
}

module.exports = new DashboardService();
