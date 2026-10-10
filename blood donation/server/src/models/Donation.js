const mongoose = require('mongoose');
const { BLOOD_GROUPS } = require('./User');

const donationSchema = new mongoose.Schema(
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
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: [true, 'Registration reference is required'],
      unique: true // A registration can only be converted to one donation record
    },
    donationDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: BLOOD_GROUPS,
      index: true
    },
    quantity: {
      type: Number,
      default: 450, // Standard unit in ml
      min: [100, 'Quantity must be at least 100ml']
    },
    status: {
      type: String,
      enum: ['VERIFIED', 'DISCARDED'],
      default: 'VERIFIED'
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

module.exports = mongoose.model('Donation', donationSchema);
