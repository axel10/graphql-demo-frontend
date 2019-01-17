import * as React from 'react'
import { Mutation, MutationFunc } from 'react-apollo'
import { EDIT_PLAYER, GET_PLAYER } from 'src/querys/player'
import { NhlMutation, NhlQuery, PlayerInput, PlayerType } from 'src/types'
import { removeTypename } from 'src/utils/utils'
import { FormUtils } from '../../utils/formUtils'
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
    const player = removeTypename(formUtils.state[this.formName])
    editPlayer({ variables: { player } }).then(o => {
      console.log('edit done')
    }).catch(err => {
      console.log(err)
    })
    this.props.onCancel()
  }

  public handleUpdate = (cache, { data }: { data: NhlMutation }) => {
    const editedPlayer = data.editPlayer
    const { players } = cache.readQuery({ query: GET_PLAYER }) as NhlQuery
    Object.assign(players.find(o => o.id === editedPlayer.id), editedPlayer)
    cache.writeQuery({ query: GET_PLAYER, data: { players } })
  }

  public render () {
    const { player, onCancel } = this.props
    console.log(player)

    return (
      <div className={styles.wrap}>
        <div className='form-content'>
          <Mutation mutation={EDIT_PLAYER}
                    update={this.handleUpdate}
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
