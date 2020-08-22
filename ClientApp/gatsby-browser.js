import React from "react"

import AuthProvider from "./src/context/context"

export const wrapRootElement = ({ element }) => (
  <AuthProvider>{element}</AuthProvider>
)
