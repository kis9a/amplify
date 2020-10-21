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

const ListItem = () => {
  const [list, setList] = React.useState<GraphQLResult>()

  const onDeleteTodo = async (id: number) => {
    const data = { id: id }
    try {
      await API.graphql(graphqlOperation(deleteTodo, { input: data }))
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const result = await API.graphql(graphqlOperation(listTodos))
        setList({ data: result })
      } catch (e) {
        console.error(e)
      }
    }
    fetch()
  }, [list])

  if (list) {
    const todoList = list.data?.data.listTodos
    return todoList.items ? (
      <div className="my-4">
        <div style={{ listStyleType: 'none' }}>
          {todoList.items.map(
            (item: { name: string; id: number }, index: number) => (
              <div key={index} className="w-full py-2">
                <button className="w-5/6 bg-gray-200 hover:bg-gray-100 text-black py-2 px-4 rounded shadow">
                  {item.name}
                </button>
                <button
                  className="w-1/6 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-4 rounded shadow"
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
      <div>not exit on todoList</div>
    )
  } else {
    return <div></div>
  }
}

const AddItem = () => {
  const [item, setItem] = React.useState<string>()

  const save = async () => {
    const data = { name: item }
    try {
      await API.graphql(graphqlOperation(createTodo, { input: data }))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="input-section">
      <div className="flex items-center w-full">
        <input
          className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
          onChange={(e) => setItem(e.target.value)}
          id="username"
          type="text"
          placeholder="Todo"
        />
        <button
          className="h-10 bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-4 rounded shadow"
          onClick={() => save()}
        >
          Save
        </button>
      </div>
    </div>
  )
}

const Todo = () => {
  return (
    <div className="max-w-3xl">
      <AddItem />
      <ListItem />
    </div>
  )
}
export default Todo
