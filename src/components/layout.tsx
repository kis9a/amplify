import React, { ReactNode } from 'react'
import Header from './header'
import Head from 'next/head'

type LayoutProps = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Amplify todo app' }: LayoutProps) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <Header />
    </header>
    <div className="mt-16">{children}</div>
  </div>
)

export default Layout
