import React, { useEffect, useState, useMemo } from 'react'
import { Flex, Text } from 'rebass'
import styled from '@emotion/styled'
import { useMedia } from 'react-use'

import Card from '../Card'

// import TokenLogo from '../TokenLogo'

import DoubleTokenLogo from '../DoubleLogo'

import FormattedName from '../FormattedName'
import { formatCurrency, formattedPercent } from '../../utils'

const Wrapper = styled(Card)`
	margin-bottom: 200px;

  @media screen and (max-width: 640px) {
    background: none;
    padding: 0;
  }
`

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: #fafafa !important;
  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`;

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: #fafafa !important;
  & > * {
    font-size: 14px;
  }
  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`;

const Table = styled.table`
  border-collapse: collapse;

  th {
    font-weight: normal;
  }

  td, th {
    border: none;
    padding: 15px;
  }

  @media screen and (max-width: 640px) {
    border: 0;

    thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    tr {
      border-radius: 8px;
      display: block;
      margin-bottom: 20px;
      padding-left: 1rem;
      padding-right: 1rem;
      background-color: rgb(25, 27, 31);
    }

    td {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 0;
      padding-right: 0;

      &:not(:last-of-type) {
        border-bottom: 1px solid rgb(64, 68, 79);
      }

      &::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        margin-right: 8px;
      }
    }
  }
`

const SORT_FIELD = {
  LIQ: "tvlInUsd",
  VOL: "volumeInVet",
  SYMBOL: "symbol",
  NAME: "name",
  PRICE: "priceInVet",
  APR: "annualizedFeeApr",
};

const TokenTable = ({ tokens, vetPrice, itemMax = 10, useTracked = false }) => {
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  // sorting
  const [sortDirection, setSortDirection] = useState(true);
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VOL);

  const ifBelow680 = useMedia('(max-width: 680px)')
  const ifBelow640 = useMedia('(max-width: 640px)')
  const ifBelow600 = useMedia('(max-width: 600px)')

	useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [tokens])

  const formattedTokens = useMemo(() => {
    return tokens && Object.keys(tokens).map((key) => tokens[key]);
  }, [tokens]);

  useEffect(() => {
    if (tokens && formattedTokens) {
      let extraPages = 1;
      if (formattedTokens.length % itemMax === 0) {
        extraPages = 0;
      }
      setMaxPage(Math.floor(formattedTokens.length / itemMax) + extraPages);
    }
  }, [tokens, formattedTokens, itemMax]);

  const filteredList = useMemo(() => {
    return (
      formattedTokens &&
      formattedTokens
        .sort((a, b) => {
          if (
            sortedColumn === SORT_FIELD.SYMBOL ||
            sortedColumn === SORT_FIELD.NAME
          ) {
            return a[sortedColumn] > b[sortedColumn]
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1;
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1;
        })
        .slice(itemMax * (page - 1), page * itemMax)
    );
  }, [formattedTokens, itemMax, page, sortDirection, sortedColumn]);

	return (
		<Wrapper>

      <Table>
        <thead>
          <tr>
            <th>
              <Flex alignItems="center" justifyContent="flexStart">
                <ClickableText
                  color="text"
                  area="name"
                  fontWeight="500"
                  onClick={e => {
                    setSortedColumn(SORT_FIELD.NAME)
                    setSortDirection(sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection)
                  }}
                >
                  {'Pair'} {sortedColumn === SORT_FIELD.NAME ? (!sortDirection ? '↑' : '↓') : ''}
                </ClickableText>
              </Flex>
            </th>
            <th>
              <ClickableText
                area="liq"
                onClick={e => {
                  setSortedColumn(SORT_FIELD.LIQ)
                  setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
                }}
              >
                Liquidity {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </th>
            <th>
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
            </th>
            <th>
              <ClickableText
                area="price"
                onClick={(e) => {
                  setSortedColumn(SORT_FIELD.PRICE)
                  setSortDirection(sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection)
                }}
              >
                Price {sortedColumn === SORT_FIELD.PRICE ? (!sortDirection ? '↑' : '↓') : ''}
              </ClickableText>
            </th>
            <th>
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
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredList && filteredList.map((item, index) => {
            return (
              <tr key={index}>
                <td data-label="Name:">
                  <DataText area="name" fontWeight="500">
                    {!ifBelow640 && (
                      <>
                        <div style={{ marginRight: '1rem', width: '10px' }}>{index + 1}</div>
                        {item?.token0 && item?.token1 && (
                          <DoubleTokenLogo
                            a0={item?.token0?.address || ''}
                            a1={item?.token1?.address || ''}
                            size={26}
                            margin={true} 
                          />
                        )}
                      </>
                    )}
                    <FormattedName
                      margin='15px'
                      text={`${item.token0? item.token0.symbol : '?'}/${item.token1? item.token1.symbol : '?'}`}
                      maxCharacters={ifBelow600 ? 8 : 16}
                      adjustSize={true}
                      link={true}
                    />
                  </DataText>
                </td>
                <td data-label="Liquidity:">
                  <DataText area="liq" justifyContent="flex-end">{formatCurrency(item.tvlInUsd)}</DataText>
                </td>
                <td data-label="Volume:">
                  <DataText area="vol" justifyContent="flex-end">
                    {formatCurrency(item.volumeInVet * vetPrice)}
                  </DataText>
                </td>
                <td data-label="Price:">
                  <DataText area="price" color="text" fontWeight="500" justifyContent="flex-end">
                    {formatCurrency(item.price.base2quote * vetPrice)}
                  </DataText>
                </td>
                <td data-label="APR:">
                  <DataText area="apr" justifyContent="flex-end">{formattedPercent(item.annualizedFeeApr)}</DataText>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
		</Wrapper>
	)
}

export default TokenTable;
