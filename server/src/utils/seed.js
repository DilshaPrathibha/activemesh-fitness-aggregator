import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Gym from '../models/Gym.js';
import Class from '../models/Class.js';
import MembershipPlan from '../models/MembershipPlan.js';

dotenv.config();

// Fix: local DNS (127.0.0.1) blocks Atlas SRV lookups — use public DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/activemesh';


const membershipPlans = [
  {
    name: 'Basic',
    slug: 'basic',
    price: 29.99,
    duration: 30,
    gymAccess: 'single',
    features: ['Access to 1 gym', 'Standard equipment', 'Locker access'],
    sortOrder: 1,
  },
  {
    name: 'Standard',
    slug: 'standard',
    price: 59.99,
    duration: 30,
    gymAccess: 'network',
    features: ['Access to all network gyms', 'Group classes (2/week)', 'Locker access', 'App QR check-in'],
    sortOrder: 2,
  },
  {
    name: 'Premium',
    slug: 'premium',
    price: 99.99,
    duration: 30,
    gymAccess: 'network',
    features: [
      'Unlimited network gym access',
      'Unlimited group classes',
      'Personal trainer session/month',
      'Priority booking',
      'Guest passes (2/month)',
    ],
    sortOrder: 3,
  },
];

const gymData = [
  {
    name: 'FitCore Sydney CBD',
    description: 'Premium fitness facility in the heart of Sydney CBD with state-of-the-art equipment.',
    address: '123 George Street',
    suburb: 'Sydney',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    location: { type: 'Point', coordinates: [151.2093, -33.8688] },
    phone: '(02) 9123 4567',
    email: 'sydney@fitcore.com.au',
    facilities: ['Free Weights', 'Cardio Zone', 'Pool', 'Sauna', 'Spin Studio', 'Yoga Studio'],
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800',
    ],
    rating: 4.7,
    reviewCount: 312,
    isVerified: true,
  },
  {
    name: 'Iron Paradise Melbourne',
    description: 'Hardcore strength training gym in Melbourne with Olympic lifting platforms.',
    address: '456 Collins Street',
    suburb: 'Melbourne',
    city: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    location: { type: 'Point', coordinates: [144.9631, -37.8136] },
    phone: '(03) 9876 5432',
    email: 'melbourne@ironparadise.com.au',
    facilities: ['Olympic Lifting', 'Powerlifting', 'Free Weights', 'Functional Zone'],
    gallery: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800',
    ],
    rating: 4.9,
    reviewCount: 189,
    isVerified: true,
  },
  {
    name: 'AquaFit Brisbane',
    description: 'Aquatics and fitness centre in Brisbane with Olympic pool and gym facilities.',
    address: '789 Queen Street',
    suburb: 'Brisbane City',
    city: 'Brisbane',
    state: 'QLD',
    postcode: '4000',
    location: { type: 'Point', coordinates: [153.0251, -27.4698] },
    phone: '(07) 3456 7890',
    email: 'brisbane@aquafit.com.au',
    facilities: ['Olympic Pool', 'Hydrotherapy', 'Gym Floor', 'Cardio', 'Aqua Aerobics'],
    gallery: [
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800',
    ],
    rating: 4.5,
    reviewCount: 245,
    isVerified: true,
  },
  {
    name: 'Zen Wellness Perth',
    description: 'Holistic wellness studio in Perth focusing on mind-body connection.',
    address: '321 Murray Street',
    suburb: 'Perth',
    city: 'Perth',
    state: 'WA',
    postcode: '6000',
    location: { type: 'Point', coordinates: [115.8605, -31.9505] },
    phone: '(08) 9234 5678',
    email: 'perth@zenwellness.com.au',
    facilities: ['Yoga Studio', 'Pilates', 'Meditation Room', 'Barre', 'Infrared Sauna'],
    gallery: [
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    ],
    rating: 4.8,
    reviewCount: 167,
    isVerified: true,
  },
  {
    name: 'CrossFit North Adelaide',
    description: 'Elite CrossFit box in Adelaide with expert coaches and community focus.',
    address: '567 Rundle Street',
    suburb: 'Adelaide',
    city: 'Adelaide',
    state: 'SA',
    postcode: '5000',
    location: { type: 'Point', coordinates: [138.6007, -34.9285] },
    phone: '(08) 8123 4567',
    email: 'adelaide@crossfitnorth.com.au',
    facilities: ['CrossFit Rig', 'Olympic Lifting', 'Cardio', 'Outdoor Track'],
    gallery: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=800',
    ],
    rating: 4.6,
    reviewCount: 134,
    isVerified: true,
  },
];

const classTemplates = [
  { name: 'Morning Yoga Flow', instructor: 'Sarah Chen', category: 'yoga', dayOfWeek: 1, startTime: '07:00', duration: 60, capacity: 20 },
  { name: 'HIIT Blast', instructor: 'Mike Johnson', category: 'hiit', dayOfWeek: 2, startTime: '06:30', duration: 45, capacity: 25 },
  { name: 'Spin Class', instructor: 'Emma Wilson', category: 'spin', dayOfWeek: 3, startTime: '18:00', duration: 45, capacity: 30 },
  { name: 'Boxing Fundamentals', instructor: 'James Lee', category: 'boxing', dayOfWeek: 4, startTime: '17:30', duration: 60, capacity: 15 },
  { name: 'Pilates Core', instructor: 'Lisa Park', category: 'pilates', dayOfWeek: 5, startTime: '09:00', duration: 55, capacity: 18 },
  { name: 'CrossFit WOD', instructor: 'Tom Brooks', category: 'crossfit', dayOfWeek: 6, startTime: '08:00', duration: 60, capacity: 20 },
];

async function seed() {
  await mongoose.connect(MONGO_URI, { family: 4, serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected to MongoDB');


  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Gym.deleteMany({}),
    Class.deleteMany({}),
    MembershipPlan.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create membership plans
  const plans = await MembershipPlan.insertMany(membershipPlans);
  console.log(`✅ Created ${plans.length} membership plans`);

  // Create users
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@activemesh.com.au',
    passwordHash: 'Admin@1234',
    role: 'admin',
  });

  const ownerUser = await User.create({
    name: 'Gym Owner',
    email: 'owner@activemesh.com.au',
    passwordHash: 'Owner@1234',
    role: 'gym_owner',
  });

  const memberUser = await User.create({
    name: 'Jane Member',
    email: 'member@activemesh.com.au',
    passwordHash: 'Member@1234',
    role: 'user',
  });

  console.log('✅ Created 3 users (admin, owner, member)');

  // Create gyms with the owner
  const gyms = await Promise.all(
    gymData.map((g) => Gym.create({ ...g, owner: ownerUser._id }))
  );
  console.log(`✅ Created ${gyms.length} gyms`);

  // Create classes for each gym
  const classPromises = gyms.flatMap((gym) =>
    classTemplates.map((tmpl) =>
      Class.create({ gym: gym._id, ...tmpl, schedule: { dayOfWeek: tmpl.dayOfWeek, startTime: tmpl.startTime, duration: tmpl.duration } })
    )
  );
  const classes = await Promise.all(classPromises);
  console.log(`✅ Created ${classes.length} classes`);

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Login credentials:');
  console.log('  Admin:  admin@activemesh.com.au  / Admin@1234');
  console.log('  Owner:  owner@activemesh.com.au  / Owner@1234');
  console.log('  Member: member@activemesh.com.au / Member@1234');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
