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
} from '~position/template/contract-position.template.types';

import { CleverContractFactory, CleverGauge } from '../contracts';

import { CLEV } from './addresses';

export type CleverFarmingContractPositionDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumCleverFarmingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  CleverGauge,
  DefaultDataProps,
  CleverFarmingContractPositionDefinition
> {
  groupLabel = 'Farming';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) protected readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CleverGauge {
    return this.contractFactory.cleverGauge({ address, network: this.network });
  }

  async getDefinitions(): Promise<CleverFarmingContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const gaugeAddresses = [
      '0xc5022291ca8281745d173bb855dcd34dda67f2f0', // abcCVX
      '0x86e917ad6cb44f9e6c8d9fa012acf0d0cfcf114f', // CLEV/ETH
    ];

    const definitions = await Promise.all(
      gaugeAddresses.map(async address => {
        const cleverGaugeContract = this.contractFactory.cleverGauge({ address, network: this.network });
        const lpTokenAddress = await multicall.wrap(cleverGaugeContract).lp_token();
        return {
          address,
          underlyingTokenAddress: lpTokenAddress.toLowerCase(),
        };
      }),
    );

    return definitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<CleverGauge, CleverFarmingContractPositionDefinition>) {
    return Promise.all([
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: CLEV,
        network: this.network,
      },
    ]);
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<CleverGauge>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<CleverGauge>) {
    const [supplied, claimable] = await Promise.all([contract.balanceOf(address), contract.claimable_tokens(address)]);

    return [supplied, claimable];
  }
}
