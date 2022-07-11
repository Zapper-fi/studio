import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

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
      '0xfc8f9eefC5FCe1D9dAcE2B0a11A1e184381787C4',
      '0x5efE48F8383921d950683C46B87E28e21DEa9FB5',
      '0x98fDBC5497599eFF830923ea1EE152Adb9a4cEA5',
      '0x4121a258674e507c990cDF390F74d4EF27592114',
      '0xB924497a1157B1F8835c93cb7F3d4Aa6D2f227BA',
    ];

    const perps = await Promise.all(
      perpetualManagers.map(async perpetualManager => {
        const perpContract = this.angleContractFactory.anglePerpetualManager({
          address: perpetualManager,
          network,
        });

        const [symbol, poolManager, baseURI] = await Promise.all([
          multicall.wrap(perpContract).symbol(),
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

        const position = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: perpetualManager,
          network,
          symbol,
          tokens: [supplied(underlyingToken)],
          dataProps: {
            baseURI,
          },
          displayProps: {
            label: getLabelFromToken(underlyingToken),
            images: getImagesFromToken(underlyingToken),
          },
        } as ContractPosition;
        return position;
      }),
    );

    return compact(perps);
  }
}
