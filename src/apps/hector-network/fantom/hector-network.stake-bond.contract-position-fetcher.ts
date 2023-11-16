import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { HectorNetworkViemContractFactory } from '../contracts';
import { HectorNetworkStakeBondDepository } from '../contracts/viem';

@PositionTemplate()
export class FantomHectorNetworkStakeBondContractPositionFetcher extends ContractPositionTemplatePositionFetcher<HectorNetworkStakeBondDepository> {
  groupLabel = 'Bonds';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkViemContractFactory) protected readonly contractFactory: HectorNetworkViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return [
      { address: '0x23337b675375507ce218df5f92f1a71252dab3e5' },
      { address: '0xd0373f236be04ecf08f51fc4e3ade7159d7cde65' },
      { address: '0x8565f642180fe388f942460b66aba9c2ca7f02ed' },
      { address: '0xc798e6a22996c554739df607b7ef1d6d435fdbd9' },
      { address: '0x09eb3b10a13dd705c17ced39c35aeea0d419d0bb' },
      { address: '0xff40f40e376030394b154dadcb4173277633b405' },
      { address: '0xff6508aba1dad81aacf3894374f291f82dc024a8' },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.hectorNetworkStakeBondDepository({ address, network: this.network });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<HectorNetworkStakeBondDepository>) {
    const [principle, claimable] = await Promise.all([contract.read.principle(), contract.read.sHEC()]);

    return [
      {
        metaType: MetaType.VESTING,
        address: claimable,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: claimable,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: principle,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<HectorNetworkStakeBondDepository>) {
    return `${getLabelFromToken(contractPosition.tokens[2])} Bond`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<HectorNetworkStakeBondDepository>) {
    return getImagesFromToken(contractPosition.tokens[2]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<HectorNetworkStakeBondDepository>) {
    const [bondInfo, claimablePayout] = await Promise.all([
      multicall.wrap(contract).read.bondInfo([address]),
      multicall.wrap(contract).read.pendingPayoutFor([address]),
    ]);

    return [BigNumber.from(bondInfo[0]).sub(claimablePayout).toString(), claimablePayout.toString()];
  }
}
