import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { LIQUITY_DEFINITION } from '~apps/liquity';
import { ProductItem } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { BProtocolContractFactory } from '../contracts';

const appId = LIQUITY_DEFINITION.id;
const groupId = LIQUITY_DEFINITION.groups.trove.id;
const network = Network.ETHEREUM_MAINNET;

export class LiquityBProtocolAdapter {
  private readonly bammPools = [
    '0x00ff66ab8699aafa050ee5ef5041d1503aa0849a',
    '0x0d3abaa7e088c2c82f54b2f47613da438ea8c598',
    '0x54bc9113f1f55cdbdf221daf798dc73614f6d972',
  ];

  constructor(
    @Inject(BProtocolContractFactory) private readonly bProtocolContractFactory: BProtocolContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getBalances(address: string): Promise<ProductItem | null> {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const bammLensAddress = '0xfae2e2d3f11bab10ee0ddd0332f6dfe957414ccb';
    const contract = this.bProtocolContractFactory.bProtocolBammLens({ address: bammLensAddress, network });
    const wrappedContract = multicall.wrap(contract);

    const liquityBalancesRaw = await Promise.all(
      this.bammPools.map(async pool => {
        const userDeposits = await wrappedContract.getUserDeposit(address, pool);
        const lusdToken = baseTokens.find(p => p.symbol === 'LUSD');
        const ethToken = baseTokens.find(p => p.symbol === 'ETH');
        if (!lusdToken || !ethToken) return null;

        return [
          { token: lusdToken, balanceRaw: userDeposits.lusd },
          { token: ethToken, balanceRaw: userDeposits.eth },
        ].map(({ token, balanceRaw }) => {
          const tokenBalance = drillBalance(token, balanceRaw.toString());

          const contractPositionBalance: ContractPositionBalance = {
            type: ContractType.POSITION,
            address: bammLensAddress,
            appId,
            groupId,
            network,
            tokens: [tokenBalance],
            balanceUSD: tokenBalance.balanceUSD,
            dataProps: {},
            displayProps: {
              label: `Deposited ${token.symbol} in Liquity`,
              secondaryLabel: buildDollarDisplayItem(token.price),
              images: [getTokenImg(token.address, network)],
            },
          };

          return contractPositionBalance;
        });
      }),
    );

    const liquityBalances = _.compact(liquityBalancesRaw);

    return {
      label: 'Liquity',
      assets: liquityBalances.flat(),
      meta: [],
    };
  }
}
