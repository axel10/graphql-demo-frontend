import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'
import { ApolloProvider, Mutation, MutationFunc, OperationVariables, Query } from 'react-apollo'
import ReactDOM from 'react-dom'
import { PlayerInput, PlayerType } from 'src/types'
import { FormUtils, getDescriptor } from 'src/utils/utils'

const client = new ApolloClient({
  uri: 'http://localhost:2537/graphql'
})

interface IState {
  form: PlayerInput
}

const initState: IState = {
  form: { name: '' }
}

const formUtils = new FormUtils<IState>({
  initState,
  descriptor: {
    form:
      {
        name: { type: 'string', require: true },
        height: getDescriptor({ required: true, isNumber: true })
        /*        height (rule, value, callback) {
                  const errs = []
                  if (!/^[0-9]+$/.test(value)) {
                    errs.push(new Error('请输入数字'))
                  }
                  callback(errs)
                }*/
      }
  }
})

class Create extends React.Component <any, IState> {

  public state = cloneDeep(initState)

  public bindField = () => (e) => {
    console.log('change')
    const target = e.target as HTMLInputElement
    const val = target.value
    const key = target.name
    const formName = target.form.getAttribute('name')
    const formData = this.state[formName]

    const obj: any = {
      [formName]: {
        ...formData,
        [key]: val
      }
    }
    console.log(obj)
    this.setState(obj, () => {
      console.log(this.state)
    })
  }

  public resetForm = () => (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement
    const formName = form.getAttribute('name')
    const { state } = this
    state[formName] = cloneDeep(initState[formName])
    this.setState(state)
  }

  public handleSubmit = (createPlayer: MutationFunc, data) => (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    formUtils.validate(e.target as HTMLFormElement).then(o => {
      /*      createPlayer({ variables: { player: formUtils.state[form.getAttribute('name')] } }).then(o => {
              console.log(o)
            })*/
      console.log('pass')
    }).catch((e) => {
      console.log(e)
    })
  }

  public render () {
    return (
      <div>
        <Mutation mutation={gql`
mutation ($player: PlayerInput!) {
  createPlayer(player: $player) {
    id
    name
  }
}
  `}>
          {
            (createPlayer, { data }) => (
              <form name='form' onReset={formUtils.resetForm} onSubmit={this.handleSubmit(createPlayer, data)}>
                <div>
                  姓名
                  <input type='text' name='name' onChange={formUtils.bindField}/>
                </div>
                <div>
                  身高
                  <input type='number' name='height' onChange={formUtils.bindField}/>
                </div>
                <button type='submit'>提交</button>
              </form>
            )
          }
        </Mutation>
      </div>
    )
  }
}

const Q = () => (
  <Query query={gql`
query{
  players{
    name,
    birthDate
  }
}
`}>
    {
      ({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error :(</p>

        const players: PlayerType[] = data.players
        return players.map((o, i) => (
          <div key={i}>
            {o.name}
            {o.birthDate}
          </div>
        ))
      }
    }
  </Query>
)

ReactDOM.render(
  <div>
    <ApolloProvider client={client}>
      <Q/>
      <Create/>
    </ApolloProvider>
  </div>, document.getElementById('root'))
