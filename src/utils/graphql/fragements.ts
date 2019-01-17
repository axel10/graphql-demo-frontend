import gql from 'graphql-tag'

export const PlayerFragement = gql`
  fragment PlayerFragment on PlayerType{
    id
    birthDate
    name
    birthPlace
    weightLbs
    height
  }
`
