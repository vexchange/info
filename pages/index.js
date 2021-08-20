import { useEffect, useState } from 'react'
import Big from 'big.js'
import Head from 'next/head'
import axios from 'axios'
import CoinGecko from 'coingecko-api'
import styled from '@emotion/styled'
import Image from 'next/image'
import { Flex, Box, Text } from 'rebass'
import { keyframes } from '@emotion/react'

import { formatCurrency } from '../utils'
import { allTokens } from '../utils/constants/tokens'
import { PageWrapper } from '../shared/styles'
import TokenTable from '../components/TokenTable'
import Card from '../components/Card'

const LargeText = styled.p`
  font-size: 32px;
  margin: 0;
`

const Label = styled.span`
  color: rgb(108, 114, 132);
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-weight: 500;
  font-size: 16px;
`

const CoinGeckoClient = new CoinGecko();

const bounce = keyframes`
  from {
    transform: scale(0.5);
  }

  to {
    transform: scale(1);
  }
`

export default function Home() {
  const [price, setPrice] = useState(0)
  const [tokens, setTokens] = useState([])
  const [tvl, setTVL] = useState(0)
  const [vol, setVol] = useState(0)

	useEffect(() => {
		const getPrice = async () => {
			const { data } = await CoinGeckoClient.simple.price(
				{
					ids: ['vechain'],
					vs_currencies: ['usd'],
			});

			setPrice(data.vechain.usd)
		}

    getPrice()
	}, [])

	useEffect(() => {
    const getData = () => {
      const promises = allTokens.map(async (item) => {
        const { data } = await axios.get(`/api/${item.address}`)
        item = { ...data, ...item }

        return item
      })

      Promise.all(promises).then(data => {
        setTokens(data)
      })
    }

    if (tokens.length === 0) {
      getData()
    }
	}, [tokens])

  useEffect(() => {
    const calculate = () => {
      const stats = tokens.reduce((acc, curr) => {
        return {
          tvl: acc.tvl.plus(Big(curr.reserves)),
          vol: acc.vol.plus(Big(curr.volume))
        }
      }, { tvl: new Big(0), vol: new Big(0)})

      setTVL(stats.tvl.toString())
      setVol(stats.vol.toString())
    }

    if (tokens.length !== 0) {
      calculate()
    }
  }, [tokens])

  return (
    <PageWrapper>
      <Head>
        <title>Vexchange Info</title>
        <meta name="description" content="Vexchange statistics" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>"></link>
      </Head>
      <Text mb={3}>Vexchange Overview</Text>
      { tokens.length === 0 
        ? (
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              marginTop: -91.5,
              marginLeft: -100,
              animationName: bounce,
              animationDuration: '1s',
            }}>
            <Image
              alt="loading" 
              height="183"
              src="/logo.png"
              width="200"
            />
          </Box>

        ) : (
          <>
            <Flex mx={-3} mb={4}>
              <Box width={1/2} px={3}>
                <Card>
                  <Label>TVL</Label>
                  <LargeText>{ formatCurrency((tvl * price).toFixed(2)) }</LargeText>
                </Card>
              </Box>
              <Box width={1/2} px={3}>
                <Card>
                  <Label>Volume 24H</Label>
                  <LargeText>{ formatCurrency((vol * price).toFixed(2)) }</LargeText>
                </Card>
              </Box>
            </Flex>
            <Text mb={3}>Top Tokens</Text>
            <TokenTable tokens={tokens} price={price} />
          </>
        )}
    </PageWrapper>
  )
}
