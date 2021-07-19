import React, { useEffect, useState, Fragment } from 'react'
import styled from '@emotion/styled'
import { times } from 'lodash'
import axios from 'axios'

import { AutoColumn } from '../Column'
import { Label, ClickableText } from '../Text'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3fr repeat(4, 1fr);
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }
  @media screen and (max-width: 670px) {
    grid-template-columns: repeat(2, 1fr);
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
  }
`

const format = (num = 0) => new Intl.NumberFormat().format(num)

const DataRow = ({ token }) => {
	const [tokenData, setTokenData] = useState(null);

	useEffect(() => {
		axios.get(`/api/${token.address}`).then(({ data }) => {
			setTokenData(prevState => ({ ...data, ...prevState }))
		})
	}, [ token ])

	return (
		<tr>
			<td>{ token.name } ({ token.symbol })</td>
			<td>{ tokenData?.price?.quote2base }</td>
			<td>{ tokenData?.volume ?? 0 }</td>
			<td>{ format(tokenData?.reserves) }</td>
		</tr>
	)
};

const TokenTable = ({ tokens }) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Price (VET)</th>
					<th>Volume (VET)</th>
					<th>TVL (USD)</th>
				</tr>
			</thead>
			<tbody>
				{ tokens.map(token => (
					<DataRow key={token.address} token={token} />
				))}
			</tbody>
		</table>
	)
}

export default TokenTable
