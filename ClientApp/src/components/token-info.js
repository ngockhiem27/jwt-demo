import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/context"
import { Button, TextField, makeStyles, Grid } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  element: {
    paddingTop: "10px",
  },
}))

export default function TokenInfo({ refresh }) {
  const classes = useStyles()
  const [duration, setDuration] = useState(0)
  const {
    state: { userAuth },
  } = useContext(UserContext)
  useEffect(() => {
    setDuration(parseInt((userAuth.expireAt - Date.now()) / 1000))
    const id = setInterval(() => setDuration(d => d - 1), 1000)
    return () => {
      clearInterval(id)
    }
  }, [userAuth.accessToken])
  return (
    <Grid container>
      <Grid item xs={12} className={classes.element}>
        <TextField
          label="Access Token"
          multiline
          rows={2}
          rowsMax={10}
          disabled={true}
          value={userAuth.accessToken}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} className={classes.element}>
        <TextField
          label="Refresh Token"
          multiline
          rows={1}
          rowsMax={4}
          disabled={true}
          value={userAuth.refreshToken}
          fullWidth
        />
      </Grid>
      <Grid container className={classes.element}>
        <Grid item xs={6}>
          <Grid container justify="flex-start">
            <Button disabled>
              {duration > 0 ? (
                <div>Token Duration: {duration}s</div>
              ) : (
                <div>Token expired</div>
              )}
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end">
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => refresh()}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
