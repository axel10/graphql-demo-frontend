import React from 'react'
import { Mutation, MutationFunc } from 'react-apollo'
import { CREATE_PLAYER, GET_PLAYERS } from 'src/querys/player'
import { NhlMutation, NhlQuery, PlayerInput } from 'src/types'
import { FormUtils } from 'src/utils/formUtils'
import styles from './style.less'

interface IState {
  form: PlayerInput
}

const initState: IState = {
  form: { name: '' }
}

const formUtils = new FormUtils<IState>({
  initState
})

export class Create extends React.Component {

  public handleCreateSubmit = (createPlayer: MutationFunc, data) => (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    createPlayer({ variables: { player: formUtils.state[form.getAttribute('name')] } }) // 取出表单数据并提交
  }

  public handleUpdate = (cache, { data }: { data: NhlMutation }) => { // 服务器相应成功后更新本地数据
    const createdPlayer = data.createPlayer
    const { players } = cache.readQuery({ query: GET_PLAYERS }) as NhlQuery // 先读取本地数据
    cache.writeQuery({ query: GET_PLAYERS, data: { players: players.concat(createdPlayer) } }) // 写入处理后的数据
  }

  public render () {
    return (
      <div className={styles.CreatePlayer}>
        新增player
        <Mutation mutation={CREATE_PLAYER}
                  update={this.handleUpdate}
        >
          {
            (createPlayer, { data }) => (
              <form name='form' onSubmit={this.handleCreateSubmit(createPlayer, data)}>
                <div>
                  <label>
                    姓名
                    <input type='text' name='name' onChange={formUtils.bindField}/>
                  </label>
                </div>
                <div>
                  <label>
                    身高
                    <input type='number' name='height' onChange={formUtils.bindField}/>
                  </label>
                </div>
                <div>
                  <label>
                    出生日期
                    <input type='date' name='birthDate' onChange={formUtils.bindField}/>
                  </label>
                </div>
                <div>
                  <label>
                    体重
                    <input type='number' name='weightLbs' onChange={formUtils.bindField}/>
                  </label>
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
