import React from 'react'
import { ApolloProvider, Query } from 'react-apollo'
import ReactDOM from 'react-dom'
import { Create } from 'src/components/createPlayerForm'
import { DELETE_PLAYER, GET_PLAYERS } from 'src/querys/player'
import { NhlMutation, NhlQuery, PlayerType } from 'src/types'
import { client } from 'src/utils/apolloClient'
import { showEditPlayerModal } from 'src/utils/utils'
import './base.less'

class PlayerList extends React.Component {

  public showEditModal = (player: PlayerType) => () => {
    showEditPlayerModal(player)
  }

  public deletePlayer = (id) => (e: React.MouseEvent) => {
    e.stopPropagation()
    client.mutate({
      mutation: DELETE_PLAYER,
      variables: {
        id
      },
      update (cache, { data }: { data: NhlMutation }) {
        console.log(data)
        const { players } = cache.readQuery({ query: GET_PLAYERS }) as NhlQuery
        cache.writeQuery({ query: GET_PLAYERS, data: { players: players.filter(item => item.id !== id) } })
      }
    })
  }

  public render () {
    return (
      <div>
        <Query query={GET_PLAYERS}>
          {
            ({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>
              if (error) return <p>Error :(</p>
              const players: PlayerType[] = data.players
              return players.map((o, i) => (
                <div key={i} onClick={this.showEditModal(o)}>
                  {o.name} {o.birthDate} <span style={{ color: 'red' }} onClick={this.deletePlayer(o.id)}>删除</span>
                </div>
              ))
            }
          }
        </Query>
      </div>
    )
  }
}

ReactDOM.render(
  <div>
    <ApolloProvider client={client}>
      <PlayerList/>
      <Create/>
    </ApolloProvider>
  </div>, document.getElementById('root'))
