import { WVET, Fetcher } from 'vexchange-sdk';
import { Big } from 'big.js';
import Pair from '../abis/IVexchangeV2Pair.json';

const weiToEth = b => b.div(Big("1000000000000000000"));

const getETHPosition = pair => {
  const wvet = WVET[1];
  if (pair.token0.address === wvet.address) {
    return 0;
  } else {
    return 1;
  }
};

/**
 *
 * @param connex the connex provider object
 * @param web3 the web3 provider object
 * @param address address of the pair contract
 * @returns {Promise<number>} done volume in a 24H period, denominated in VET
 */
const getVolume = async(connex, web3, address) => {

	const { number: TO_BLOCK } = connex.thor.status.head;
	// As vechain blocks are always 10s,
	// a 24 hour period can be represented as 8640 blocks
	const FROM_BLOCK  = TO_BLOCK - 8640;

	const token = await Fetcher.fetchTokenData(1, address, connex);
	const wvet = WVET[1];
	const pair = await Fetcher.fetchPairData(wvet, token, connex);

	const pairContract = new web3.eth.Contract(Pair.abi, pair.liquidityToken.address);

	const events = await pairContract.getPastEvents("Swap", {
		fromBlock: FROM_BLOCK,
		toBlock: TO_BLOCK,
	})

	const ethPosition = getETHPosition(pair);

	const total = events.reduce((acc, curr) => {
		const values = curr.returnValues;
		const amountIn = ethPosition === 0 ? values.amount0In : values.amount1In;
		const amountOut = ethPosition === 0 ? values.amount0Out : values.amount1Out;

		console.assert(amountIn == 0 || amountOut == 0,
				"Either amountIn or amountOut must be 0")

		const currValue = Big(amountIn).plus(Big(amountOut));
		return acc.plus(currValue);
	}, Big("0"));

	return parseFloat(weiToEth(total))
};

export default getVolume;
