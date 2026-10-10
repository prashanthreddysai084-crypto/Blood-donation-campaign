const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('./User');

const CAMPAIGN_STATUSES = ['DRAFT', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      trim: true
    },
    organizer: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Campaign date is required'],
      index: true
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    location: {
      type: String,
      required: [true, 'Location venue/name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Donor capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0
    },
    requiredBloodGroups: {
      type: [String],
      enum: BLOOD_GROUPS,
      default: BLOOD_GROUPS
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=60'
    },
    status: {
      type: String,
      enum: CAMPAIGN_STATUSES,
      default: 'UPCOMING',
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for common search and filter combinations
campaignSchema.index({ city: 1, status: 1 });
campaignSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
module.exports.CAMPAIGN_STATUSES = CAMPAIGN_STATUSES;
