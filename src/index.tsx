import React from 'react'
import { ApolloProvider, Query } from 'react-apollo'
import ReactDOM from 'react-dom'
import { Create } from 'src/components/createPlayerForm'
import { GET_PLAYER } from 'src/querys/player'
import { PlayerType } from 'src/types'
import { client } from 'src/utils/apolloClient'
import { showEditPlayerModal } from 'src/utils/utils'
import './base.less'

class PlayerList extends React.Component {

  public showEditModal = (player: PlayerType) => () => {
    showEditPlayerModal(player)
  }

  public render () {
    return (
      <div>
        <Query query={GET_PLAYER}>
          {
            ({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>
              if (error) return <p>Error :(</p>
              const players: PlayerType[] = data.players
              console.log(players)
              return players.map((o, i) => (
                <div key={i} onClick={this.showEditModal(o)}>
                  {o.name} {o.birthDate}
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
