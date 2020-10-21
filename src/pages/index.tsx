import React from 'react'
import awsExports from '../aws-exports'
import Amplify from 'aws-amplify'
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import Todo from '../components/Todo'
import store from '../store'
import { Provider } from 'react-redux'

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
    <Provider store={store}>
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
    </Provider>
  ) : (
    <div className="container">
      <div className="signIn">
        <AmplifyAuthenticator />
      </div>
    </div>
  )
}

export default Index
