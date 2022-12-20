import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { VaporwaveFinanceContractFactory, VaporwaveLaunchpool } from '../contracts';

const FARMS = [
  {
    address: '0x586009baa80010833637f4c371bca2496ea70225',
    underlyingTokenAddress: '0x2451db68ded81900c4f16ae1af597e9658689734',
    rewardTokenAddress: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
  },
  {
    address: '0x1a753380e261f0eaffd7282ec978d90b4d3ce31e',
    underlyingTokenAddress: '0xfd3fda44cd7f1ea9e9856b56d21f64fc1a417b8e',
    rewardTokenAddress: '0x2451db68ded81900c4f16ae1af597e9658689734',
  },
];

export type VaporwaveFinanceVaultDefinition = {
  address: string;
  underlyingTokenAddress: string;
  rewardTokenAddress: string;
};

@PositionTemplate()
export class AuroraVaporwaveFinanceFarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  VaporwaveLaunchpool,
  DefaultDataProps,
  VaporwaveFinanceVaultDefinition
> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VaporwaveFinanceContractFactory) protected readonly contractFactory: VaporwaveFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VaporwaveLaunchpool {
    return this.contractFactory.vaporwaveLaunchpool({ address, network: this.network });
  }

  async getDefinitions(): Promise<VaporwaveFinanceVaultDefinition[]> {
    return FARMS;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<VaporwaveLaunchpool, VaporwaveFinanceVaultDefinition>): Promise<
    UnderlyingTokenDefinition[]
  > {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<VaporwaveLaunchpool>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<VaporwaveLaunchpool>) {
    const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
      contract.balanceOf(address),
      contract.earned(address),
    ]);
    return [stakedBalanceRaw, rewardBalanceRaw];
  }
}
