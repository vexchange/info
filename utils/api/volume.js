import { WVET, Fetcher } from 'vexchange-sdk';
import { Big } from 'big.js';
import * as EthDater from 'ethereum-block-by-date';
import moment from 'moment';
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

const getVolume = async(connex, web3, address) => {
	const dater = new EthDater(web3);

	const from = moment().subtract(1, 'days').format()
	const { block: FROM_BLOCK } = await dater.getDate(from, true);
	const { number: TO_BLOCK } = connex.thor.status.head;

	const token = await Fetcher.fetchTokenData(1, address, connex);
	const wvet = WVET[1];
	const pair = await Fetcher.fetchPairData(wvet, token, connex);

	const pairContract = new web3.eth.Contract(Pair.abi, pair.liquidityToken.address);

	const events = await pairContract.getPastEvents("Swap", {
		fromBlock: FROM_BLOCK,
		toBlock: TO_BLOCK,
	})

	const ethPosition = getETHPosition(pair);

	const total = events.reduce((prev, curr) => {
		const values = curr.returnValues;
		const amountIn = ethPosition === 0 ? values.amount0In : values.amount1In;

		const amountOut = ethPosition === 0 ? values.amount0Out : values.amount1Out;

		const currValue = Big(amountIn).plus(Big(amountOut));
		return prev.plus(currValue);
	}, Big("0"));

	return parseFloat(weiToEth(total)).toFixed(2)
};

export default getVolume;
