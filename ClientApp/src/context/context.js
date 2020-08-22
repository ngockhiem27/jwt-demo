import React, { createContext, useReducer, useEffect } from "react"
import { handleLoad } from "../services/auth"

const LOAD_USER = "LOAD_USER"
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const LOGOUT = "LOGOUT"
const UN_AUTHORIZED = "UN_AUTHORIZED"

const initialState = {
  isAuthenticated: false,
  userAuth: null,
}

export const UserContext = createContext(initialState)

const reducer = (state, action) => {
  if (action.type === LOAD_USER) {
    return { isAuthenticated: true, userAuth: action.payload.data.userAuth }
  }
  if (action.type === LOGIN_SUCCESS) {
    if (action.payload.data.userAuth !== null) {
      return { isAuthenticated: true, userAuth: action.payload.data.userAuth }
    }
    return state
  }
  if (action.type === LOGOUT) {
    return initialState
  }
  if (action.type === UN_AUTHORIZED) {
    return initialState
  }
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const userAuth = handleLoad()
    if (userAuth !== null) loadUser(userAuth)
  }, [])

  const loadUser = userAuth => {
    dispatch({
      type: LOAD_USER,
      payload: {
        data: {
          userAuth: userAuth,
        },
      },
    })
  }

  const loginSuccess = userAuth => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        data: { userAuth },
      },
    })
  }

  const logout = () => {
    dispatch({
      type: LOGOUT,
    })
  }

  const unAuthorized = () => {
    dispatch({
      type: UN_AUTHORIZED,
    })
  }

  const value = { state, loadUser, loginSuccess, logout, unAuthorized }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default AuthProvider
