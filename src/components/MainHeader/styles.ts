import styled from 'styled-components'

export const Container = styled.div`
grid-area: MH;

color: ${props => props.theme.colors.white};

background-color: ${props => props.theme.colors.secondary};

display: flex;
justify-content: space-between;
align-items: center;

padding: 0 20px;

border-bottom: 1px solid ${props => props.theme.colors.gray};
`

export const Profile = styled.div`
display: flex;
flex-direction: row;
align-items: flex-end;
`

export const Welcome = styled.h3`
margin-right: 7px
`

export const UserName = styled.h4`
color: ${props => props.theme.colors.info}
`