import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory } from '../contracts';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.perpetuals.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAnglePerpetualsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const perpetualManagers = [
      '0xfc8f9eefc5fce1d9dace2b0a11a1e184381787c4',
      '0x5efe48f8383921d950683c46b87e28e21dea9fb5',
      '0x98fdbc5497599eff830923ea1ee152adb9a4cea5',
      '0x4121a258674e507c990cdf390f74d4ef27592114',
      '0xb924497a1157b1f8835c93cb7f3d4aa6d2f227ba',
    ];

    const perps = await Promise.all(
      perpetualManagers.map(async perpetualManager => {
        const perpContract = this.angleContractFactory.anglePerpetualManager({
          address: perpetualManager,
          network,
        });

        const [poolManager, baseURI] = await Promise.all([
          multicall.wrap(perpContract).poolManager(),
          multicall.wrap(perpContract).baseURI(),
        ]);

        const poolManagerContract = this.angleContractFactory.anglePoolManager({
          address: poolManager,
          network,
        });

        const underlyingTokenAddress = await multicall.wrap(poolManagerContract).token();
        const underlyingToken = baseTokenDependencies.find(
          v => v.address.toLowerCase() === underlyingTokenAddress.toLowerCase(),
        );

        if (!underlyingToken) return null;

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: perpetualManager,
          network,
          tokens: [supplied(underlyingToken)],
          dataProps: {
            baseURI,
          },
          displayProps: {
            label: `${getLabelFromToken(underlyingToken)}/EUR Perp`,
            images: getImagesFromToken(underlyingToken),
          },
        };

        return position;
      }),
    );

    return _.compact(perps);
  }
}
