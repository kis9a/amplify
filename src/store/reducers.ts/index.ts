import { ADD_TODO, TodoActions } from '../types'

const todos = (state = [], action: TodoActions) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, 'new todo string']
    default:
      return state
  }
}

export default todos
