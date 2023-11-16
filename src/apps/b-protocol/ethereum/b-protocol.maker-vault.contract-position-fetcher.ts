import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MakerViemContractFactory } from '~apps/maker/contracts';
import { MakerGemJoin } from '~apps/maker/contracts/viem';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { BProtocolViemContractFactory } from '../contracts';

export type BProtocolVaultDefinition = {
  address: string;
  ilk: string;
  ilkName: string;
  collateralTokenAddress: string;
};

export type BProtocolVaultDataProps = {
  ilk: string;
  ilkName: string;
  cRatio?: number;
  cdpId?: number;
};

@PositionTemplate()
export class EthereumBProtocolMakerVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  MakerGemJoin,
  BProtocolVaultDataProps,
  BProtocolVaultDefinition
> {
  groupLabel = 'Maker Vaults';

  private readonly BCDP_MANGER = '0x3f30c2381cd8b917dd96eb2f1a4f96d91324bbed';
  private readonly CDP_MANAGER = '0x5ef30b9986345249bc32d8928b7ee64de9435e39';
  private readonly GET_CDPS = '0x36a724bd100c39f0ea4d3a20f7097ee01a8ff573';
  private readonly MCD_VAT = '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b';
  private readonly MCD_SPOT = '0x65c79fcb50ca1594b025960e539ed7a9a6d434a3';
  private readonly PROXY_REGISTRY = '0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4';
  private readonly JAR = '0x3c36ccf03dab88c1b1ac1eb9c3fb5db0b6763cff';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MakerViemContractFactory) protected readonly makerContractFactory: MakerViemContractFactory,
    @Inject(BProtocolViemContractFactory) protected readonly bProtocolContractFactory: BProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.makerContractFactory.makerGemJoin({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<BProtocolVaultDefinition[]> {
    const supportedIlks = [
      '0x4554482d41000000000000000000000000000000000000000000000000000000', // ETH-A
      '0x4554482d42000000000000000000000000000000000000000000000000000000', // ETH-B
      '0x4554482d43000000000000000000000000000000000000000000000000000000', // ETH-C
      '0x574254432d410000000000000000000000000000000000000000000000000000', // WBTC-A
    ];

    const ilkRegAddress = '0x5a464c28d19848f44199d003bef5ecc87d090f87';
    const ilkRegContract = this.makerContractFactory.makerIlkRegistry({
      address: ilkRegAddress,
      network: this.network,
    });

    const definitions = await Promise.all(
      supportedIlks.map(async ilk => {
        const [gem, join] = await Promise.all([
          multicall.wrap(ilkRegContract).read.gem([ilk]),
          multicall.wrap(ilkRegContract).read.join([ilk]),
        ]);

        const ilkName = ethers.utils.parseBytes32String(ilk);
        const address = join.toLowerCase();
        const collateralTokenAddress = gem.toLowerCase();
        return { address, ilkName, collateralTokenAddress, ilk };
      }),
    );

    return definitions;
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<MakerGemJoin, BProtocolVaultDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.collateralTokenAddress, network: this.network },
      { metaType: MetaType.BORROWED, address: '0x6b175474e89094c44da98b954eedeac495271d0f', network: this.network },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<MakerGemJoin, BProtocolVaultDataProps, BProtocolVaultDefinition>) {
    return { ilkName: definition.ilkName, ilk: definition.ilk };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<MakerGemJoin, BProtocolVaultDataProps, BProtocolVaultDefinition>) {
    return `${contractPosition.dataProps.ilkName} Vault`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MakerGemJoin, BProtocolVaultDataProps>) {
    const infoContractAddress = '0x468960199c8045dedcf6aeb33e28dc57346ad3ff';
    const infoContract = this.bProtocolContractFactory.bProtocolGetInfo({
      address: infoContractAddress,
      network: this.network,
    });

    const { result: userInfo } = await multicall
      .wrap(infoContract)
      .simulate.getInfo([
        address,
        contractPosition.dataProps.ilk,
        this.BCDP_MANGER,
        this.CDP_MANAGER,
        this.GET_CDPS,
        this.MCD_VAT,
        this.MCD_SPOT,
        this.PROXY_REGISTRY,
        this.JAR,
      ]);

    const debt = userInfo.bCdpInfo.daiDebt.toString();
    const collateral = new BigNumber(userInfo.bCdpInfo.ethDeposit.toString())
      .times(10 ** contractPosition.tokens[0].decimals)
      .div(10 ** 18)
      .toString();

    return [collateral, debt];
  }
}
