import React from 'react'
import awsExports from '../aws-exports'
import Amplify from '@aws-amplify/core'

Amplify.configure(awsExports)

const Nav = () => {
  return <div>Hello</div>
}

export default Nav
