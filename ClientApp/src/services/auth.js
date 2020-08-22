import axios from "axios"

export const isBrowser = () => typeof window !== "undefined"

const host = "https://localhost:5001/"

const saveUserToStorage = user => {
  window.localStorage.setItem("AppUser", JSON.stringify(user))
}

const loadUserFromStorage = () => {
  return isBrowser() && window.localStorage.getItem("AppUser")
    ? JSON.parse(window.localStorage.getItem("AppUser"))
    : null
}

const removeUserFromStorage = () => {
  window.localStorage.removeItem("AppUser")
}

export default class UserAuth {
  constructor(userName, role, accessToken, refreshToken, expireAt) {
    this.profile = { userName, role }
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.expireAt = expireAt
    this.axiosConfig = {
      headers: {
        Authorization: "Bearer " + this.accessToken,
      },
    }
  }
  toDataObj = () => {
    return {
      profile: this.profile,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expireAt: this.expireAt,
    }
  }
  getProfile = () => {
    return axios
      .get(host + "user/profile", this.axiosConfig)
      .then(({ data }) => {
        return data
      })
      .catch(err => {
        throw err
      })
  }
  refresh = () => {
    return axios
      .post(
        host + "user/refresh",
        { refreshToken: this.refreshToken },
        this.axiosConfig
      )
      .then(({ data }) => {
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken
        const jwtToken = JSON.parse(atob(data.accessToken.split(".")[1]))
        this.expireAt = new Date(jwtToken.exp * 1000).getTime()
        saveUserToStorage(this.toDataObj())
      })
      .catch(err => {
        throw err
      })
  }
  logout = () => {
    axios.post(host + "user/logout", null, this.axiosConfig)
    removeUserFromStorage()
  }
}

export const handleRegister = async (username, password) => {
  const postData = {
    username: username,
    password: password,
  }
  return await axios
    .post(host + "user/register", postData)
    .then(({ data }) => {
      const jwtToken = JSON.parse(atob(data.accessToken.split(".")[1]))
      const user = new UserAuth(
        data.username,
        data.role,
        data.accessToken,
        data.refreshToken,
        new Date(jwtToken.exp * 1000).getTime()
      )
      saveUserToStorage(user.toDataObj())
      return user
    })
    .catch(err => {
      throw err
    })
}

export const handleLogin = async (username, password) => {
  const postData = {
    username: username,
    password: password,
  }
  return await axios
    .post(host + "user/login", postData)
    .then(({ data }) => {
      const jwtToken = JSON.parse(atob(data.accessToken.split(".")[1]))
      const user = new UserAuth(
        data.username,
        data.role,
        data.accessToken,
        data.refreshToken,
        new Date(jwtToken.exp * 1000).getTime()
      )
      saveUserToStorage(user.toDataObj())
      return user
    })
    .catch(err => {
      return null
    })
}

export const handleLoad = () => {
  const userData = loadUserFromStorage()

  if (userData === null) return null
  if (userData.expireAt < Date.now()) return null
  const userAuth = new UserAuth(
    userData.profile.userName,
    userData.profile.role,
    userData.accessToken,
    userData.refreshToken,
    userData.expireAt
  )
  return userAuth
}

export const handleUnAuthorized = () => {
  removeUserFromStorage()
}
