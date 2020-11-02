import React from 'react'
import Amplify from '@aws-amplify/core'
// import { Auth } from '@aws-amplify/auth'
import awsExports from '../aws-exports'
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'

Amplify.configure(awsExports)
// Auth.configure(awsExports)

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
      <div className="w-full text-right">
        <div className="w-12 mt-32 rounded">
          <AmplifySignOut />
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
