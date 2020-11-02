import React, { FC } from 'react'
import awsExports from '../aws-exports'
import Amplify from '@aws-amplify/core'
import Router from 'next/router'

Amplify.configure(awsExports)

type NavProps = {
  onTransition?: () => void
}

const Nav: FC<NavProps> = ({ onTransition }) => {
  const onClickLink = (path: string) => {
    Router.push(path)
    onTransition()
  }
  return (
    <div className="nav-container absolute top-0 bottom-0 right-0 left-0 flex flex-col items-center bg-white">
      <div className="section-nav-links w-full max-w-screen-md p-4 mt-14">
        <div
          className="section-nav-link items-center justify-between text-black py-2 px-2 my-2 rounded shadow bg-gray-200"
          onClick={() => onClickLink('./')}
        >
          <span>Home</span>
        </div>
        <div
          className="section-nav-link items-center justify-between text-black py-2 px-2 my-2 rounded shadow bg-gray-200"
          onClick={() => onClickLink('./todo')}
        >
          <span>Todo</span>
        </div>
      </div>
    </div>
  )
}

export default Nav
