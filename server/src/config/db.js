import mongoose from 'mongoose';
import dns from 'dns';

// Local DNS (127.0.0.1) blocks MongoDB Atlas SRV record lookups.
// Override to public DNS so c-ares can resolve _mongodb._tcp SRV records.
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
