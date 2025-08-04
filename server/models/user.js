const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is required only if user doesn't have GitHub ID (regular signup)
        return !this.githubId;
      },
    },
    // GitHub OAuth fields
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but unique non-null values
      index: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Account type tracking
    accountType: {
      type: String,
      enum: ['local', 'github', 'hybrid'], // hybrid for users who signed up locally then connected GitHub
      default: 'local',
    },
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // GitHub profile data (optional, for additional features)
    githubProfile: {
      username: String,
      publicRepos: Number,
      followers: Number,
      following: Number,
      bio: String,
      location: String,
      company: String,
      blog: String,
    },
    // Last login tracking
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    // Login method tracking
    lastLoginMethod: {
      type: String,
      enum: ['local', 'github'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ githubId: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to set account type
userSchema.pre('save', function(next) {
  if (this.isNew) {
    if (this.githubId && !this.password) {
      this.accountType = 'github';
      this.isEmailVerified = true; // GitHub emails are verified
    } else if (this.githubId && this.password) {
      this.accountType = 'hybrid';
    } else {
      this.accountType = 'local';
    }
  }
  next();
});

// Instance method to get full name
userSchema.methods.getFullName = function() {
  return `${this.firstname} ${this.lastname}`.trim();
};

// Instance method to get display avatar
userSchema.methods.getDisplayAvatar = function() {
  if (this.avatar) {
    return this.avatar;
  }
  // Fallback to Gravatar or initials-based avatar
  const initials = `${this.firstname.charAt(0)}${this.lastname.charAt(0)}`.toUpperCase();
  return `https://ui-avatars.com/api/?name=${initials}&background=3B82F6&color=fff&size=150`;
};

// Instance method to check if user can login with password
userSchema.methods.canLoginWithPassword = function() {
  return this.accountType === 'local' || this.accountType === 'hybrid';
};

// Static method to find user by email or GitHub ID
userSchema.statics.findByEmailOrGitHub = function(email, githubId) {
  const query = { $or: [] };
  
  if (email) {
    query.$or.push({ email: email });
  }
  
  if (githubId) {
    query.$or.push({ githubId: githubId });
  }
  
  return this.findOne(query);
};

// Virtual for user profile summary
userSchema.virtual('profileSummary').get(function() {
  return {
    id: this._id,
    name: this.getFullName(),
    email: this.email,
    avatar: this.getDisplayAvatar(),
    accountType: this.accountType,
    isEmailVerified: this.isEmailVerified,
    joinedAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
});

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;