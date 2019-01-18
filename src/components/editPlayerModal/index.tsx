import * as React from 'react'
import { Mutation, MutationFunc } from 'react-apollo'
import { EDIT_PLAYER, GET_PLAYERS } from 'src/querys/player'
import { NhlQuery, PlayerInput, PlayerType } from 'src/types'
import { FormUtils } from 'src/utils/formUtils'
import { removeTypename } from 'src/utils/utils'
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

export default class EditPlayerModal extends React.Component<{ player: PlayerType, onCancel: () => void }> {

  public formName = 'edit'

  constructor (props) {
    super(props)
    formUtils.state[this.formName] = this.props.player
  }

  public handleEditSubmit = (editPlayer: MutationFunc, data) => (e: React.FormEvent) => {
    const player = removeTypename(formUtils.state[this.formName]) // 删除apollo为了进行状态管理而添加的__typename字段，否则报错
    editPlayer({
      variables: { player },
      update (cache) {
        const { players } = cache.readQuery({ query: GET_PLAYERS }) as NhlQuery
        Object.assign(players.find(o => o.id === player.id), player) // 提交修改
        cache.writeQuery({ query: GET_PLAYERS, data: { players } }) // 写入
      }
    }) // 提交
    this.props.onCancel()
  }

  public render () {
    const { player, onCancel } = this.props
    console.log(player)

    return (
      <div className={styles.wrap}>
        <div className='form-content'>
          <Mutation mutation={EDIT_PLAYER}
          >
            {
              (editPlayer, { data }) => {
                return (
                  <div>
                    <span className={styles.cancel} onClick={onCancel}>取消</span>
                    <form name={this.formName} onReset={formUtils.resetForm}
                          onSubmit={this.handleEditSubmit(editPlayer, data)}>
                      <div>
                        <label>
                          姓名
                          <input defaultValue={player.name} type='text' name='name' onChange={formUtils.bindField}/>
                        </label>
                      </div>
                      <div>
                        <label>
                          身高
                          <input defaultValue={player.height} type='text' name='height'
                                 onChange={formUtils.bindField}/>
                        </label>
                      </div>
                      <div>
                        <label>
                          出生日期
                          <input defaultValue={player.birthDate} type='text' name='birthDate'
                                 onChange={formUtils.bindField}/>
                        </label>
                      </div>
                      <div>
                        <label>
                          体重
                          <input defaultValue={player.weightLbs ? player.weightLbs.toString() : ''} type='number'
                                 name='weightLbs'
                                 onChange={formUtils.bindField}/>
                        </label>
                      </div>
                      <button type='submit'>提交</button>
                    </form>
                  </div>
                )
              }
            }
          </Mutation>
        </div>
      </div>
    )
  }

}
