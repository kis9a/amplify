import awsconfig from '../aws-exports'
import Amplify from 'aws-amplify'
// import { AuthState } from '@aws-amplify/ui-components'
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

Amplify.configure(awsconfig)

export const Home = (): JSX.Element => (
  <AmplifyAuthenticator>
    <div>
      <AmplifySignOut />
    </div>
  </AmplifyAuthenticator>
)

export default Home
