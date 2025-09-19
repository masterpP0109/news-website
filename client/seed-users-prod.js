import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load production environment
dotenv.config({ path: '.env.production' });

// User Schema (same as before)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin', 'superadmin'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function seedProductionUsers() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to production database');

    // Clear existing users
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');

    // Create users with hashed passwords
    const users = [
      {
        email: 'admin@yourdomain.com',
        password: await hashPassword('SecureAdminPass123!'),
        name: 'Production Admin',
        role: 'admin'
      },
      {
        email: 'superadmin@yourdomain.com',
        password: await hashPassword('SuperSecurePass456!'),
        name: 'Super Admin',
        role: 'superadmin'
      }
    ];

    await User.insertMany(users);
    console.log(`✅ Seeded ${users.length} production users`);

    // List created users (without passwords)
    const createdUsers = await User.find({}, { password: 0 });
    console.log('👥 Created users:', createdUsers);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedProductionUsers();