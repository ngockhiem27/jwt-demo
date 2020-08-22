import React, { useEffect, useState, useContext } from "react"
import { UserContext } from "../context/context"
import { handleRegister, isBrowser } from "../services/auth"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import { Grid, Button, TextField } from "@material-ui/core"

export default function Register() {
  const {
    state: { isAuthenticated },
    loginSuccess,
  } = useContext(UserContext)
  const [registerValue, setRegisterValue] = useState(null)
  useEffect(() => {
    if (!isAuthenticated && registerValue !== null) {
      const registerUser = async () => {
        const userAuth = await handleRegister(
          registerValue.username,
          registerValue.password
        )
        if (userAuth !== null) {
          loginSuccess(userAuth)
        }
      }
      registerUser()
    }
  }, [registerValue])

  const submitRegister = e => {
    e.preventDefault()
    const username = e.target.username.value
    const password = e.target.password.value
    setRegisterValue({ username, password })
  }

  if (isAuthenticated) {
    if (isBrowser()) navigate("/")
    return null
  }

  return (
    <Layout>
      <Grid item xs={12} md={6}>
        <form autoComplete="off" onSubmit={e => submitRegister(e)}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <TextField
                type="text"
                name="username"
                label="User name"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                name="password"
                label="Password"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid container justify="flex-end">
              <Button
                variant="contained"
                size="large"
                color="inherit"
                type="submit"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Layout>
  )
}
