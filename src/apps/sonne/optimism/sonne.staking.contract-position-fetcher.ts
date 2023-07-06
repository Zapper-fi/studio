import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SonneContractFactory } from '../contracts';
import { SonneStakedSonne } from '../contracts/ethers/SonneStakedSonne';

export type SonneStakingContractPositionDefinition = {
  address: string;
  underlyingTokenAddress: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class OptimismSonneStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SonneStakedSonne> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SonneContractFactory) protected readonly contractFactory: SonneContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SonneStakedSonne {
    return this.contractFactory.sonneStakedSonne({ address, network: this.network });
  }

  async getDefinitions(): Promise<SonneStakingContractPositionDefinition[]> {
    return [
      {
        address: '0xdc05d85069dc4aba65954008ff99f2d73ff12618',
        underlyingTokenAddress: '0x1db2466d9f5e10d7090e7152b68d62703a2245f0',
        rewardTokenAddresses: [
          '0x1db2466d9f5e10d7090e7152b68d62703a2245f0',
          '0x3c8b650257cfb5f272f799f5e2b4e65093a11a05',
          '0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db',
          '0x4200000000000000000000000000000000000042',
        ],
      },
      {
        address: '0x41279e29586eb20f9a4f65e031af09fced171166',
        underlyingTokenAddress: '0x1db2466d9f5e10d7090e7152b68d62703a2245f0',
        rewardTokenAddresses: [
          '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
          '0x3c8b650257cfb5f272f799f5e2b4e65093a11a05',
          '0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db',
          '0x4200000000000000000000000000000000000042',
        ],
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SonneStakedSonne, SonneStakingContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
      ...definition.rewardTokenAddresses.map(address => {
        return {
          metaType: MetaType.CLAIMABLE,
          address,
          network: this.network,
        };
      }),
    ];
  }

  async getLabel({ contract }: GetDisplayPropsParams<SonneStakedSonne>) {
    return `${await contract.symbol()}`;
  }

  async getTokenBalancesPerPosition({ address, contract, contractPosition }: GetTokenBalancesParams<SonneStakedSonne>) {
    const rewardToken = contractPosition.tokens.filter(isClaimable);
    if (!rewardToken) return [0, 0, 0, 0, 0];

    const supplied = await contract.balanceOf(address);
    const rewards = await Promise.all(
      rewardToken.map(token => {
        return contract.getClaimable(token.address, address);
      }),
    );

    return [supplied, ...rewards];
  }
}
