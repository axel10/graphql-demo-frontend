import cloneDeep from 'lodash/cloneDeep'
import React from 'react'
import Schema from 'async-validator'

/*const isNumber = Symbol('isNumber')
const required = Symbol('required')
export const Rules = {
  isNumber, required
}*/

interface IRules {
  isNumber?: boolean
  required?: boolean
}

interface IValidateItem {
  message: string
  validator: (val) => boolean
}

export const getDescriptor = (rules: IRules) => (rule, value, callback, source, options) => {
  const currentRules: IValidateItem[] = []
  const errors = []
  if (rules.required) {
    const requiredDescriptor: IValidateItem = {
      message: `${rule.field}不能为空`,
      validator (val) {
        return !!val
      }
    }
    currentRules.push(requiredDescriptor)
  }
  if (rules.isNumber) {
    const isNumberDescriptor: IValidateItem = {
      message: '值必须为数字',
      validator (val) {
        if (typeof val === 'number') return true
        return /^[0-9]+$/.test(val)
      }
    }
    currentRules.push(isNumberDescriptor)
  }

  currentRules.forEach(o => {
    if (!o.validator(value)) {
      errors.push(new Error(o.message))
    }
  })
  callback(errors)
}

export class FormUtils<IFormProps> {
  public initState: IFormProps
  public state: IFormProps
  public descriptor: any

  constructor ({ initState, descriptor = {} }: { descriptor?: any, initState: IFormProps }) {
    this.initState = cloneDeep(initState)
    this.state = cloneDeep(initState)
    this.descriptor = descriptor
  }

  public getForm = (key: string) => {
    return this.state[key]
  }

  public resetForm = (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement
    const formName = form.getAttribute('name')
    this.state[formName] = cloneDeep(this.initState[formName])
  }

  public bindField = (e) => {
    const target = e.target as HTMLInputElement
    const val = target.value
    const key = target.name
    const formName = target.form.getAttribute('name')
    this.state[formName][key] = val
  }

  public validate (form: HTMLFormElement) {
    const formName = form.getAttribute('name')
    const { descriptor } = this
    const val = descriptor[formName]
    if (!val) {
      throw new Error('no descriptor')
    }
    const validator = new Schema(val)
    return new Promise((resolve, reject) => {
      validator.validate(this.state[formName], (errors, fields) => {
        if (errors) {
          return reject({
            formName: {
              errors, fields
            }
          })
        }
        resolve()
      })
    })
  }
}
