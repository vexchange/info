import React, { useEffect, useState, useMemo } from 'react'
import { Box, Flex, Text } from 'rebass'
import styled from '@emotion/styled'
import { useMedia } from 'react-use'

import Card from '../Card'
import Row from '../Row'
import TokenLogo from '../TokenLogo'
import FormattedName from '../FormattedName'
import { formatCurrency, formattedPercent } from '../../utils'

const Divider = styled(Box)`
  height: 1px;
  background-color: 'rgba(43, 43, 43, 0.435)';
`

const Wrapper = styled(Card)`
	margin-bottom: 200px;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr;
  grid-template-areas: 'price vol';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    &:first-of-type {
      justify-content: flex-start;
      text-align: left;
    }
  }

  @media screen and (min-width: 320px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 100px 1fr 1fr;
    grid-template-areas: 'name vol price';
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 180px 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol price';
    > * {
      justify-content: flex-end;
      width: 100%;
      &:first-of-type {
        justify-content: flex-start;
      }
    }
  }
  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol price apr';
  }
`

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: #FAFAFA !important;
  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: #FAFAFA !important;
  & > * {
    font-size: 14px;
  }
  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const SORT_FIELD = {
  LIQ: 'tvlInUsd',
  VOL: 'volumeInVet',
  SYMBOL: 'symbol',
  NAME: 'name',
  PRICE: 'priceInVet',
  APR: 'annualizedFeeApr'
}

const TokenTable = ({ tokens, vetPrice, itemMax = 10, useTracked = false }) => {
	const [page, setPage] = useState(1)
	const [maxPage, setMaxPage] = useState(1)

	  // sorting
		const [sortDirection, setSortDirection] = useState(true)
		const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VOL)

	const ifBelow1080 = useMedia('(max-width: 1080px)')
  const ifAbove1080 = !ifBelow1080

  const ifBelow680 = useMedia('(max-width: 680px)')
  const ifAbove680 = !ifBelow680

  const ifBelow600 = useMedia('(max-width: 600px)')

  const ifBelow320 = useMedia('(max-width: 320px)')
  const ifAbove320 = !ifBelow320

	useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [tokens])

	const formattedTokens = useMemo(() => {
    return (
      tokens &&
      Object.keys(tokens).map((key) => tokens[key])
    )
  }, [tokens])
	
  useEffect(() => {
    if (tokens && formattedTokens) {
      let extraPages = 1
      if (formattedTokens.length % itemMax === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(formattedTokens.length / itemMax) + extraPages)
    }
  }, [tokens, formattedTokens, itemMax])

  const filteredList = useMemo(() => {
    return (
      formattedTokens &&
      formattedTokens
        .sort((a, b) => {
          if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
            return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1
        })
        .slice(itemMax * (page - 1), page * itemMax)
    )
  }, [formattedTokens, itemMax, page, sortDirection, sortedColumn])

	const ListItem = ({ item, index }) => (
    <DashGrid style={{ height: '48px' }} focus={true}>
      <DataText area="name" fontWeight="500">
        <Row>
          {ifAbove680 && <div style={{ marginRight: '1rem', width: '10px' }}>{index}</div>}
          <TokenLogo address={item.address} />
          <FormattedName
            margin='15px'
            text={ifBelow680 ? item.symbol : item.name}
            maxCharacters={ifBelow600 ? 8 : 16}
            adjustSize={true}
            link={true}
          />
        </Row>
      </DataText>
      {ifAbove680 && (
        <DataText area="symbol" color="text" fontWeight="500">
          <FormattedName text={item.symbol} maxCharacters={5} />
        </DataText>
      )}
      {ifAbove1080 && (
        <DataText area="liq">{formatCurrency(item.tvlInUsd)}</DataText>
      )}
      {ifAbove320 && (
        <DataText area="vol">
          {formatCurrency(item.volumeInVet * vetPrice)}
        </DataText>
      )}
      <DataText area="price" color="text" fontWeight="500">
        {formatCurrency(item.price.base2quote * vetPrice)}
      </DataText>
      {ifAbove1080 && <DataText area="apr">{formattedPercent(item.annualizedFeeApr)}</DataText>}
    </DashGrid>
  )

	return (
		<Wrapper>
			<DashGrid center={true} style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}>
				<Flex alignItems="center" justifyContent="flexStart">
          <ClickableText
            color="text"
            area="name"
            fontWeight="500"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.NAME)
              setSortDirection(sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection)
            }}
          >
            {ifBelow680 ? 'Symbol' : 'Name'} {sortedColumn === SORT_FIELD.NAME ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
				{ifAbove680 && (
          <Flex alignItems="center">
            <ClickableText
              area="symbol"
              onClick={() => {
                setSortedColumn(SORT_FIELD.SYMBOL)
                setSortDirection(sortedColumn !== SORT_FIELD.SYMBOL ? true : !sortDirection)
              }}
            >
              Symbol {sortedColumn === SORT_FIELD.SYMBOL ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
        {ifAbove1080 && (
          <Flex alignItems="center">
            <ClickableText
              area="liq"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.LIQ)
                setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
              }}
            >
              Liquidity {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
				{ifAbove320 && (
          <Flex alignItems="center">
            <ClickableText
              area="vol"
              onClick={() => {
                setSortedColumn(SORT_FIELD.VOL)
                setSortDirection(
                  sortedColumn !== SORT_FIELD.VOL ? true : !sortDirection
                )
              }}
            >
              Volume (24hrs)
              {sortedColumn === SORT_FIELD.VOL ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
        <Flex alignItems="center">
          <ClickableText
            area="price"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.PRICE)
              setSortDirection(sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection)
            }}
          >
            Price {sortedColumn === SORT_FIELD.PRICE ? (!sortDirection ? '↑' : '↓') : ''}
          </ClickableText>
        </Flex>
        {ifAbove1080 && (
          <Flex alignItems="center">
            <ClickableText
              area="apr"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.APR)
                setSortDirection(sortedColumn !== SORT_FIELD.APR ? true : !sortDirection)
              }}
            >
              APR
              {sortedColumn === SORT_FIELD.APR ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}
			</DashGrid>
			<Divider />
			<List p={0}>
        {filteredList && filteredList.map((item, index) => {
					return (
						<div key={index}>
							<ListItem key={index} index={(page - 1) * itemMax + index + 1} item={item} />
							<Divider />
						</div>
					)
				})}
      </List>
		</Wrapper>
	)
}

export default TokenTable
