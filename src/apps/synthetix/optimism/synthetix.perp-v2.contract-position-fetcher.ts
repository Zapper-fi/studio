import { Inject } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SynthetixContractFactory, SynthetixPerpV2 } from '../contracts';

@PositionTemplate()
export class OptimismSynthetixPerpV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SynthetixPerpV2> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }
  groupLabel = 'Perp v2';

  getContract(address: string): SynthetixPerpV2 {
    return this.contractFactory.synthetixPerpV2({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xa1245e5b52555e40aa8a3ffb95c5c426c7c7ef12' }];
  }

  async getTokenDefinitions() {
    return [
      {
        address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', // sUSD
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  private async getBaseAsset({ contractPosition }) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contract = multicall.wrap(this.getContract(contractPosition.address));
    const baseAssetRaw = await contract.baseAsset();
    let baseAsset = parseBytes32String(baseAssetRaw);
    //some market use legacy naming starting with an "s"
    if (baseAsset.charAt(0) === 's') {
      baseAsset = baseAsset.substring(1);
    }
    return baseAsset;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SynthetixPerpV2>): Promise<string> {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    const marginType = this.groupId;
    return `${baseAsset}-PERP (${marginType})`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<SynthetixPerpV2>) {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    return [getAppAssetImage('synthetix', `s${baseAsset}`)];
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<SynthetixPerpV2>) {
    const remainingMargin = await contract.remainingMargin(address);
    return [remainingMargin.marginRemaining];
  }
}
