const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      minlength: 1,
      maxlength: 50,
      default() {
        return this.username;
      },
    },
    bio: {
      type: String,
      maxlength: 160,
      default() {
        return '';
      },
    },
    location: {
      type: String,
      maxlength: 30,
      default() {
        return '';
      },
    },
    website: {
      type: String,
      maxlength: 100,
      default() {
        return '';
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual('followingCount').get(function () {
  return this.following.length;
});
userSchema.virtual('followersCount').get(function () {
  return this.followers.length;
});

const User = model('User', userSchema);

module.exports = User;
