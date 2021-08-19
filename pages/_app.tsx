import { Fragment, useEffect } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../components/theme'
import { DataContextProvider } from "../components/DataContext"
import "../components/styles.css"

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
    if (typeof window !== "undefined" && localStorage.getItem("useIPFS") === null) {
      localStorage.setItem('useIPFS', 'false')
    }
  }, [])
  return (
    <Fragment>
      <Head>
        <title>Scenery</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DataContextProvider>
          <Component {...pageProps} />
        </DataContextProvider>
      </ThemeProvider>
    </Fragment>
  )
}