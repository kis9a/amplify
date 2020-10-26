import React, { useState } from 'react'
import { GraphQLResult } from '@aws-amplify/api'
import { API, graphqlOperation } from 'aws-amplify'
import { listTodos } from '../graphql/queries'
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations'
import {
  CreateTodoInput,
  UpdateTodoInput,
  DeleteTodoInput,
  ListTodosQuery,
} from '../types/API'

interface TodoItem {
  id: string
  name: string
  isEdit: boolean
}

const Todo = () => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([])
  const [newTodoInput, setNewTodoInput] = useState<string>()

  const onCreateTodo = async () => {
    const data: CreateTodoInput = { name: newTodoInput }
    if (newTodoInput && newTodoInput.trim().length > 0) {
      try {
        await API.graphql(graphqlOperation(createTodo, { input: data }))
      } catch (e) {
        console.error(e)
      } finally {
        setNewTodoInput('')
        await getTodoItems()
      }
    }
  }

  const onUpdateTodo = async (id: string, name: string) => {
    const data: UpdateTodoInput = { id: id, name: name }
    if (name && name.trim().length > 0) {
      try {
        await API.graphql(graphqlOperation(updateTodo, { input: data }))
      } catch (e) {
        console.error(e)
      } finally {
        onSetIsEdit(id, false)
      }
    }
  }

  const onDeleteTodo = async (id: string) => {
    const data: DeleteTodoInput = { id: id }
    try {
      await API.graphql(graphqlOperation(deleteTodo, { input: data }))
    } catch (e) {
      console.error(e)
    } finally {
      const newTodoItems = todoItems.filter((item) => item.id !== id)
      setTodoItems(newTodoItems)
    }
  }

  const onSetIsEdit = (id: string, is?: boolean) => {
    const newTodoItems = todoItems.map((item) => {
      if (item.id === id) {
        if (typeof is === 'boolean') {
          item.isEdit = is
        } else {
          item.isEdit = !item.isEdit
        }
      }
      return item
    })
    setTodoItems(newTodoItems)
  }

  const onEditTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const newTodoItems = todoItems.map((item) => {
      if (item && item.id === id) {
        item.name = event.currentTarget.value
      }
      return item
    })
    setTodoItems(newTodoItems)
  }

  const getTodoItems = async () => {
    try {
      const todoItems: TodoItem[] = []
      const result = (await API.graphql(
        graphqlOperation(listTodos)
      )) as GraphQLResult<ListTodosQuery>
      // GraphQLResult and Observable<object> incorrect types for API.graphql
      // https://github.com/aws-amplify/amplify-js/issues/4257
      result.data.listTodos.items.forEach((item) =>
        todoItems.push({ ...item, isEdit: false })
      )
      setTodoItems(todoItems)
    } catch (e) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    getTodoItems()
    // [list] is cause infinity loop
    // [] useEffect is called when mounted & unmounted
    // j
  }, [])

  return (
    <div className="todo-container">
      <div className="input-section flex items-center w-11/12">
        <input
          autoFocus
          className="shadow appearance-none border rounded w-4/5 py-2 pl-3 pr-12 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
          value={newTodoInput || ''}
          onChange={(e) => setNewTodoInput(e.target.value)}
          id="username"
          type="text"
          placeholder="Todo*"
          maxLength={50}
        />
        <span className="text-sm text-gray-300 relative bottom-0 right-12">
          {newTodoInput ? (
            <span>{newTodoInput.length}/50</span>
          ) : (
            <span>0/50</span>
          )}
        </span>
        <button
          className="w-1/12 h-10 bg-yellow-500 text-gray-700 py-2 px-2 rounded shadow mr-2 text-center"
          onClick={() => onCreateTodo()}
        >
          <svg
            className="text-gray-700 fill-current w-4 h-4 m-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
      {todoItems && todoItems.length > 0 ? (
        <div className="list-section my-4">
          <div style={{ listStyleType: 'none' }}>
            {todoItems.map(
              (item: TodoItem, index: number) =>
                item && (
                  <div key={index} className="w-full py-2 flex">
                    {item.isEdit != true ? (
                      <>
                        <div className="w-9/12 mr-4 bg-gray-200 text-black py-2 px-4 rounded shadow">
                          {item.name}
                        </div>
                        <button
                          className="w-1/12 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-2 rounded shadow mr-2 text-center"
                          onClick={() => onSetIsEdit(item.id)}
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
                          placeholder="Edit Todo"
                          className="w-9/12 mr-4 text-black py-2 px-4 rounded shadow pl-3 pr-12"
                          maxLength={50}
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
}

export default Todo
