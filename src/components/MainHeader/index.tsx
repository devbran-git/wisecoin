import React, { useState } from 'react'
import Toggle from '../Toggle'

import { useTheme } from '../../hooks/theme'

import {
  Container,
  Profile,
  Welcome,
  UserName
} from './styles'


const MainHeader: React.FC = () => {

  const { toggleTheme, theme } = useTheme()

  const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false)

  const handleChangeTheme = () => {
    setDarkTheme(!darkTheme)
    toggleTheme()
  }

  return (
    <Container>
      <Toggle
        labelLeft='Light'
        labelRight='Dark'
        checked={darkTheme}
        onChange={handleChangeTheme}
      />

      <Profile>
        <Welcome>Olá,</Welcome>
        <UserName>Evandro</UserName>
      </Profile>
    </Container>
  )
}


export default MainHeader