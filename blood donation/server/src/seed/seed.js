const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/env');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Registration = require('../models/Registration');
const Donation = require('../models/Donation');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected.');

    // Clear existing collections
    console.log('[Seed] Cleaning old records...');
    await User.deleteMany({});
    await Campaign.deleteMany({});
    await Registration.deleteMany({});
    await Donation.deleteMany({});

    // 1. Create Admin
    console.log('[Seed] Creating Administrator...');
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: 'AdminPassword123!', // Explicit development seed password
      phone: '9876543210',
      role: 'ADMIN',
      bloodGroup: 'O+',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'MALE',
      city: 'Hyderabad',
      address: 'Red Cross Center, Banjara Hills'
    });

    // 2. Create Donors
    console.log('[Seed] Creating Donors...');
    const donors = await User.create([
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'DonorPassword123!',
        phone: '9876500001',
        role: 'DONOR',
        bloodGroup: 'O+',
        dateOfBirth: new Date('2000-05-14'),
        gender: 'MALE',
        city: 'Hyderabad',
        donationCount: 2,
        lastDonationDate: new Date('2026-08-10')
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'DonorPassword123!',
        phone: '9876500002',
        role: 'DONOR',
        bloodGroup: 'A+',
        dateOfBirth: new Date('1998-11-20'),
        gender: 'FEMALE',
        city: 'Hyderabad',
        donationCount: 1,
        lastDonationDate: new Date('2026-06-15')
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        password: 'DonorPassword123!',
        phone: '9876500003',
        role: 'DONOR',
        bloodGroup: 'B+',
        dateOfBirth: new Date('1995-03-08'),
        gender: 'MALE',
        city: 'Bengaluru',
        donationCount: 3,
        lastDonationDate: new Date('2026-07-22')
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        password: 'DonorPassword123!',
        phone: '9876500004',
        role: 'DONOR',
        bloodGroup: 'AB+',
        dateOfBirth: new Date('2001-09-25'),
        gender: 'FEMALE',
        city: 'Hyderabad',
        donationCount: 0
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: 'DonorPassword123!',
        phone: '9876500005',
        role: 'DONOR',
        bloodGroup: 'O-',
        dateOfBirth: new Date('1992-12-10'),
        gender: 'MALE',
        city: 'Mumbai',
        donationCount: 1,
        lastDonationDate: new Date('2026-05-01')
      }
    ]);

    // 3. Create Campaigns
    console.log('[Seed] Creating Campaigns...');
    const campaign1 = await Campaign.create({
      title: 'City Youth Blood Drive 2026',
      description: 'Annual community blood donation camp organized with Rotary Club and Red Cross.',
      organizer: 'Red Cross & Youth Volunteers',
      date: new Date('2026-11-15'),
      startTime: '09:00 AM',
      endTime: '04:00 PM',
      location: 'Community Hall, Gachibowli',
      address: 'Main Road, Financial District',
      city: 'Hyderabad',
      contactNumber: '9123456780',
      capacity: 50,
      registeredCount: 2,
      requiredBloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=60',
      status: 'UPCOMING',
      createdBy: admin._id
    });

    const campaign2 = await Campaign.create({
      title: 'Rare Blood Group Special Drive',
      description: 'Dedicated campaign for collecting negative and uncommon blood groups (O-, AB-, B-).',
      organizer: 'Lions Blood Bank',
      date: new Date('2026-11-28'),
      startTime: '10:00 AM',
      endTime: '03:00 PM',
      location: 'Apollo Healthcare Center',
      address: 'Jubilee Hills, Road No. 36',
      city: 'Hyderabad',
      contactNumber: '9123456781',
      capacity: 30,
      registeredCount: 1,
      requiredBloodGroups: ['O-', 'A-', 'B-', 'AB-'],
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=60',
      status: 'UPCOMING',
      createdBy: admin._id
    });

    const campaignCompleted = await Campaign.create({
      title: 'Tech Park Blood Heroes Camp',
      description: 'Corporate voluntary blood donation camp held at Hitec City Tech Hub.',
      organizer: 'Tech Solidarity Initiative',
      date: new Date('2026-08-10'),
      startTime: '09:30 AM',
      endTime: '05:00 PM',
      location: 'Mindspace Auditorium',
      address: 'Madhapur, Hitec City',
      city: 'Hyderabad',
      contactNumber: '9123456782',
      capacity: 100,
      registeredCount: 2,
      requiredBloodGroups: ['A+', 'B+', 'O+', 'AB+'],
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60',
      status: 'COMPLETED',
      createdBy: admin._id
    });

    // 4. Create Registrations
    console.log('[Seed] Creating Registrations...');
    const reg1 = await Registration.create({
      donor: donors[0]._id, // Rahul
      campaign: campaign1._id,
      bloodGroup: 'O+',
      preferredTime: '10:00 AM',
      status: 'APPROVED',
      notes: 'Available throughout morning'
    });

    const reg2 = await Registration.create({
      donor: donors[1]._id, // Priya
      campaign: campaign1._id,
      bloodGroup: 'A+',
      preferredTime: '11:30 AM',
      status: 'PENDING',
      notes: 'First time at this venue'
    });

    const regPast = await Registration.create({
      donor: donors[0]._id, // Rahul
      campaign: campaignCompleted._id,
      bloodGroup: 'O+',
      preferredTime: '02:00 PM',
      status: 'COMPLETED',
      notes: 'Completed successfully'
    });

    // 5. Create Verified Donation Record
    console.log('[Seed] Creating Donation Record...');
    await Donation.create({
      donor: donors[0]._id,
      campaign: campaignCompleted._id,
      registration: regPast._id,
      donationDate: new Date('2026-08-10'),
      bloodGroup: 'O+',
      quantity: 450,
      status: 'VERIFIED',
      notes: 'Donor was in good health, normal hemoglobin'
    });

    console.log('\n=======================================================');
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=======================================================');
    console.log('Admin Account:');
    console.log('  Email:    admin@example.com');
    console.log('  Password: AdminPassword123!');
    console.log('-------------------------------------------------------');
    console.log('Demo Donor Account:');
    console.log('  Email:    rahul@example.com');
    console.log('  Password: DonorPassword123!');
    console.log('=======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedData();
