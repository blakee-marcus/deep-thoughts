const faker = require('faker');

const db = require('../config/connection');
const { Thought, User } = require('../models');

db.once('open', async () => {
  await Thought.deleteMany({});
  await User.deleteMany({});

  // create user data
  const userData = [];

  for (let i = 0; i < 50; i += 1) {
    const username = faker.internet.userName();
    const name = faker.hacker.adjective() + ' ' + faker.hacker.noun();
    const email = faker.internet.email(username);
    const password = faker.internet.password();

    userData.push({ username, name, email, password });
  }

  const createdUsers = await User.collection.insertMany(userData);

  // create friends
  for (let i = 0; i < 100; i += 1) {
    const randomUserIndex = Math.floor(
      Math.random() * createdUsers.insertedCount - 1
    );
    const userId = createdUsers.insertedIds[randomUserIndex];

    let friendId = userId;

    while (friendId === userId) {
      const randomUserIndex = Math.floor(
        Math.random() * createdUsers.insertedCount - 1
      );
      friendId = createdUsers.insertedIds[randomUserIndex];
    }

    await User.updateOne({ _id: userId }, { $addToSet: { friends: friendId } });
  }

  // create thoughts
  let createdThoughts = [];
  for (let i = 0; i < 100; i++) {
    const thoughtText = faker.hacker.phrase();

    const randomUserIndex = Math.floor(
      Math.random() * createdUsers.insertedCount - 1
    );
    const userId = createdUsers.insertedIds[randomUserIndex];

    const createdThought = await Thought.create({
      thoughtText,
      username: userId,
    });

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { thoughts: createdThought._id } }
    );

    createdThoughts.push(createdThought);
  }

  // create reactions
  //   for (let i = 0; i < 100; i += 1) {
  //     const reactionBody = faker.lorem.words(Math.round(Math.random() * 20) + 1);

  //     const randomUserIndex = Math.floor(
  //       Math.random() * createdUsers.insertedCount - 1
  //     );
  //     const { username } = createdUsers.insertedIds[randomUserIndex];

  //     const randomThoughtIndex = Math.floor(
  //       Math.random() * createdThoughts.length
  //     );
  //     const { _id: thoughtId } = createdThoughts[randomThoughtIndex];

  //     await Thought.updateOne(
  //       { _id: thoughtId },
  //       { $push: { reactions: { reactionBody, username } } },
  //       { runValidators: true }
  //     );
  //   }

  console.log('all done!');
  process.exit(0);
});

