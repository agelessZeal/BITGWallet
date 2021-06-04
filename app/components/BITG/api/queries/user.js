
import { gql, useQuery } from '@apollo/client';

export const GET_USER_BY_BITG_ADDRESS = gql`
  query MyQuery($bitgAddress: String!) {
    userByBitgAddress(bitgAddress: $bitgAddress) {
      username
      id
    }
  }
`;

export const GET_USERS_BY_BITG_ADDRESSES = gql`
  query GetUsersByAddresses($addresses: [String!]) {
    users(filter: {bitgAddress: {in: $addresses}}) {
      nodes {
        bitgAddress
        id
        username
      }
    }
  }
`;

export const GET_USER_BY_EITHER_USERNAMES_OR_ADDRESSES = gql`
  query getUserByEitherUsernamesOrAddresses($str: String!) {
    users(
      filter: {
        or: [{ username: { equalTo: $str } }, { bitgAddress: { equalTo: $str } }]
      }
    ) {
      nodes {
        id
        username
        bitgAddress
      }
    }
  }
`;

export const GET_MERCHANTS = gql`
  query MyQuery {
    merchants {
      nodes {
        id
        url
        name
        description
        logo
        image
      }
    }
  }
`;

export const GET_ARTICLES = gql`
  query MyQuery {
    articles {
      nodes {
        image
        url
        datePublished
        header
        createdAt
        id
        description
      }
    }
  }
`;