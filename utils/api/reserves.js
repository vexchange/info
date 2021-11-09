import { WVET } from 'vexchange-sdk'
import { Fetcher } from "vexchange-sdk";


/**
 *
 * @param connex the connex provider
 * @param token1 vexchange-sdk Token
 * @returns {Promise<number>} the token reserves of token1
 */
const getReserves = async (connex, token1) => {
	// token0 is always WVET
	const token0 = WVET[1]
	const pair = await Fetcher.fetchPairData(token0, token1, connex)

	const token1Reserve = await pair.reserveOf(token1)

	return parseFloat(token1Reserve.toExact())
}

export default getReserves
