import React, {
	useEffect,
	useState,
	useMemo,
	useCallback,
	Fragment,
} from 'react'
import styled from '@emotion/styled'

import Card from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { Label } from '../Text'
import { formatPrice, formatCurrency, formatPercentage } from '../../utils'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3fr repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Break = styled.div`
  height: 1px;
  width: 100%;
`

const Wrapper = styled(Card)`
	margin-bottom: 200px;
`

const Ticker = styled.span`
	box-sizing: border-box;
	margin: 0px 0px 0px 8px;
	min-width: 0px;
	font-weight: 500;
	color: rgb(108, 114, 132);
`

// const ResponsiveLogo = styled(CurrencyLogo)`
//   @media screen and (max-width: 670px) {
//     width: 16px;
//     height: 16px;
//   }
// `

const DataRow = ({ token, vetPrice, index }) => {
	return (
		<ResponsiveGrid>
			<Label>{index + 1}</Label>
			<Label>
				{/* <ResponsiveLogo address={token.address} /> */}
				{ token.name } <Ticker>({ token.symbol })</Ticker>
			</Label>
			<Label end={1}>
				{ formatPrice((token?.price?.base2quote ?? 0) * vetPrice) }
			</Label>
			<Label end={1}>
				{ formatCurrency((token?.volumeInVet ?? 0) * vetPrice) }
			</Label>
			<Label end={1}>
				{ formatPercentage(token?.annualizedFeeApr ?? 0) }
			</Label>
			<Label end={1}>
				{ formatCurrency(token?.tvlInUsd) }
			</Label>
		</ResponsiveGrid>
	)
};

const SORT_FIELD = {
  name: 'name',
  volumeInVet: 'volumeInVet',
  tvlInUsd: 'tvlInUsd',
  annualizedFeeApr: 'annualizedFeeApr',
  priceInVet: 'priceInVet',
}

const MAX_ITEMS = 10

const TokenTable = ({ tokens, vetPrice, maxItems = MAX_ITEMS }) => {
	const [page, setPage] = useState(1)
	const [sortField, setSortField] = useState(SORT_FIELD.tvlInUsd)
	const [sortDirection, setSortDirection] = useState(true)

	const sortedTokens = useMemo(() => {
    return tokens
      ? tokens
          .filter((x) => !!x)
          .sort((a, b) => {
            if (a && b) {
              return a[sortField] > b[sortField]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokens, maxItems, page, sortDirection, sortField])

	useEffect(() => {
    let extraPages = 1
    if (tokens) {
      if (tokens.length % maxItems === 0) {
        extraPages = 0
      }
    }
  }, [maxItems, tokens])

	const handleSort = useCallback(newField => {
		setSortField(newField)
		setSortDirection(sortField !== newField ? true : !sortDirection)
	}, [sortDirection, sortField])

	return (
		<Wrapper>
			<AutoColumn gap="16px">

				<ResponsiveGrid>
					<Label>#</Label>
					<Label onClick={() => handleSort(SORT_FIELD.name)}>Name</Label>
					<Label end={1} onClick={() => handleSort(SORT_FIELD.priceInVet)}>Price</Label>
					<Label end={1} onClick={() => handleSort(SORT_FIELD.volumeInVet)}>Volume</Label>
					<Label end={1} onClick={() => handleSort(SORT_FIELD.annualizedFeeApr)}>Swap Fee APR</Label>
					<Label end={1} onClick={() => handleSort(SORT_FIELD.tvlInUsd)}>TVL</Label>
				</ResponsiveGrid>

				<Break />
				{ sortedTokens.map((token, index) => {
					if (token) {
						return (
							<Fragment key={token.address}>
								<DataRow token={token} vetPrice={vetPrice} index={index} />
								<Break />
							</Fragment>
						)
					}
				})}
			</AutoColumn>
		</Wrapper>
	)
}

export default TokenTable
