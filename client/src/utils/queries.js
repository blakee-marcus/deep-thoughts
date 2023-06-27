import { gql } from '@apollo/client';

export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      author {
        _id
        username
        name
      }
      createdAt
      thoughtText
      reactionCount
      reactions {
        _id
        createdAt
        reactionBody
        author {
          _id
          name
          username
        }
      }
    }
  }
`;

export const QUERY_THOUGHT = gql`
  query thought($id: ID!) {
    thought(_id: $id) {
      _id
      author {
        _id
        username
        name
      }
      createdAt
      thoughtText
      reactionCount
      reactions {
        _id
        createdAt
        reactionBody
        author {
          _id
          name
          username
        }
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      email
      name
      username
      followersCount
      followers {
        _id
        name
        username
      }
      followingCount
      following {
        _id
        name
        username
      }
      thoughts {
        _id
        author {
          _id
          name
          username
        }
        createdAt
        reactionCount
        thoughtText
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      email
      name
      username
      followersCount
      followers {
        _id
        name
        username
      }
      followingCount
      following {
        _id
        name
        username
      }
      thoughts {
        _id
        createdAt
        reactionCount
        thoughtText
        reactions {
          _id
          createdAt
          reactionBody
          author {
            _id
            name
            username
          }
        }
        author {
          _id
          name
          username
        }
      }
    }
  }
`;

export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      followingCount
      following {
        _id
        name
        username
      }
    }
  }
`;

