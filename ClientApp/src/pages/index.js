import React, { useContext } from "react"
import Login from "../components/login"
import Layout from "../components/layout"
import { UserContext } from "../context/context"
import { handleUnAuthorized } from "../services/auth"
import TokenInfo from "../components/token-info"
import { Grid } from "@material-ui/core"

export default function Index() {
  const { state, unAuthorized } = useContext(UserContext)
  const refreshToken = () => {
    state.userAuth.refresh().catch(err => {
      handleUnAuthorized()
      unAuthorized()
    })
  }
  return (
    <Layout>
      {!state.isAuthenticated ? (
        <Grid item xs={12} md={6}>
          <Login />
        </Grid>
      ) : (
        <TokenInfo refresh={() => refreshToken()} />
      )}
    </Layout>
  )
}
