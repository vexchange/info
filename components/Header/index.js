import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Menu from '../Menu'
import styled from '@emotion/styled'
import { RowFixed } from '../Row'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  padding-left: 40px;
  padding-right: 40px;
  z-index: 2;
  height: 72px;
  border-bottom: 1px solid #1C1C22;

  backdrop-filter: blur(40px);
  /**
   * Firefox desktop come with default flag to have backdrop-filter disabled
   * Firefox Android also currently has bug where backdrop-filter is not being applied
   * More info: https://bugzilla.mozilla.org/show_bug.cgi?id=1178765
   **/
  @-moz-document url-prefix() {
    background-color: rgba(0, 0, 0, 0.9);
  }

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    padding: 0.5rem 1rem;
    width: calc(100%);
    position: relative;
  }
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  @media (max-width: 1080px) {
    display: none;
  }
`

const HeaderRow = styled(RowFixed)`
  display: flex;
  align-items: center;

  @media (max-width: 1080px) {
    width: 100%;
  }
`

const Title = styled(Link)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  margin-right: 12px;

  :hover {
    cursor: pointer;
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  padding: 12px 16px;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
    margin-top: 2px;
  }
`

export default function Header() {
  return (
    <HeaderFrame>
      <HeaderRow>
        <Title href="/">
          <Image
            width="40px"
            height="37"
            src="/logo.svg"
            alt="logo" 
          />
        </Title>
      </HeaderRow>
			<HeaderControls>
        <Menu />
      </HeaderControls>
    </HeaderFrame>
  )
}
