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
      username
      name
      email
      friendCount
      friends {
        _id
        username
      }
      thoughts {
        _id
        author {
          _id
          username
          name
        }
        thoughtText
        createdAt
        reactionCount
      }
    }
  }
`;

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      name
      email
      friendCount
      thoughts {
        _id
        author {
          _id
          username
          name
        }
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          author {
            _id
            username
            name
          }
        }
      }
      friends {
        _id
        username
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
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

