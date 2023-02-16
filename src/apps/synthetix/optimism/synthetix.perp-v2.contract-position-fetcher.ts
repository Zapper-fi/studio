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

export const PERP_V2_MARKET_ADDRESSES = [
  { address: '0x5374761526175b59f1e583246e20639909e189ce' },
  { address: '0x5b6beb79e959aac2659bee60fe0d0885468bf886' },
  { address: '0xbb16c7b3244dfa1a6bf83fcce3ee4560837763cd' },
  { address: '0x9de146b5663b82f44e5052dede2aa3fd4cbcdc99' },
  { address: '0xc203a12f298ce73e44f7d45a4f59a43dbffe204d' },
  { address: '0x3a52b21816168dfe35be99b7c5fc209f17a0adb1' },
  { address: '0x0940b0a96c5e1ba33aee331a9f950bb2a6f2fb25' },
  { address: '0x59b007e9ea8f89b069c43f8f45834d30853e3699' },
  { address: '0x98ccbc721cc05e28a125943d69039b39be6a21e9' },
  { address: '0x139f94e4f0e1101c1464a321cba815c34d58b5d9' },
  { address: '0x2b3bb4c683bfc5239b029131eef3b1d214478d93' },
  { address: '0x87ae62c5720dab812bdacba66cc24839440048d1' },
  { address: '0x27665271210acff4fab08ad9bb657e91866471f0' },
  { address: '0xc18f85a6dd3bcd0516a1ca08d3b1f0a4e191a2c4' },
  { address: '0x1dad8808d8ac58a0df912adc4b215ca3b93d6c49' },
  { address: '0x31a1659ca00f617e86dc765b6494afe70a5a9c1a' },
  { address: '0x074b8f19fc91d6b2eb51143e1f186ca0ddb88042' },
  { address: '0xc8fcd6fb4d15dd7c455373297def375a08942ece' },
  { address: '0x442b69937a0daf9d46439a71567fabe6cb69fbaf' },
  { address: '0x0ea09d97b4084d859328ec4bf8ebcf9ecca26f1d' },
  { address: '0x4308427c463caeaab50fff98a9dec569c31e4e87' },
  { address: '0xdcb8438c979fa030581314e5a5df42bbfed744a0' },
  { address: '0x549dbdffbd47bd5639f9348ebe82e63e2f9f777a' },
];

@PositionTemplate()
export class OptimismSynthetixPerpV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SynthetixPerpV2> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly contractFactory: SynthetixContractFactory,
  ) {
    super(appToolkit);
  }
  groupLabel = 'PerpV2';

  getContract(address: string): SynthetixPerpV2 {
    return this.contractFactory.synthetixPerpV2({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return PERP_V2_MARKET_ADDRESSES;
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
    return `${baseAsset}-PERP`;
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
