const faker = require('faker');

const db = require('../config/connection');
const { Thought, User } = require('../models');

db.once('open', async () => {
  await Thought.deleteMany({});
  await User.deleteMany({});
  console.log('user creation');
  // create user data
  const userData = [];

  for (let i = 0; i < 20; i += 1) {
    const username = faker.internet.userName();
    const name = `${faker.hacker.ingverb()} ${faker.hacker.noun()}`;
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    userData.push({
      username,
      name,
      email,
      password,
    });
  }

  const createdUsers = await User.collection.insertMany(userData);
  console.log('friend creation');
  // create friends
  for (let i = 0; i < 20; i += 1) {
    const randomUserIndex = Math.floor(
      Math.random() * createdUsers.insertedCount - 1,
    );
    const userId = createdUsers.insertedIds[randomUserIndex];

    let friendId = userId;

    while (friendId === userId) {
      friendId = createdUsers.insertedIds[randomUserIndex];
    }

    await User.updateOne({ _id: userId }, { $addToSet: { following: friendId } });
  }
  console.log('thought creation');
  // create thoughts
  const createdThoughts = [];
  for (let i = 0; i < 20; i += 1) {
    const randomUserIndex = Math.floor(
      Math.random() * createdUsers.insertedCount - 1,
    );
    const userId = createdUsers.insertedIds[randomUserIndex];
    const user = await User.findById(userId);
    if (user) {
      const thoughtText = faker.hacker.phrase();

      const createdThought = await Thought.create({
        thoughtText,
        author: userId,
      });

      const updatedUser = await User.updateOne(
        { _id: userId },
        { $push: { thoughts: createdThought._id } },
      );

      createdThoughts.push(createdThought);
    }
  }
  console.log('reaction creation');
  // create reactions
  for (let i = 0; i < 20; i += 1) {
    const randomUserIndex = Math.floor(
      Math.random() * createdUsers.insertedCount - 1,
    );
    const userId = createdUsers.insertedIds[randomUserIndex];
    const user = await User.findById(userId);
    if (user) {
      const reactionBody = faker.hacker.phrase();
      //   const username = user.username;
      const randomThoughtIndex = Math.floor(
        Math.random() * createdThoughts.length,
      );
      const { _id: thoughtId } = createdThoughts[randomThoughtIndex];
      await Thought.updateOne(
        { _id: thoughtId },
        { $push: { reactions: { reactionBody, author: user._id } } },
        { runValidators: true },
      );
    }
  }
  console.log('all done!');
  process.exit(0);
});
