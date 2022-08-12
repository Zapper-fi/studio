import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LooksRareContractFactory } from '../contracts';
import { LOOKS_RARE_DEFINITION } from '../looks-rare.definition';

export type LooksRareCompounderContractPositionDataProps = {
  liquidity: number;
  reserve: number;
};

const appId = LOOKS_RARE_DEFINITION.id;
const groupId = LOOKS_RARE_DEFINITION.groups.compounder.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLooksRareCompounderContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LooksRareContractFactory) private readonly looksRareContractFactory: LooksRareContractFactory,
  ) {}

  async getPositions() {
    const network = Network.ETHEREUM_MAINNET;
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    const compounderAddress = '0x3ab16af1315dc6c95f83cbf522fecf98d00fd9ba';
    const compounderContract = this.looksRareContractFactory.looksRareFeeSharing({
      address: compounderAddress,
      network,
    });

    const [depositTokenAddressRaw, reserveRaw] = await Promise.all([
      multicall.wrap(compounderContract).looksRareToken(),
      multicall.wrap(compounderContract).totalShares(),
    ]);

    const depositToken = await tokenSelector.getOne({ address: depositTokenAddressRaw.toLowerCase(), network });
    if (!depositToken) return [];

    const reserve = Number(reserveRaw) / 10 ** depositToken.decimals;
    const liquidity = reserve * depositToken.price;
    const tokens = [supplied(depositToken)];

    const position: ContractPosition<LooksRareCompounderContractPositionDataProps> = {
      type: ContractType.POSITION,
      address: compounderAddress,
      appId: LOOKS_RARE_DEFINITION.id,
      groupId: LOOKS_RARE_DEFINITION.groups.compounder.id,
      network: network,
      tokens: tokens,
      dataProps: {
        liquidity,
        reserve,
      },
      displayProps: {
        label: `${getLabelFromToken(depositToken)} Compounder`,
        images: getImagesFromToken(depositToken),
        statsItems: [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(liquidity),
          },
        ],
      },
    };

    return [position];
  }
}
