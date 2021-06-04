
import { gql, useQuery } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($publicKey: String!) {
        __typename
        createUserAccountWithPublicKey(input: { publicKey: $publicKey }) {
            message
        }
    }
`;

export const VERIFY_MESSAGE = gql`
    mutation verifyMessage($message: String!, $publicKey:String!, $signature:String!) {
        verifyMessageForSigning(
            input: {
                message: $message
                publicKey: $publicKey
                signature: $signature
            }
        ) {
            access_token
            access_token_expires_at
        }
    }
`;

export const GET_MESSAGE = gql`
    mutation getMessage($publicKey: String!) {
        getMessageForSigning(input: { publicKey: $publicKey }) {
            message
        }
    }
`;

export const UPDATE_USER = gql`
    mutation MyMutation($username: String!, $id: UUID!) {
        __typename
        updateUser(input: {patch: {username: $username}, id: $id}) {
            user {
                username
                id
            }
        }
    }
`;