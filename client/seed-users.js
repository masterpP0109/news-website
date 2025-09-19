import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

// Hash passwords before storing
const hashPassword = async (password) => {
  const saltRounds = 12; // Use 12 rounds for production
  return await bcrypt.hash(password, saltRounds);
};

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

// User data with hashed passwords
const createUserData = async () => {
  return [
    {
      email: 'user@example.com',
      password: await hashPassword('password123'),
      name: 'John Doe',
      role: 'user'
    },
    {
      email: 'admin@example.com',
      password: await hashPassword('password123'),
      name: 'Jane Smith',
      role: 'admin'
    },
    {
      email: 'superadmin@example.com',
      password: await hashPassword('password123'),
      name: 'Bob Johnson',
      role: 'superadmin'
    }
  ];
};

async function seedUsers() {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI environment variable is not set');
      console.error('Please set your MongoDB connection string in .env.local');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Clear existing user data
    console.log('🧹 Clearing existing user data...');
    await User.deleteMany({});

    // Insert new data
    console.log('📝 Inserting user data...');
    const userData = await createUserData();
    const insertedUsers = await User.insertMany(userData);

    console.log(`✅ Successfully seeded ${insertedUsers.length} users!`);
    console.log('👥 User roles:');

    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    roleStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} users`);
    });

    console.log('\n🎉 User seeding completed successfully!');
    console.log('🔐 Demo credentials:');
    userData.forEach(user => {
      console.log(`  ${user.role}: ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedUsers();