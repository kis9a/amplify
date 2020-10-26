import React, { useState } from 'react'
import awsExports from '../aws-exports'
import Amplify from 'aws-amplify'
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
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
  description?: string
  isEditItemName?: boolean
  // isEditDescription?: boolean
  isOpenItemDetail?: boolean
}

const Todo = () => {
  // state{{{
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [addedTodoId, setAddedTodoId] = useState<number>(0)
  const [todoItems, setTodoItems] = useState<TodoItem[]>([])
  const [newTodoNameInput, setNewTodoNameInput] = useState<string>('')
  const [
    newTodoDescriptionInput,
    setNewTodoDescriptionInput,
  ] = useState<string>('')
  const [isOpenDescriptionInput, setIsOpenDescriptionInput] = useState<boolean>(
    true
  )
  //}}}

  // functions {{{
  const onCreateTodo = async () => {
    const data: CreateTodoInput = {
      name: newTodoNameInput,
      description: newTodoDescriptionInput,
    }
    if (newTodoNameInput && newTodoNameInput.trim().length > 0) {
      try {
        await API.graphql(graphqlOperation(createTodo, { input: data }))
      } catch (e) {
        console.error(e)
      } finally {
        setNewTodoNameInput('')

        // await getTodoItems()
        // when onCreateTodo push new todo but no fetch new todolist \
        // and set mockId without duplicate for reduce api request

        const newTodoItems = [
          ...todoItems,
          {
            id: `${addedTodoId}`,
            name: newTodoNameInput,
            description: newTodoDescriptionInput,
          },
        ]
        setTodoItems(newTodoItems)

        const setNextAddedTodoId = addedTodoId + 1
        setAddedTodoId(setNextAddedTodoId)
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
          item.isEditItemName = is
        } else {
          item.isEditItemName = !item.isEditItemName
        }
      }
      return item
    })
    setTodoItems(newTodoItems)
  }

  // const onSetIsOpenItemDetail = (id: string, is?: boolean) => {
  //   const newTodoItems = todoItems.map((item) => {
  //   if (typeof is === 'boolean') {
  //   }
  //   })
  // }

  const onSetIsOpenItemDetail = (id: string, is?: boolean) => {
    const newTodoItems = todoItems.map((item) => {
      if (item.id === id) {
        if (typeof is === 'boolean') {
          item.isOpenItemDetail = is
        } else {
          item.isOpenItemDetail = !item.isOpenItemDetail
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
      setIsLoading(true)
      const todoItems: TodoItem[] = []
      const result = (await API.graphql(
        graphqlOperation(listTodos)
      )) as GraphQLResult<ListTodosQuery>
      // GraphQLResult and Observable<object> incorrect types for API.graphql
      // https://github.com/aws-amplify/amplify-js/issues/4257
      result.data.listTodos.items.forEach((item) =>
        todoItems.push({ ...item, isEditItemName: false })
      )
      setTodoItems(todoItems)
    } catch (e) {
      console.error(e)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  React.useEffect(() => {
    getTodoItems()
    // [list] is cause infinity loop
    // [] useEffect is called when mounted & unmounted
    // j
  }, [])
  //}}}

  return (
    <div className="todo-container max-w-screen-md mx-auto">
      {
        //{{{ section-input
        <div className="section-input">
          <div className="section-input-form flex items-center">
            <input
              autoFocus
              className="input-new-todo-name shadow appearance-none border rounded w-full py-2 pl-3 pr-12 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              value={newTodoNameInput || ''}
              onChange={(e) => setNewTodoNameInput(e.target.value)}
              id="username"
              type="text"
              placeholder="Todo*"
              maxLength={50}
            />
            {
              // TODO: input string length counter
              // <span className="text-sm text-gray-300 relative bottom-0 right-12">
              //   {newTodoNameInput ? (
              //     <span>{newTodoNameInput.length}/50</span>
              //   ) : (
              //     <span>0/50</span>
              //   )}
              // </span>
            }
          </div>
          <div className="section-input-buttons my-2 flex justify-end">
            <div className="section-input-buttons-detail">
              <div
                onClick={() =>
                  setIsOpenDescriptionInput(!isOpenDescriptionInput)
                }
                className="button-detail flex flex-1 justify-center min-h-4 min-w-12 bg-gray-200 text-black py-1 px-4  rounded shadow mr-2"
              >
                {isOpenDescriptionInput !== true ? (
                  <svg
                    className="icon-down text-gray-500 w-4 h-4 m-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="icon-up text-gray-500 w-4 h-4 m-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div
              className="section-input-buttons-create flex flex-1 justify-center bg-yellow-400 text-black py-1 px-2  rounded shadow"
              onClick={() => onCreateTodo()}
            >
              <svg
                className="icon-create text-gray-500 w-4 h-4 m-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            </div>
          </div>
          {isOpenDescriptionInput && (
            <div className="section-input-detail-form">
              <textarea
                className="textarea-description shadow appearance-none border rounded w-full py-2 pl-3 pr-12 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                value={newTodoDescriptionInput || ''}
                onChange={(e) => setNewTodoDescriptionInput(e.target.value)}
                rows={4}
                id="username"
                placeholder="Description?"
                maxLength={500}
              />
            </div>
          )}
        </div>
        //}}}
      }
      {
        //{{{ section-todos
        isLoading ? (
          <div className="section-loading animate-spin m-4">
            <svg
              className="icon-down text-gray-500 w-12 h-12 m-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        ) : (
          <div className="section-todoitems my-4">
            {todoItems && todoItems.length > 0 ? (
              <div className="section-todoitems-container my-4">
                {todoItems.map(
                  (item: TodoItem, index: number) =>
                    item && (
                      <div className="section-todoitem" key={index}>
                        <div className="section-todoitem-header w-full py-2 flex">
                          {item.isEditItemName != true ? (
                            <>
                              <div
                                onClick={() => onSetIsOpenItemDetail(item.id)}
                                className="flex-1 flex items-center justify-between mr-4 bg-gray-200 text-black py-2 px-2  rounded shadow"
                              >
                                <p className="section-todoitem-header-name">
                                  {item.name}
                                </p>
                                <div className="section-todoitem-header-button-toggler">
                                  {item.isOpenItemDetail !== true ? (
                                    <svg
                                      className="icon-down text-gray-500 w-4 h-4 m-auto"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="icon-up text-gray-500 w-4 h-4 m-auto"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 15l7-7 7 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="section-todoitem-header-button-edit">
                                <button
                                  className="button-edit button-edit w-8 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-2 rounded shadow mr-2 text-center"
                                  onClick={() => onSetIsEdit(item.id)}
                                >
                                  <svg
                                    className="icon-edit text-gray-500 w-4 h-4 m-auto"
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
                              </div>
                            </>
                          ) : (
                            <div className="section-todoitem-header-button-edited">
                              <input
                                value={item.name}
                                onChange={(e) => onEditTodo(e, item.id)}
                                placeholder="Edit Todo"
                                className="input-update mr-4 text-black py-2 px-4 rounded shadow pl-3 pr-12"
                                maxLength={50}
                              />
                              <button
                                className="button-update w-8 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-2 rounded shadow mr-2"
                                onClick={() => {
                                  onUpdateTodo(item.id, item.name)
                                }}
                              >
                                <svg
                                  className="icon-check text-gray-500 w-4 h-4 m-auto"
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
                            </div>
                          )}
                          <div className="section-todoitem-header-button-delete">
                            <button
                              className="button-delete w-8 h-10 bg-gray-300 hover:bg-gray-300 text-black py-2 px-2 rounded shadow"
                              onClick={() => {
                                onDeleteTodo(item.id)
                              }}
                            >
                              <svg
                                className="icon-delete text-gray-500  w-4 h-4 m-auto"
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
                        </div>
                        <div className="section-todoitem-detail">
                          <div className="section-todoitem-detail-description">
                            {item.isOpenItemDetail && (
                              <div>
                                <p>{item.description || ''}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className="section-no-todoitems-container text-gray-600 m-4 text-bold text-xl">
                No Todo Items
              </div>
            )}
          </div>
        )
        //}}}
      }
    </div>
  )
}

Amplify.configure(awsExports)

function Index() {
  const [authState, setAuthState] = React.useState(null)
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState)
      setUser(authData)
    })
  }, [])

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <div className="Layout m-4">
        <Todo />
        <div className="w-full text-right">
          <div className="w-12 mt-32 rounded">
            <AmplifySignOut />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="container">
      <div className="signIn">
        <AmplifyAuthenticator />
      </div>
    </div>
  )
}

export default Index
