import React, { useCallback, useState } from 'react'
import { HelpCircle as Question } from 'react-feather'
import styled from '@emotion/styled'
import Popover, { PopoverProps } from '../Popover'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  background-color: #2C2F36;
  color: #C3C5CB;

  :hover,
  :focus {
    opacity: 0.7;
  }
`

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: 400;
`

export function Tooltip({ text, ...rest }) {
  return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

export default function QuestionHelper({ text, disabled }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show && !disabled}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <Question size={16} />
        </QuestionWrapper>
      </Tooltip>
    </span>
  )
}