import Amplify from '@aws-amplify/core'
import awsExports from '../aws-exports'
import type { AppProps /*, AppContext */ } from 'next/app'
import React, { useState } from 'react'
import Nav from '../components/nav'
import Header from '../components/header'
import Head from 'next/head'
import '../styles/globals.css'

Amplify.configure(awsExports)

function App({ Component, pageProps }: AppProps) {
  const [isOpenThem, setIsOpenThem] = useState(false)

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Header
          isOpenTham={isOpenThem}
          onClickTham={() => setIsOpenThem(!isOpenThem)}
        />
      </header>
      <div className="mt-20">
        {isOpenThem && <Nav onTransition={() => setIsOpenThem(false)} />}
        {
          <div className="m-4">
            <Component {...pageProps} />
          </div>
        }
      </div>
    </div>
  )
}

export default App
