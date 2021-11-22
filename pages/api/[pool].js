import Web3 from "web3";
import { thorify } from "thorify";
import { utils } from "ethers";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import { Fetcher } from "vexchange-sdk";
import Pair from "../../utils/abis/IVexchangeV2Pair.json";
import { Framework } from "@vechain/connex-framework";

import getVolume, { getETHPosition } from "../../utils/api/volume";
import getReserves from "../../utils/api/reserves";
import getPrice from "../../utils/api/price";

const net = new SimpleNet("https://mainnet.veblocks.net");
const web3 = thorify(new Web3(), "https://mainnet.veblocks.net");

const handler = async (req, res) => {
  const address = utils.getAddress(req.query.pool);

  const driver = await Driver.connect(net);
  const connex = new Framework(driver);

  const poolContract = new web3.eth.Contract(Pair.abi, address);
  const pair = await Promise.all([
    poolContract.methods.token0().call(),
    poolContract.methods.token1().call(),
  ]);

  const vetPosition = getETHPosition(pair);

  let volumeInVet = 0;
  let reserves = 0;
  let price = { base2quote: 1, quote2base: 1 };
  let token;

  //pools without VET are not considered
  if (vetPosition > 0) {
    volumeInVet = await getVolume(connex, poolContract, vetPosition);
    reserves = await getReserves(connex, pair, vetPosition);
    const nonVetAddress = pair[1 - vetPosition];
    token = await Fetcher.fetchTokenData(1, nonVetAddress, connex);
    price = await getPrice(
      connex,
      nonVetAddress,
      "0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997",
      token.decimals
    );
  } else {
    const nonVetAddress = pair[0];
    token = await Fetcher.fetchTokenData(1, nonVetAddress, connex);
  }

  res.status(200).json({
    price,
    reserves,
    volumeInVet,
    token,
  });
};

export default handler;