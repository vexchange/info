import { Token, Fetcher, Route } from 'vexchange-sdk'
import { Framework } from '@vechain/connex-framework';

const getMidPrice = async(
	driver,
	baseToken,
	quoteToken,
	baseDecimal = 18,
	quoteDecimal = 18,
	chainId = 1,
) => {
	const connex = new Framework(driver);

	if (chainId == undefined) {
		chainId = ChainId.MAINNET
	}

	let base = new Token(chainId, baseToken, baseDecimal);
	let quote = new Token(chainId, quoteToken, quoteDecimal);
	let pair = await Fetcher.fetchPairData(quote, base, connex);
	let route = await new Route([pair], base);
	let base2quote = await route.midPrice.toSignificant(6);
	let quote2base = await route.midPrice.invert().toSignificant(6);

	return { base2quote, quote2base }

}

export default getMidPrice;
