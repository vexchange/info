import Web3 from 'web3';
import { thorify } from 'thorify';
import { Driver, SimpleNet } from '@vechain/connex-driver';

import getVolume from '../../utils/api/volume'
import getReserves from '../../utils/api/reserves'
import getPrice from '../../utils/api/price'

const net = new SimpleNet("http://45.32.212.120:8669/");
const web3 = thorify(new Web3(), "http://45.32.212.120:8669/");

const handler = async (req, res) => {
  const { token } = req.query;

  const driver = await Driver.connect(net);

  const volume = await getVolume(driver, web3, token)
  const reserves = await getReserves(driver, token)
	const price = await getPrice(driver, token, "0xd8ccdd85abdbf68dfec95f06c973e87b1b5a9997")

  res.status(200).json({ volume, reserves, price });
};

export default handler;
