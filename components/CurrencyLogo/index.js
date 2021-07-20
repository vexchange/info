import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { utils } from 'ethers'
import Logo from '../Logo'

export const getTokenLogoURL = address => {
  return `https://raw.githubusercontent.com/vechain/token-registry/master/tokens/main/${address}/token.png`
}

const StyledLogo = styled(Logo)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.text4};
`

export default function CurrencyLogo({
  address,
  size = '24px',
  style,
  ...rest
}) {
  const src = useMemo(() => {
    const checkSummed = utils.getAddress(address)

    if (checkSummed) {
      return getTokenLogoURL(checkSummed)
    }

    return null
  }, [address])

  return (
		<StyledLogo
			width={size}
			height={size}
			src={src}
			alt={'token logo'}
			style={style}
			{...rest} 
		/>
	)
}
