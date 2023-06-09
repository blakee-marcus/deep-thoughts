const { gql } = require("apollo-server-express");

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
    type User{
        _id: ID
        username: String
        name: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
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
        updateName(username: String!, name: String!): User
    }
`;

module.exports = typeDefs;
