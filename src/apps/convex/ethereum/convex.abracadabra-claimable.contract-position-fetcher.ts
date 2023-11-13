import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { ConvexViemContractFactory } from '../contracts';
import { ConvexAbracadabraWrapper } from '../contracts/viem';

export const ABRACADABRA_WRAPPERS = [
  '0x5958a8db7dfe0cc49382209069b00f54e17929c2', // stk-tricrypto2
  '0xd92494cb921e5c0d3a39ea88d0147bbd82e51008', // stk-cvx3pool [DEPRECATED]
  '0x3ba207c25a278524e1cc7faaea950753049072a4', // stk-cvx3pool
];

@PositionTemplate()
export class EthereumConvexAbracadabraClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ConvexAbracadabraWrapper> {
  groupLabel = 'Abracadabra Rewards';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexViemContractFactory) protected readonly convexContractFactory: ConvexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.convexContractFactory.convexAbracadabraWrapper({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [
      { address: '0x5958a8db7dfe0cc49382209069b00f54e17929c2' }, // stk-tricrypto2
      { address: '0xd92494cb921e5c0d3a39ea88d0147bbd82e51008' }, // stk-cvx3pool [DEPRECATED]
      { address: '0x3ba207c25a278524e1cc7faaea950753049072a4' }, // stk-cvx3pool
    ];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<ConvexAbracadabraWrapper>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.convexToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<ConvexAbracadabraWrapper>) {
    const convexToken = contractPosition.tokens.find(isSupplied)!;
    return `Claimable Rewards for Abracadabra ${getLabelFromToken(convexToken)} Cauldron`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<ConvexAbracadabraWrapper>) {
    return contractPosition.tokens.filter(isClaimable).flatMap(v => getImagesFromToken(v));
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<ConvexAbracadabraWrapper>) {
    const earned = await contract.read.earned([address]);
    const [{ amount: crvBalanceRaw }, { amount: cvxBalanceRaw }] = earned;
    return [0, crvBalanceRaw, cvxBalanceRaw];
  }
}
