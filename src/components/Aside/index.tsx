import React, { useState } from 'react'
import {
  MdDashboard,
  MdArrowDownward,
  MdArrowUpward,
  MdExitToApp,
  MdClose,
  MdMenu
} from 'react-icons/md'

import logoImg from '../../assets/logo.svg'
import Toggle from '../Toggle'

import { useAuth } from '../../hooks/auth'
import { useTheme } from '../../hooks/theme'

import {
  Container,
  Header,
  LogoImg,
  MenuContainer,
  MenuItemLink,
  Title,
  MenuItemButton,
  ToggleMenu,
  ThemeToggleFooter
} from './styles'

const Aside: React.FC = () => {

  const { signOut } = useAuth()
  const { toggleTheme, theme } = useTheme()

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false)


  const handleToggleMenu = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  const handleChangeTheme = () => {
    setDarkTheme(!darkTheme)
    toggleTheme()
  }

  return (

    <Container menuIsOpen={menuIsOpen}>
      <Header>
        <ToggleMenu onClick={handleToggleMenu}>
          {menuIsOpen ? <MdClose /> : <MdMenu />}
        </ToggleMenu>

        <LogoImg src={logoImg} alt='Logo Wisecoin' />
        <Title>Wisecoin</Title>
      </Header>

      <MenuContainer>

        <MenuItemLink href='/'>
          <MdDashboard />
          Dashboard
        </MenuItemLink>

        <MenuItemLink href='/lists/entry-balance'>
          <MdArrowUpward />
          Entradas
        </MenuItemLink>

        <MenuItemLink href='/lists/exit-balance'>
          <MdArrowDownward />
          Saídas
        </MenuItemLink>

        <MenuItemButton onClick={() => signOut()}>
          <MdExitToApp />
          Sair
        </MenuItemButton>

        <ThemeToggleFooter menuIsOpen={menuIsOpen}>
          <Toggle
            labelLeft='Light'
            labelRight='Dark'
            checked={darkTheme}
            onChange={handleChangeTheme}
          />
        </ThemeToggleFooter>

      </MenuContainer>
    </Container>
  )
}

export default Aside