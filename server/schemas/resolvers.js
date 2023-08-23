const { AuthenticationError } = require('apollo-server-express');
const { User, Thought, Notification } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate({
            path: 'thoughts',
            options: { sort: { createdAt: -1 } }
          })
          .populate('following')
          .populate('followers')
          .populate({ path: 'notifications', populate: 'fromUser' })
          .populate('likes');

        return userData;
      }
      throw new AuthenticationError('Not Logged In');
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find({ username })
        .populate('author')
        .populate('likes')
        .populate({ path: 'reactions', populate: 'author' })
        .sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => Thought.findOne({ _id })
      .populate('author')
      .populate('likes')
      .populate({ path: 'reactions', populate: 'author' }),
    users: async () => User.find()
      .select('-__v -password')
      .populate('following')
      .populate('followers')
      .populate('likes')
      .populate({
        path: 'thoughts',
        options: { sort: { createdAt: -1 } }
      }),
    thoughtsFromFollowing: async (parent, args, context) => {
      if (context.user) { 
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate({
            path: 'following',
            populate: { 
              path: 'thoughts',
              options: { sort: { createdAt: -1 } },
              populate: 'author'
            },
          });
        return userData
      }
      throw new AuthenticationError('Not Logged In');
    },
    user: async (parent, { username }) => User.findOne({ username })
      .select('-__v -password')
      .populate('following')
      .populate('followers')
      .populate({ path: 'likes', populate: 'author' })
      .populate({
        path: 'thoughts',
        options: { sort: { createdAt: -1 } }
      }),
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
          { new: true },
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
          { new: true, runValidators: true },
        );

        const createdNotification = await Notification.create({
          notificationType: 'reply',
          fromUser: context.user._id,
          forUser: updatedThought.author,
          relatedThought: thoughtId,
        });
        const updatedUser = await User.findOneAndUpdate(
          { _id: updatedThought.author },
          { $push: { notifications: createdNotification._id } },
          { new: true },
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
          { new: true },
        ).populate('following');
        
        const createdNotification = await Notification.create({
          notificationType: 'follow',
          fromUser: context.user._id,
          forUser: userId,
        });

        const updatedFollowedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { followers: context.user._id }, $push: { notifications: createdNotification._id } },
          { new: true },
        ).populate('followers');
        console.log(updatedFollowedUser);
        return updatedUser && updatedFollowedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    unfollowUser: async (parent, { userId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { following: userId } },
          { new: true },
        ).populate('following');

        const updatedFollowedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { followers: context.user._id } },
          { new: true },
        ).populate('followers');
        return updatedUser && updatedFollowedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    likeThought: async (parent, { thoughtId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { likes: thoughtId } },
          { new: true },
        ).populate('likes');

        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $addToSet: { likes: context.user._id } },
          { new: true },
        ).populate('likes');
        return updatedUser && updatedThought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    unlikeThought: async (parent, { thoughtId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { likes: thoughtId } },
          { new: true },
        ).populate('likes');

        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $pull: { likes: context.user._id } },
          { new: true },
        ).populate('likes');
        return updatedUser && updatedThought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    updateProfile: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { name: args.name, bio: args.name, location: args.location, website: args.website },
          { new: true },
        );

        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
