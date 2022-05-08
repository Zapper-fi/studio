import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { AcrossContractFactory } from '../contracts';
import ACROSS_DEFINITION from '../across.definition';

const appId = ACROSS_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumAcrossTvlFetcher implements TvlFetcher {
    constructor(
        @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
        @Inject(AcrossContractFactory) private readonly acrossContractFactory: AcrossContractFactory,
    ) { }

    async getTvl() {
        const lpAddresss = [
            {
                name: 'badger',
                address: '0x43298f9f91a4545df64748e78a2c777c580573d6',
            },
            {
                name: 'boba',
                address: '0x4841572daA1f8E4Ce0f62570877c2D0CC18C9535',
            },
            {
                name: 'dai',
                address: '0x43f133FE6fDFA17c417695c476447dc2a449Ba5B',
            },
            {
                name: 'uma',
                address: '0xdfe0ec39291e3b60ACa122908f86809c9eE64E90',
            },
            {
                name: 'usdc',
                address: '0x256C8919CE1AB0e33974CF6AA9c71561Ef3017b6',
            },
            {
                name: 'wbtc',
                address: '0x02fbb64517E1c6ED69a6FAa3ABf37Db0482f1152',
            },
            {
                name: 'weth',
                address: '0x7355Efc63Ae731f584380a9838292c7046c1e433',
            },
        ];
        let total = 0;
        for (let i = 0; i < lpAddresss.length; i++) {
            const value = await this.getLpValue(lpAddresss[i].address);
            total += total;
        }
        return total;

    }

    async getLpValue(address) {
        const contract = this.acrossContractFactory.badgerPool({ address: address, network });
        const tokenAddress = await contract.l1Token();
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const ercTokenContract = this.appToolkit.globalContracts.erc20({
            address: tokenAddress,
            network: network,
        });
        const baseToken = baseTokens.find(baseToken => baseToken.address === tokenAddress);
        if (!baseToken) return 0;
        const multicall = this.appToolkit.getMulticall(network);
        const [decimals, tokenTotal] = await Promise.all([
            multicall.wrap(ercTokenContract).decimals(),
            multicall.wrap(ercTokenContract).balanceOf(address)
        ]);
        return (Number(tokenTotal) / 10 ** decimals) * baseToken.price;
    }
}
