import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      createdAt
      author {
        _id
        username
        name
      }
      reactionCount
      reactions {
        _id
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        author {
          _id
          username
          name
        }
      }
    }
  }
`;

export const UPDATE_NAME = gql`
  mutation updateName($username: String!, $name: String!) {
    updateName(username: $username, name: $name) {
      _id
    }
  }
`;

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($username: String!, $name: String!, $bio: String!, $location: String!, $website: String!) {
  updateProfile(username: $username, name: $name, bio: $bio, location: $location, website: $website) {
    _id
    bio
    location
    name
    username
    website
  }
}`;

export const FOLLOW_USER = gql`
mutation followUser($userId: ID!) {
  followUser(userId: $userId) {
    _id
  }
}
`
export const UNFOLLOW_USER = gql`
mutation unfollowUser($userId: ID!) {
  unfollowUser(userId: $userId) {
    _id
  }
}
`

