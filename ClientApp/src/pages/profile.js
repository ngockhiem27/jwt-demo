import React, { useContext, useEffect, useState } from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import { UserContext } from "../context/context"
import { handleUnAuthorized, isBrowser } from "../services/auth"
import { TextField, Grid } from "@material-ui/core"

export default function Profile() {
  const { state, unAuthorized } = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    if (state.isAuthenticated) {
      const getProfile = async () => {
        state.userAuth
          .getProfile()
          .then(data => {
            setProfile(data)
          })
          .catch(err => {
            handleUnAuthorized()
            unAuthorized()
          })
      }
      getProfile()
    }
  }, [])
  if (!state.isAuthenticated) {
    if (isBrowser()) navigate("/")
    return null
  }

  return (
    <Layout>
      {state.isAuthenticated && (
        <Grid item xs={12}>
          {profile === null ? (
            <div>LOADING</div>
          ) : (
            <TextField
              label="user profile retrived from authorized route /user/profile"
              disabled
              fullWidth
              multiline
              rowsMax={15}
              value={JSON.stringify(profile, null, 2)}
            />
          )}
        </Grid>
      )}
    </Layout>
  )
}
