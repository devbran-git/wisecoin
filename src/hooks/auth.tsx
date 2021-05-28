import React, { createContext, useState, useContext } from 'react'

interface IAuthContext {
  logged: boolean
  signIn(email: string, password: string): void
  signOut(): void
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

const AuthProvider: React.FC = ({ children }) => {
  const [logged, setLogged] = useState<boolean>(() => {
    const isLogged = localStorage.getItem('@wisecoin:logged')

    return !!isLogged
  })

  const signIn = (email: string, password: string) => {
    if (email === 'li@li.com' && password === '123') {
      localStorage.setItem('@wisecoin:logged', 'true')
      setLogged(true)
    } else {
      alert('Senha e/ou usuário inválidos!')
    }
  }

  const signOut = () => {
    localStorage.removeItem('@wisecoin:logged')
    setLogged(false)
  }

  return (
    <AuthContext.Provider value={{ logged, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }