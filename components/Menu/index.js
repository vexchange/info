import React, { useRef, useState } from 'react'
import { BookOpen, Code, Info, MessageCircle } from 'react-feather'
import Link from 'next/link';  
import styled from '@emotion/styled'
import { useOnClickOutside } from '../../hooks/index.js';

const StyledMenuButton = styled.button`
  font-family: VCR, sans-serif;
  text-transform: uppercase;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: #f5a78814;

  padding: 0.15rem 0.5rem;
  border-radius: 8px;
  color: #f5a788;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    opacity: 0.64;
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
  background-color: rgb(18, 18, 24);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 40px;
  right: 0px;
  z-index: 100;
`

const MenuItem = styled(Link)`
  flex: 1;
`

const MenuItemInner = styled.div`
  color: rgba(255, 255, 255, 0.64);
  display: flex;
  align-items: center;
  padding: 8px 38px 8px 16px;
  cursor: pointer;
  text-transform: uppercase;
  font-family: VCR, sans-serif;
  font-size: 14px;
  line-height: 20px;

  &:hover {
    color: rgb(255, 255, 255);
    cursor: pointer;
    text-decoration: none;
  }
  
  > svg {
    margin-right: 8px;
  }

  
  &:first-of-type {
    padding-top: 16px;
  }

  &:last-of-type {
    padding-bottom: 16px;
  }
`

const CODE_LINK = 'https://github.com/vexchange/info'

export default function Menu() {
  const ref = useRef();
	const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <StyledMenu ref={ref}>
			<StyledMenuButton onClick={() => setIsOpen(true)}>
        Important Links
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
