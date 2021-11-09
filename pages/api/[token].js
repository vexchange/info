import Web3 from 'web3';
import { thorify } from 'thorify';
import { utils } from 'ethers'
import { Driver, SimpleNet } from '@vechain/connex-driver';
import { Fetcher } from 'vexchange-sdk';
import { Framework } from '@vechain/connex-framework';

import getVolume from '../../utils/api/volume'
import getReserves from '../../utils/api/reserves'
import getPrice from '../../utils/api/price'

const net = new SimpleNet("http://mainnet02.vechain.fi.blockorder.net");
const web3 = thorify(new Web3(), "http://mainnet02.vechain.fi.blockorder.net");

const handler = async (req, res) => {
  const address = utils.getAddress(req.query.token)

  const driver = await Driver.connect(net);
  const connex = new Framework(driver);

  const token = await Fetcher.fetchTokenData(1, address, connex);
  const volumeInVet = await getVolume(connex, web3, address)
  const reserves = await getReserves(connex, token)
  const price = await getPrice(connex, address,
                    "0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997",
                                token.decimals)

  res.status(200).json({
    price,
    reserves,
    token,
    volumeInVet,
  });
};

export default handler;
