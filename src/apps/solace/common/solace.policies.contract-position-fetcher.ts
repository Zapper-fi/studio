import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { SolaceContractFactory, SolaceCoverProductV3 } from '../contracts';

export abstract class SolacePoliciesContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SolaceCoverProductV3> {
  abstract solaceCoverAddress: string;
  abstract daiAddress: string;
  abstract solaceCoverPointAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) protected readonly contractFactory: SolaceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SolaceCoverProductV3 {
    return this.contractFactory.solaceCoverProductV3({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: this.solaceCoverAddress }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: this.daiAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contract }: GetDisplayPropsParams<SolaceCoverProductV3>) {
    return contract.name();
  }

  async getTokenBalancesPerPosition({ address, contract, multicall }: GetTokenBalancesParams<SolaceCoverProductV3>) {
    const policyId = await contract.policyOf(address);
    if (Number(policyId) == 0) return [0];

    const solaceCoverPointContract = this.contractFactory.erc20({
      address: this.solaceCoverPointAddress,
      network: this.network,
    });

    const balance = await multicall.wrap(solaceCoverPointContract).balanceOf(address);

    return [balance];
  }
}
