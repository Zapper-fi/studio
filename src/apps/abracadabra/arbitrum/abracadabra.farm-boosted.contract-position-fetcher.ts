import { Inject } from '@nestjs/common';
import { compact, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { AbracadabraViemContractFactory } from '../contracts';
import { AbracadabraFarmBoosted } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumAbracadabraFarmBoostedContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AbracadabraFarmBoosted> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraViemContractFactory) protected readonly contractFactory: AbracadabraViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.abracadabraFarmBoosted({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x6d2070b13929df15b13d96cfc509c574168988cd' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<AbracadabraFarmBoosted>) {
    const rewardTokenAddressesRaw = await Promise.all(
      range(0, 2).map(i => {
        return contract.read.rewardTokens([BigInt(i)]).catch(err => {
          if (isViemMulticallUnderlyingError(err)) return null;
        });
      }),
    );
    const rewardTokenAddresses = compact(rewardTokenAddressesRaw);
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.stakingToken(),
        network: this.network,
      },
      ...rewardTokenAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AbracadabraFarmBoosted>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<AbracadabraFarmBoosted>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    const claimables = await Promise.all(rewardTokens.map(v => contract.read.earned([address, v.address])));

    const supplied = await contract.read.balanceOf([address]);

    return [supplied, ...claimables];
  }
}
