import { utils } from 'ethers'
import { Pair, WVET } from 'vexchange-sdk'
import { find } from 'lodash'

import PairABI from '../abis/IVexchangeV2Pair.json'

const getReserves = async (connex, token1) => {
	const token0 = WVET[1]
	const pairAddress = Pair.getAddress(token0, token1)
	const getReservesABI = find(PairABI.abi, { name: 'getReserves' })
	const getResevesMethod = connex.thor.account(pairAddress).method(getReservesABI)

	const reserves = await getResevesMethod.call().then(data => data.decoded)
  const { reserve0, reserve1 } = reserves

	const total = parseFloat(utils.formatUnits(reserve0, 18)) + parseFloat(utils.formatUnits(reserve1, 18))

	return total
}

export default getReserves
