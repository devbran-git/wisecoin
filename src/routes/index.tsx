import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { useAuth } from '../hooks/auth'

import AuthRoutes from './auth.routes'
import App from './app.routes'

const Routes: React.FC = () => {

  const { logged } = useAuth()

  return (
    <BrowserRouter>
      {logged ? <App /> : <AuthRoutes />}
    </BrowserRouter>
  )
}


export default Routes
