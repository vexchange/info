import { transparentize } from 'polished'
import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import styled from '@emotion/styled'
import Portal from '@reach/portal'
import useInterval from '../../hooks'

const PopoverContainer = styled.div`
  z-index: 9999;

  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;

  background: #2C2F36;
  border: 1px solid #40444F;
  box-shadow: 0 4px 8px 0 ${transparentize(0.9, '#000')};
  color: #C3C5CB;
  border-radius: 8px;
`

const ReferenceElement = styled.div`
  display: inline-block;
`

export default function Popover({ content, show, children, placement = 'auto' }) {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement] = useState(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } },
    ],
  })

  useInterval(update, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement}>{children}</ReferenceElement>
      <Portal>
        <PopoverContainer show={show} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          {content}
          {/* <Arrow
            className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setArrowElement}
            style={styles.arrow}
            {...attributes.arrow}
          /> */}
        </PopoverContainer>
      </Portal>
    </>
  )
}