import { FACTORY_ADDRESS } from "../constants/vexchange";
import Factory from "../abis/IVexchangeV2Factory.json";
import _ from "lodash";

export const getPairs = async (web3) => {
  const factoryContract = new web3.eth.Contract(Factory.abi, FACTORY_ADDRESS);
  const pairCount = await factoryContract.methods.allPairsLength().call();
  const pairsPromises = _.times(Number(pairCount), (i) => {
    return factoryContract.methods.allPairs(i).call();
  });
  const pairs = await Promise.all(pairsPromises);
  return pairs;
};
