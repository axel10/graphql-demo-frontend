import gql from 'graphql-tag'

export const CREATE_PLAYER = gql`
  mutation ($player: PlayerInput!) {
    createPlayer(player: $player) {
      id name birthDate
    }
  }
`

export const GET_PLAYER = gql`query{
  players{
    name,
    birthDate,
    id
  }
}`

export const EDIT_PLAYER = gql`
  mutation ($player:PlayerInput!){
    editPlayer(player:$player) {
      id name birthDate
    }
  }
`
