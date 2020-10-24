import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from '../graphql/mutations'
import { listTodos } from '../graphql/queries'
import { deleteTodo } from '../graphql/mutations'

export interface GraphQLResult {
  data?: Record<string, any>
  error?: [object]
  extensions?: {
    [key: string]: any
  }
}

const Todo = () => {
  const [list, setList] = React.useState<GraphQLResult>()
  const [isEdit, setIsEdit] = React.useState<boolean[]>([])
  const [item, setItem] = React.useState<string>()

  const onCreateTodo = async () => {
    const data = { name: item }
    try {
      await API.graphql(graphqlOperation(createTodo, { input: data }))
    } catch (e) {
      console.error(e)
    }
    getListTodos()
  }

  const onDeleteTodo = async (id: number) => {
    const data = { id: id }
    try {
      await API.graphql(graphqlOperation(deleteTodo, { input: data }))
    } catch (e) {
      console.error(e)
    }
    getListTodos()
  }

  const onToggleEdit = (index: number) => {
    const newIsEdit = isEdit.slice()
    if (typeof newIsEdit[index] !== 'boolean') {
      newIsEdit[index] = false
    }
    newIsEdit[index] = !newIsEdit[index]
    setIsEdit(newIsEdit)
  }

  const getListTodos = async () => {
    try {
      const result = await API.graphql(graphqlOperation(listTodos))
      setList({ data: result })
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    getListTodos()
    // [list] is cause infinity loop
    // [] useEffect is called when mounted & unmounted
  }, [])

  const todoList = list ? list.data?.data.listTodos : []

  return (
    <div className="todo-container">
      <div className="input-section flex items-center w-full">
        <input
          className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
          onChange={(e) => setItem(e.target.value)}
          id="username"
          type="text"
          placeholder="Todo"
        />
        <button
          className="h-10 bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded shadow"
          onClick={() => onCreateTodo()}
        >
          Save
        </button>
      </div>
      {todoList.items && todoList.items.length > 0 ? (
        <div className="list-section my-4">
          <div style={{ listStyleType: 'none' }}>
            {todoList.items.map(
              (item: { name: string; id: number }, index: number) => (
                <div key={index} className="w-full py-2 flex">
                  {isEdit[index] != false ? (
                    <button
                      className="w-9/12 bg-gray-200 text-black py-2 px-4 rounded shadow"
                      onClick={() => onToggleEdit(index)}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <input
                      value={item.name}
                      placeholder="Todo"
                      className="w-9/12 text-black py-2 px-4 rounded shadow"
                      onClick={() => onToggleEdit(index)}
                    />
                  )}
                  <div className="empty w-1/12"></div>
                  <button
                    className="w-2/12 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-4 rounded shadow"
                    onClick={() => {
                      onDeleteTodo(item.id)
                    }}
                  >
                    <span>Delete</span>
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-600 m-4 text-bold text-xl">No Todos</div>
      )}
    </div>
  )
}

export default Todo
