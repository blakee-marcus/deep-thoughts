const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Notification {
    _id: ID!
    notificationType: String!
    notificationDate: String
    fromUser: User
    forUser: User
    relatedThought: Thought
  }
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    author: User
    reactionCount: Int
    reactions: [Reaction]
    likeCount: Int
    likes: [User]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    author: User
  }
  type User {
    _id: ID
    username: String
    name: String
    bio: String
    location: String
    website: String
    email: String
    followingCount: Int
    followersCount: Int
    thoughts: [Thought]
    following: [User]
    followers: [User]
    likes: [Thought]
    notifications: [Notification]
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
    users: [User]
    user(username: String): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
    thoughtsFromFollowing: User
    notifications: [Notification]
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
    updateProfile(username: String!, name: String!, bio: String!, location: String!, website: String!): User
    followUser(userId: ID!): User
    unfollowUser(userId: ID!): User
    likeThought(thoughtId: ID!): Thought
    unlikeThought(thoughtId: ID!): Thought
  }
`;

module.exports = typeDefs;
