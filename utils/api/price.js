import { Token, Fetcher, Route } from 'vexchange-sdk'

const getMidPrice = async(
	connex,
	baseToken,
	quoteToken,
	baseDecimal = 18,
	quoteDecimal = 18,
	chainId = 1,
) => {
	if (chainId == undefined) {
		chainId = ChainId.MAINNET
	}

	let base = new Token(chainId, baseToken, baseDecimal);
	let quote = new Token(chainId, quoteToken, quoteDecimal);
	let pair = await Fetcher.fetchPairData(quote, base, connex);
	let route = await new Route([pair], base);
	let base2quote = await route.midPrice.toSignificant(6);
	let quote2base = await route.midPrice.invert().toSignificant(6);

	return {
		base2quote: parseFloat(base2quote),
		quote2base: parseFloat(quote2base),
	}

}

export default getMidPrice;
