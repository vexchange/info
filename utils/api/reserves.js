import { utils } from 'ethers'
import { Pair, WVET } from 'vexchange-sdk'
import CoinGecko from 'coingecko-api'
import { find, transform } from 'lodash'

import PairABI from '../abis/IVexchangeV2Pair.json'

const CoinGeckoClient = new CoinGecko();

const geckoMap = {
	'0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997': 'vechain',
	'0x0000000000000000000000000000456E65726779': 'vethor-token',
	'0x0CE6661b4ba86a0EA7cA2Bd86a0De87b0B860F14': 'oceanex-token',
	'0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8': 'decentbet',
	'0xaCc280010B2EE0efc770BCE34774376656D8cE14': 'hackenai',
	'0x5db3C8A942333f6468176a870dB36eEf120a34DC': 'safe-haven',
	'0x89827f7bb951fd8a56f8ef13c5bfee38522f2e1f': 'plair',
	'0xf8e1fAa0367298b55F57Ed17F7a2FF3F5F1D1628': 'eight-hours',
	'0x46209D5e5a49C1D403F4Ee3a0A88c3a27E29e58D': 'jur',
	'0x67fD63f6068962937EC81AB3Ae3bF9871E524FC9': 'veed',
}

const getReserves = async (connex, token1) => {
	const token0 = WVET[1]
	const pairAddress = Pair.getAddress(token0, token1)
	const getReservesABI = find(PairABI.abi, { name: 'getReserves' })
	const getResevesMethod = connex.thor.account(pairAddress).method(getReservesABI)
	const { data } = await CoinGeckoClient.simple.price(
		{
			ids: [geckoMap[token0.address], geckoMap[token1.address]],
			vs_currencies: ['usd'],
	});

	const [firstTokenKey, secondTokenKey] = Object.keys(data)
	const { usd: token0Price } = data[firstTokenKey]
	const { usd: token1Price } = data[secondTokenKey]

	const reserves = await getResevesMethod.call().then(data => data.decoded)
  const { reserve0, reserve1 } = reserves

	const reserve0USDValue = parseFloat(token0Price) * parseFloat(utils.formatUnits(reserve0, 18))
	const reserve1USDValue = parseFloat(token1Price) * parseFloat(utils.formatUnits(reserve1, 18))

	return (reserve0USDValue + reserve1USDValue).toFixed(3)
}

export default getReserves
