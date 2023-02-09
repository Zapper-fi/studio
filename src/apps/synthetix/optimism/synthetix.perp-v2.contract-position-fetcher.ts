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
  groupLabel = 'Isolated';

  getContract(address: string): SynthetixPerpV2 {
    return this.contractFactory.synthetixPerpV2({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x8c14db69b1778c7bbb0683b2dea21f79b9b5f059' },
    { address: '0x74dccf74644485a6920d0cfe1a4d34b2f4216181' },
    { address: '0x407e5a7548869ce520354d8eca127754625cc9c8' },
    { address: '0x002089829127a5769db0d53372d5d53a4d1a87a2' },
    { address: '0x69d255473d0d15dc087cbf4962a65839aa28a2c5' },
    { address: '0x637340ce915a6e2eee7c02521ac334c30c219d0d' },
    { address: '0x857d91d6c63892b383cf10cd15285604ff9976b8' },
    { address: '0xb0a1d2c68bf4d0980402dc220ca6ddeb8dbfbc56' },
    { address: '0xea46a4dfa7d2767ff4bae2b76f5c6bd80057c723' },
    { address: '0x6aa31707bd6acf24063a806570160978e62752a0' },
    { address: '0x9363c080ca0b16ead12fd33aac65c8d0214e9d6d' },
    { address: '0x156e18b355b36ff3b9cb36bcaaf3155d95d3319a' },
    { address: '0x0965efeb0579c9bf8d15a77a4f14ec623421d902' },
    { address: '0x0868d8421b6c4f13b392ea4b72f8012884c45b74' },
    { address: '0x1fb664858da319b68fc5f6d47dd6ca0d994055a2' },
    { address: '0xcd077eab8efbcb94aa04f2055d7a9216f23697a6' },
    { address: '0xf23c5ec62ec4398302efd84587eb8ba26f21b155' },
    { address: '0x1eaed534ee8d25da73a4e21cde96e4fca9c46187' },
    { address: '0x423ddc17a01e3e44a0bd125ec2f645b8b9ad3259' },
    { address: '0x6ee44d9e0f868833a5543bcabc3bd1a7d843edb8' },
    { address: '0xda3a5e9502b23eaedc8cc048998893013e09787d' },
    { address: '0x9ab1f9b25b312f162e815a027b4805516401093e' },
    { address: '0xe05637e338b11640c51766304878b08181463413' }
    ];
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
