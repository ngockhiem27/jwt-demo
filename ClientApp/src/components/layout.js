import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link, useStaticQuery, graphql } from "gatsby"
import { UserContext } from "../context/context"
import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  link: {
    marginRight: theme.spacing(2),
    textDecoration: "none",
    color: "black",
  },
  childContainer: {
    padding: "20px",
  },
}))

const Layout = ({ children }) => {
  const classes = useStyles()
  const {
    state: { userAuth, isAuthenticated },
    logout,
  } = useContext(UserContext)

  const handleLogout = () => {
    userAuth.logout()
    logout()
  }

  return (
    <Grid container justify="center">
      <Grid item sm={12} md={6}>
        <Grid container>
          <AppBar position="static">
            <Toolbar>
              <Button>
                <Typography variant="h6">
                  <Link to="/" className={classes.link}>
                    Index
                  </Link>
                </Typography>
              </Button>
              {isAuthenticated && (
                <Button>
                  <Typography variant="h6">
                    <Link to="/profile" className={classes.link}>
                      Profile
                    </Link>
                  </Typography>
                </Button>
              )}
              {!isAuthenticated && (
                <Button>
                  <Typography variant="h6">
                    <Link to="/register" className={classes.link}>
                      Register
                    </Link>
                  </Typography>
                </Button>
              )}
              {isAuthenticated && (
                <Button onClick={e => handleLogout()}>
                  <Typography variant="h6">Logout</Typography>
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid container justify="center" className={classes.childContainer}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
