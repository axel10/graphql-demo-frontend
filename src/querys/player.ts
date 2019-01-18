import gql from 'graphql-tag'
import { PlayerFragement } from 'src/utils/graphql/fragements'

export const CREATE_PLAYER = gql`
  mutation ($player: PlayerInput!) {
    createPlayer(player: $player) {
      id name birthDate
    }
  }
`

export const GET_PLAYERS = gql`query{
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

export const DELETE_PLAYER = gql`
  mutation NHLMutation($id:Int!){
    deletePlayer(id:$id)
  }
`

export const GET_PLAYER = gql`
  query ($id:Int!){
    player(id:$id){
      ...PlayerFragment
    }
  }
  ${PlayerFragement}
`
