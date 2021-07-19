import Web3 from 'web3';
import { thorify } from 'thorify';
import { utils } from 'ethers'
import { Driver, SimpleNet } from '@vechain/connex-driver';
import { Fetcher } from 'vexchange-sdk';
import { Framework } from '@vechain/connex-framework';

import getVolume from '../../utils/api/volume'
import getReserves from '../../utils/api/reserves'
import getPrice from '../../utils/api/price'

const net = new SimpleNet("http://45.32.212.120:8669/");
const web3 = thorify(new Web3(), "http://45.32.212.120:8669/");

const handler = async (req, res) => {
  const address = utils.getAddress(req.query.token)

  const driver = await Driver.connect(net);
	const connex = new Framework(driver);

  const token = await Fetcher.fetchTokenData(1, address, connex);
  const volume = await getVolume(connex, web3, address)
  const reserves = await getReserves(connex, token)
	const price = await getPrice(connex, address, "0xd8ccdd85abdbf68dfec95f06c973e87b1b5a9997")

  res.status(200).json({
    price,
    reserves,
    token,
    volume,
  });
};

export default handler;
