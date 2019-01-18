import gql from 'graphql-tag'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import ReactDOM from 'react-dom'
import EditPlayerModal from 'src/components/editPlayerModal'
import { GET_PLAYER } from 'src/querys/player'
import { PlayerType } from 'src/types'
import { client } from 'src/utils/apolloClient'

export function showEditPlayerModal (player: PlayerType) {
  client.query<{ player: PlayerType }>({
    query: GET_PLAYER,
    variables: {
      id: player.id
    }
  }).then(o => {
    console.log(o)
    document.body.appendChild(container)
    ReactDOM.render(
      <ApolloProvider client={client}>
        <EditPlayerModal player={o.data.player} onCancel={onCancel}/>
      </ApolloProvider>,
      container)
  })
  const container = document.createElement('div')
  container.className = 'g-mask'
  container.id = 'g-mask'

  function onCancel () {
    ReactDOM.unmountComponentAtNode(container)
    document.body.removeChild(container)
  }
}

function omitTypename (key, val) {
  return key === '__typename' ? undefined : val
}

export function removeTypename (obj) {
  return JSON.parse(JSON.stringify(obj), omitTypename)
}

export function HOF (fn, ...args) {
  return () => {
    fn.apply(this, args)
  }
}
