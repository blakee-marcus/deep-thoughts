const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

        return userData;
      }
      throw new AuthenticationError('Not Logged In');
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find({ username: username })
        .populate('author')
        .populate({ path: 'reactions', populate: 'author' })
        .sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id })
        .populate('author')
        .populate({ path: 'reactions', populate: 'author' });
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('following')
        .populate('followers')
        .populate('thoughts');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('following')
        .populate('followers')
        .populate('thoughts');
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, args, context) => {
      if (context.user) {
        const thought = await Thought.create({
          ...args,
          author: context.user._id,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $push: {
              reactions: {
                reactionBody,
                author: context.user._id,
              },
            },
          },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    followUser: async (parent, { userId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { following: userId } },
          { new: true }
        ).populate('following');

        const updatedFollowedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { followers: context.user._id } },
          { new: true }
        ).populate('followers');
        return updatedUser && updatedFollowedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    unfollowUser: async (parent, { userId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { following: userId } },
          { new: true }
        ).populate('following');

        const updatedFollowedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { followers: context.user._id } },
          { new: true }
        ).populate('followers');
        return updatedUser && updatedFollowedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    updateName: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { name: args.name },
          { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;

