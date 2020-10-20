import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
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
      <div>
        <ul style={{ listStyleType: 'none' }}>
          {todoList.items.map(
            (item: { name: string; id: number }, index: number) => (
              <div key={index}>
                <li>{item.name}</li>
                <button
                  onClick={() => {
                    onDeleteTodo(item.id)
                  }}
                >
                  delete
                </button>
              </div>
            )
          )}
        </ul>
      </div>
    ) : (
      <div>not exit on todoList</div>
    )
  } else {
    return <div></div>
  }
}

export default ListItem
