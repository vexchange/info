import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Code, Info, MessageCircle } from 'react-feather'
import Link from 'next/link';  
import styled from '@emotion/styled'
import MenuIcon from './MenuIcon.js'
import useOnClickOutside from '../../hooks/useOnClickOutside.js';

const StyledMenuIcon = styled(MenuIcon)`
  path {
    fill: white;
    stroke: rgb(255, 255, 255);
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: rgb(64, 68, 79);

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: rgb(86, 90, 105);
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: rgb(64, 68, 79);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2.6rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(Link)`
  flex: 1;
  color: rgb(195, 197, 203);
  :hover {
    color: rgb(255, 255, 255);
    cursor: pointer;
    text-decoration: none;
    opacity: 0.6;
  }
`

const MenuItemInner = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  
  > svg {
    margin-right: 8px;
  }
`

const CODE_LINK = 'https://github.com/kennethashley/info'

export default function Menu() {
  const ref = useRef();
	const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <StyledMenu ref={ref}>
			<StyledMenuButton onClick={() => setIsOpen(true)}>
        <StyledMenuIcon />
      </StyledMenuButton>

			{isOpen &&
        <MenuFlyout>
          <MenuItem id="link" href="https://vexchange.io/">
						<MenuItemInner>
							<Info size={14} />
							Exchange
						</MenuItemInner>
          </MenuItem>
          <MenuItem id="link" href="https://docs.vexchange.io/">
						<MenuItemInner>
							<BookOpen size={14} />
							Docs
						</MenuItemInner>
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
						<MenuItemInner>
							<Code size={14} />
							Github
						</MenuItemInner>
          </MenuItem>
          <MenuItem id="link" href="https://t.me/vexchange">
						<MenuItemInner>
							<MessageCircle size={14} />
							Telegram
						</MenuItemInner>
          </MenuItem>
        </MenuFlyout>
			}
    </StyledMenu>
  )
}
