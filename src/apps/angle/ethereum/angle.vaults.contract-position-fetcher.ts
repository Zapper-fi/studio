import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory } from '../contracts';

const vaultAddresses = [
  '0x241d7598bd1eb819c0e9ded456acb24aca623679', // wBTC
  '0x1bece8193f8dc2b170135da9f1fa8b81c7ad18b1', // wETH
  '0x73aaf8694ba137a7537e7ef544fcf5e2475f227b', // wsETH
];

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.vaults.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAngleVaultsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const positions = await Promise.all(
      vaultAddresses.map(async address => {
        const angleVaultContract = this.angleContractFactory.angleVaultManager({
          address,
          network,
        });

        const [baseFactor, collateralTokenAddressRaw, stableTokenAddressRaw, totalDebtRaw, collateralFactorRaw] =
          await Promise.all([
            multicall.wrap(angleVaultContract).BASE_PARAMS(),
            multicall.wrap(angleVaultContract).collateral(),
            multicall.wrap(angleVaultContract).stablecoin(),
            multicall.wrap(angleVaultContract).getTotalDebt(),
            multicall.wrap(angleVaultContract).collateralFactor(),
          ]);

        const collateralToken = baseTokens.find(v => v.address === collateralTokenAddressRaw.toLowerCase());
        const stableToken = baseTokens.find(v => v.address === stableTokenAddressRaw.toLowerCase());
        if (!collateralToken || !stableToken) return null;

        const totalDebt = Number(totalDebtRaw) / 10 ** collateralToken.decimals;
        const maxLTV = Number(collateralFactorRaw) / Number(baseFactor);

        const collateralTokenContract = this.angleContractFactory.erc20({
          address: collateralTokenAddressRaw.toLowerCase(),
          network,
        });

        const [balanceOfRaw, decimals] = await Promise.all([
          multicall.wrap(collateralTokenContract).balanceOf(address),
          multicall.wrap(collateralTokenContract).decimals(),
        ]);

        const totalCollateral = Number(balanceOfRaw) / 10 ** decimals;

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address,
          network,
          tokens: [supplied(collateralToken), borrowed(stableToken)],
          dataProps: {
            totalDebt,
            totalCollateral,
            maxLTV,
          },
          displayProps: {
            label: getLabelFromToken(collateralToken),
            images: [...getImagesFromToken(collateralToken), ...getImagesFromToken(stableToken)],
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }
}
