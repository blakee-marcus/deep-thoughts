const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    author: User
    reactionCount: Int
    reactions: [Reaction]
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
  }
`;

module.exports = typeDefs;
