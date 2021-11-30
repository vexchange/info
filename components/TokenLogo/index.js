import React, { useState, useEffect } from 'react'
import { WVET } from 'vexchange-sdk'
import styled from '@emotion/styled'

const BAD_IMAGES = {}

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  background-color: #191B1F;
  border: 1px solid #f5a788;
  padding: 5px;
`

const StyledVeChainLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
  }
`

export default function TokenLogo({ address, header = false, size = '26px', ...rest }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(false)
  }, [address])

  if (error || BAD_IMAGES[address]) {
    return (
      <Inline>
        <span {...rest} alt={''} style={{ fontSize: size }} role="img" aria-label="face">
          🤔
        </span>
      </Inline>
    )
  }

  if (address?.toLowerCase() === '0xd8ccdd85abdbf68dfec95f06c973e87b1b5a9997') {
    return (
      <StyledVeChainLogo size={size} {...rest}>
        <Image
          src="/vet.png"
          style={{
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
            borderRadius: '50%',
          }}
          alt=""
        />
      </StyledVeChainLogo>
    )
  }

  const path = `https://raw.githubusercontent.com/vechain/token-registry/master/tokens/main/${(address).toLowerCase()}/token.png`

  return (
    <Inline>
      <Image
        {...rest}
        alt={''}
        src={path}
        size={size}
        onError={(event) => {
          BAD_IMAGES[address] = true
          setError(true)
          event.preventDefault()
        }}
      />
    </Inline>
  )
}