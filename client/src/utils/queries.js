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
      likeCount
      likes {
        _id
        name
        username
        bio
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
      likeCount
      likes {
        _id
        name
        username
        bio
      }
    }
  }
`;

export const QUERY_FOLLOWING_THOUGHTS = gql`
query {
  thoughtsFromFollowing {
    following {
      thoughts {
        _id
        author {
          name
          username
        }
        createdAt
        likeCount
        reactionCount
        thoughtText
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
      bio
      location
      website
      username
      followersCount
      followers {
        _id
        name
        username
        bio
      }
      followingCount
      following {
        _id
        name
        username
        bio
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
        likeCount
        thoughtText
        likes {
        _id
        }
      }
      likes {
        _id
        author {
          _id
          name
          username
        }
        createdAt
        likes {
          _id
        }
        reactionCount
        likeCount
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
      bio
      location
      website
      username
      followersCount
      followers {
        _id
        name
        username
        bio
      }
      followingCount
      following {
        _id
        name
        username
        bio
      }
      thoughts {
        _id
        createdAt
        reactionCount
        likeCount
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
  query me {
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

export const QUERY_MY_LIKES = gql`
  query me {
  me {
    likes {
      _id
    }
  }
}`;

