import { WVET } from "vexchange-sdk";
import { Big } from "big.js";

const weiToEth = (b) => b.div(Big("1000000000000000000"));

export const getETHPosition = (pair) => {
  const wvet = WVET[1];
  if (pair[0] === wvet.address) {
    return 0;
  } else if (pair[1] === wvet.address) {
    return 1;
  } else {
    return -1;
  }
};

/**
 *
 * @param connex the connex provider object
 * @param poolContract the web3 provider object
 * @param ethPosition position of WVET in pool
 * @returns {Promise<number>} done volume in a 24H period, denominated in VET
 */
const getVolume = async (connex, poolContract, ethPosition) => {
  const { number: TO_BLOCK } = connex.thor.status.head;
  // As vechain blocks are always 10s,
  // a 24 hour period can be represented as 8640 blocks
  const FROM_BLOCK = TO_BLOCK - 8640;

  const events = await poolContract.getPastEvents("Swap", {
    fromBlock: FROM_BLOCK,
    toBlock: TO_BLOCK,
  });

  const total = events.reduce((acc, curr) => {
    const values = curr.returnValues;
    const amountIn = ethPosition === 0 ? values.amount0In : values.amount1In;
    const amountOut = ethPosition === 0 ? values.amount0Out : values.amount1Out;

    console.assert(
      amountIn == 0 || amountOut == 0,
      "Either amountIn or amountOut must be 0"
    );

    const currValue = Big(amountIn).plus(Big(amountOut));
    return acc.plus(currValue);
  }, Big("0"));

  return parseFloat(weiToEth(total));
};

export default getVolume;
