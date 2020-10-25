import React, { useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { listTodos } from '../graphql/queries'
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations'
import { CreateTodoInput, UpdateTodoInput, DeleteTodoInput } from '../types/API'

export interface GraphQLResult {
  data?: Record<string, any>
  error?: [object]
  extensions?: {
    [key: string]: any
  }
}

const Todo = () => {
  const [list, setList] = useState<GraphQLResult>()
  const [isEdit, setIsEdit] = useState<boolean[]>([])
  const [newTodoInput, setNewTodoInput] = useState<string>()

  const onCreateTodo = async () => {
    const data: CreateTodoInput = { name: newTodoInput }
    try {
      await API.graphql(graphqlOperation(createTodo, { input: data }))
    } catch (e) {
      console.error(e)
    }
    getListTodos()
  }

  const onUpdateTodo = async (id: number, name: string) => {
    const data: UpdateTodoInput = { id: `${id}`, name: name }
    try {
      await API.graphql(graphqlOperation(updateTodo, { input: data }))
    } catch (e) {
      console.error(e)
    }
    await getListTodos()
    onSetIsEdit(id, false)
  }

  const onDeleteTodo = async (id: number) => {
    const data: DeleteTodoInput = { id: `${id}` }
    try {
      await API.graphql(graphqlOperation(deleteTodo, { input: data }))
    } catch (e) {
      console.error(e)
    }
    getListTodos()
  }

  const onSetIsEdit = (index: number, is?: boolean) => {
    if (typeof isEdit[index] !== 'boolean') {
      isEdit[index] = false
    }
    if (typeof is === 'boolean') {
      isEdit[index] = is
    } else {
      isEdit[index] = !isEdit[index]
    }
    setIsEdit([...isEdit])
  }

  const onEditTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (list && list.data.data.listTodos.items) {
      list.data.data.listTodos.items.map((item) => {
        if (item && item.id === id) {
          item.name = event.currentTarget.value
        }
      })
      setList({ ...list })
    }
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
    // j
  }, [])

  if (list) {
    const todoList = list ? list.data?.data.listTodos : []
    return (
      <div className="todo-container">
        <div className="input-section flex items-center w-full">
          <input
            className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
            onChange={(e) => setNewTodoInput(e.target.value)}
            id="username"
            type="text"
            placeholder="Todo"
          />
          <button
            className="h-10 bg-yellow-500 hover:bg-yellow-400 text-gray-700 py-2 px-4 rounded shadow"
            onClick={() => onCreateTodo()}
          >
            Save
          </button>
        </div>
        {todoList && todoList.items && todoList.items.length > 0 ? (
          <div className="list-section my-4">
            <div style={{ listStyleType: 'none' }}>
              {todoList.items.map(
                (item: { name: string; id: number }, index: number) =>
                  item && (
                    <div key={index} className="w-full py-2 flex">
                      {isEdit[index] != true ? (
                        <>
                          <div className="w-9/12 mr-2 bg-gray-200 text-black py-2 px-4 rounded shadow">
                            {item.name}
                          </div>
                          <button
                            className="w-1/12 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-2 rounded shadow mr-2 text-center"
                            onClick={() => onSetIsEdit(index)}
                          >
                            <svg
                              className="text-gray-500 fill-current w-4 h-4 m-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <input
                            value={item.name}
                            onChange={(e) => onEditTodo(e, item.id)}
                            onBlur={() => onSetIsEdit(item.id, false)}
                            placeholder="Todo"
                            className="w-9/12 mr-2 text-black py-2 px-4 rounded shadow"
                          />
                          <button
                            className="w-1/12 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-2 rounded shadow mr-2"
                            onClick={() => {
                              onUpdateTodo(item.id, item.name)
                            }}
                          >
                            <svg
                              className="text-gray-500 fill-current w-4 h-4 m-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                      <button
                        className="w-1/12 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-2 rounded shadow"
                        onClick={() => {
                          onDeleteTodo(item.id)
                        }}
                      >
                        <svg
                          className="text-gray-500 fill-current w-4 h-4 m-auto"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
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
  } else {
    return null
  }
}

export default Todo
