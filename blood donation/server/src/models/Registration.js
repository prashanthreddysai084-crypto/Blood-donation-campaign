const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('./User');

const REGISTRATION_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'];

const registrationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor reference is required'],
      index: true
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required'],
      index: true
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: BLOOD_GROUPS
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    preferredTime: {
      type: String,
      default: 'Morning'
    },
    status: {
      type: String,
      enum: REGISTRATION_STATUSES,
      default: 'PENDING',
      index: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound Unique Index: A donor can only register ONCE per campaign
registrationSchema.index({ donor: 1, campaign: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
module.exports.REGISTRATION_STATUSES = REGISTRATION_STATUSES;
