import React, { useState } from 'react'
import Image from 'next/image'
import styled from '@emotion/styled'

export default function Logo({
  src,
  alt,
  ...rest
}) {
  if (src) {
    return (
      <Image
        alt={alt}
        src={src}
        {...rest}
      />
    )
  }

  return <div>nah</div>
}

export const GenericImageWrapper = styled.img`
  width: ${({ size }) => size ?? '20px'};
  height: ${({ size }) => size ?? '20px'};
`
