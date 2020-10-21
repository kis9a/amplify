interface AddTodo {
  type: typeof ADD_TODO
  payload: string
}

interface RemoveTodo {
  type: typeof REMOVE_TODO
  payload: string
}

interface UpdateTodo {
  type: typeof UPDATE_TODO
  payload: string
}

export type TodoActions = AddTodo | RemoveTodo | UpdateTodo

export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
