import { Inject } from '@nestjs/common';
import Axios from 'axios';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { ContractType } from '~position/contract.interface';
import { getLabelFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';

import { EaseContractFactory } from '../contracts';
import { EASE_DEFINITION } from '../ease.definition';


const appId = EASE_DEFINITION.id;
const groupId = EASE_DEFINITION.groups.rca.id;
const network = Network.ETHEREUM_MAINNET;

export type EaseRcaVaultDetails = {
	symbol: string;
	name: string;
	address: string;
	apy: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEaseRcaTokenFetcher implements PositionFetcher<AppTokenPosition> {
	constructor(
		@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
		@Inject(EaseContractFactory) private readonly easeContractFactory: EaseContractFactory,
	) { }

	async getPositions() {

		const endpoint = 'https://app.ease.org/api/v1/vaults';
		const ethData = await Axios.get<EaseRcaVaultDetails[]>(endpoint).then(v => v.data);
		// const ethData = data.filter(({ network }) => network === 'eth');
		const addresses = ethData.map(({ address }) => address.toLowerCase());
		const rcaAddressToDetails = _.keyBy(ethData, v => v.address.toLowerCase());

		const multicall = this.appToolkit.getMulticall(network);


		const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

		const appTokenDependencies = await this.appToolkit.getAppTokenPositions(
			//TODO: auto insert appIds for new protocols
			{ appId: 'sushiswap', groupIds: ['pool'], network },
			{ appId: 'convex', groupIds: ['deposit'], network },
			{ appId: 'yearn', groupIds: ['vault'], network },
			{ appId: 'aave-v2', groupIds: ['supply'], network },
			{ appId: 'compound', groupIds: ['supply'], network },
		)
		// console.log(appTokenDependencies);

		const allTokenDependencies = [...appTokenDependencies, ...baseTokenDependencies];
		// console.log(allTokenDependencies);

		const tokens = await Promise.all(
			addresses.map(async address => {
				//TODO: Compound, Sushi etc have their own variation of RcaShieldContracts. Is this important for the zapper integration?
				const contract = this.easeContractFactory.easeRcaShield({ address: address, network });

				const [symbol, decimals, supplyRaw] = await Promise.all([
					multicall.wrap(contract).symbol(),
					multicall.wrap(contract).decimals(),
					multicall.wrap(contract).totalSupply(),
				]);

				const supply = Number(supplyRaw) / 10 ** decimals;


				const [underlyingTokenAddressRaw, ratioRaw] = await Promise.all([
					multicall.wrap(contract).uToken().catch(() => ''),
					1
				]);

				const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
				const underlyingToken = allTokenDependencies.find(v => v.address === underlyingTokenAddress)
				if (!underlyingToken) return null;
				const tokens = [underlyingToken]

				//TODO: is pricePerShare = underlyingToken.price? Maybe not, because we gat rounding issues and deposits gave different amounts back
				const pricePerShare = underlyingToken.price;
				const price = underlyingToken.price

				// console.log(underlyingToken);
				// console.log(price);
				// console.log(pricePerShare);

				const label = `ez-${getLabelFromToken(underlyingToken)}`;

				// Create the token object
				const token: AppTokenPosition = {
					type: ContractType.APP_TOKEN,
					appId,
					groupId,
					address: address,
					network,
					symbol,
					decimals,
					supply,
					pricePerShare,
					price,
					tokens,
					dataProps: {
						//TODO: APY, TVL etc. ask team what else is needed
					},
					displayProps: {
						label: label,
						images: [getTokenImg(address, network)]
					}
				};
				return token;
			}),
		);

		return _.compact(tokens);
	}
}
