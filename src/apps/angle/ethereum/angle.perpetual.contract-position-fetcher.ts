import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, utils } from 'ethers';
import { compact } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { AngleApiHelper } from '../common/angle.api';
import { AngleContractFactory, AnglePerpetualManager } from '../contracts';

@PositionTemplate()
export class EthereumAnglePerpetualsContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<AnglePerpetualManager> {
  groupLabel = 'Perpetuals';
  perpetualManagerAddresses = [
    '0xfc8f9eefc5fce1d9dace2b0a11a1e184381787c4',
    '0x5efe48f8383921d950683c46b87e28e21dea9fb5',
    '0x98fdbc5497599eff830923ea1ee152adb9a4cea5',
    '0x4121a258674e507c990cdf390f74d4ef27592114',
    '0xb924497a1157b1f8835c93cb7f3d4aa6d2f227ba',
  ];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) protected readonly contractFactory: AngleContractFactory,
    @Inject(AngleApiHelper) protected readonly angleApiHelper: AngleApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AnglePerpetualManager {
    return this.contractFactory.anglePerpetualManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return this.perpetualManagerAddresses.map(address => ({ address }));
  }

  async getTokenDefinitions({ contract, multicall }: GetTokenDefinitionsParams<AnglePerpetualManager>) {
    const poolManagerAddress = await contract.poolManager();
    const poolManager = this.contractFactory.anglePoolManager({ address: poolManagerAddress, network: this.network });
    return [{ metaType: MetaType.SUPPLIED, address: await multicall.wrap(poolManager).token(), network: this.network }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AnglePerpetualManager>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} / EUR Perp`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const { perpetuals } = await this.angleApiHelper.getUserPerpetuals(address, this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = perpetuals.map(perp => {
      const contractPosition = contractPositions.find(
        v => v.address.toLowerCase() === perp.perpetualManager.toLowerCase(),
      );
      if (!contractPosition) return null;

      const collateralToken = contractPosition!.tokens.find(isSupplied)!;

      const positionSize = BigNumber.from(perp.committedAmount);

      const tokens = [drillBalance(collateralToken, positionSize.toString())];
      const balance = positionSize.mul(utils.parseEther(collateralToken.price.toString())).div(utils.parseEther('1'));
      const balanceUSD = Number(utils.formatUnits(balance, collateralToken.decimals));

      return {
        ...contractPosition,
        balanceUSD,
        tokens,
      };
    });

    return compact(balances);
  }
}
