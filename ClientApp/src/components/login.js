import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../context/context"
import { handleLogin } from "../services/auth"
import { Grid, Button, TextField } from "@material-ui/core"

export default function Login() {
  const { loginSuccess } = useContext(UserContext)
  const [isLoggingIn, setIsLoggingIn] = useState(0)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  useEffect(() => {
    if (isLoggingIn > 0) {
      const login = async () => {
        const userAuth = await handleLogin(username, password)
        if (userAuth !== null) loginSuccess(userAuth)
      }
      login()
    }
  }, [isLoggingIn])
  const submitLogin = e => {
    e.preventDefault()
    if (username.length > 0 && password.length > 0) {
      setIsLoggingIn(i => ++i)
    }
  }
  return (
    <Grid item xs={12}>
      <form autoComplete="off" onSubmit={e => submitLogin(e)}>
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
              onChange={e => setUsername(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
          <Grid container justify="flex-end">
            <Button
              variant="contained"
              size="large"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  )
}
