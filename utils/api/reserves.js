import { utils } from 'ethers';
import { Fetcher, Pair, WVET } from 'vexchange-sdk';
import { Framework } from '@vechain/connex-framework';
import { find } from 'lodash';

import PairABI from '../abis/IVexchangeV2Pair.json'

const getReserves = async (driver, address) => {
	const connex = new Framework(driver);

  const token = await Fetcher.fetchTokenData(1, address, connex);

	const pairAddress = Pair.getAddress(WVET[1], token)
	const getReservesABI = find(PairABI.abi, { name: 'getReserves' });
	const getResevesMethod = connex.thor.account(pairAddress).method(getReservesABI);

	const reserves = await getResevesMethod.call().then(data => data.decoded);
  const { reserve0, reserve1 } = reserves;

	return {
		reserve0: utils.formatUnits(reserve0, 18),
		reserve1: utils.formatUnits(reserve1, 18)
	}
};

export default getReserves;
