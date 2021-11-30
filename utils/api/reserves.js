import { WVET } from "vexchange-sdk";
import { Fetcher } from "vexchange-sdk";

/**
 *
 * @param connex the connex provider
 * @param pair pair addresses of pool
 * @param vetPosition position of WVET in pool
 * @returns {Promise<number>} the token reserves of token1
 */
const getReserves = async (connex, pair, vetPosition) => {
  const token0 = WVET[1];
  const nonVetAddress = pair[1 - vetPosition];
  const token1 = await Fetcher.fetchTokenData(1, nonVetAddress, connex);
  const poolPair = await Fetcher.fetchPairData(token0, token1, connex);

  const token1Reserve = await poolPair.reserveOf(token1);

  return parseFloat(token1Reserve.toExact());
};

export default getReserves;
