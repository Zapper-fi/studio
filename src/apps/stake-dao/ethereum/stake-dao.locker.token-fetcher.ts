import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, GetPricePerShareParams } from '~position/template/app-token.template.types';

import { StakeDaoContractFactory } from '../contracts';

export const LOCKERS = [
  {
    tokenAddress: '0xd1b5651e55d4ceed36251c61c50c889b36f6abb5', // sdCRV
    underlyingTokenAddress: '0xd533a949740bb3306d119cc777fa900ba034cd52', // CRV
    poolAddress: '0xf7b55c3732ad8b2c2da7c24f30a69f55c54fb717',
    gaugeAddress: '0x7f50786a0b15723d741727882ee99a0bf34e3466',
  },
  {
    tokenAddress: '0x5ea630e00d6ee438d3dea1556a110359acdc10a9', // sdPENDLE
    underlyingTokenAddress: '0x808507121b80c02388fad14726482e061b8da827', // PENDLE
    poolAddress: '0x26f3f26f46cbee59d1f8860865e13aa39e36a8c0',
    gaugeAddress: '0x50dc9ae51f78c593d4138263da7088a973b8184e',
  },
  {
    tokenAddress: '0xf24d8651578a55b0c119b9910759a351a3458895', // sdBAL
    underlyingTokenAddress: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56', // Balancer 80BAL-20WETH
    gaugeAddress: '0x3e8c72655e48591d93e6dfda16823db0ff23d859',
  },
  {
    tokenAddress: '0x402f878bdd1f5c66fdaf0fababcf74741b68ac36', // sdFXS
    underlyingTokenAddress: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0', // FXS
    poolAddress: '0x71c91b173984d3955f7756914bbf9a7332538595',
    gaugeAddress: '0xf3c6e8fbb946260e8c2a55d48a5e01c82fd63106',
  },
  {
    tokenAddress: '0x334cb66050049c1e392007b018321c44a1dbfac4', // sdFPIS
    underlyingTokenAddress: '0xc2544a32872a91f4a553b404c6950e89de901fdb', // FPIS
    poolAddress: '0x06c21b5d004604250a7f9639c4a3c28e73742261',
    gaugeAddress: '0xe58101d3848e12dad6d7b5981dc11411bb267d2f',
  },
  {
    tokenAddress: '0x97983236be88107cc8998733ef73d8d969c52e37', // sdYFI
    underlyingTokenAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', // YFI
    poolAddress: '0x852b90239c5034b5bb7a5e54ef1bef3ce3359cc8',
    gaugeAddress: '0x5adf559f5d24aacbe4fa3a3a4f44fdc7431e6b52',
  },
  {
    tokenAddress: '0x752b4c6e92d96467fe9b9a2522ef07228e00f87c', // sdANGLE
    underlyingTokenAddress: '0x31429d1856ad1377a8a0079410b297e1a9e214c2', // ANGLE
    poolAddress: '0x96aae323e111a19b1e0e26f55e8de21f1dd01f26',
    gaugeAddress: '0xe55843a90672f7d8218285e51ee8ff8e233f35d5',
  },
  {
    tokenAddress: '0x26f01fe3be55361b0643bc9d5d60980e37a2770d', // sdAPW
    underlyingTokenAddress: '0x4104b135dbc9609fc1a9490e61369036497660c8', // APW
    poolAddress: '0x6788f608cfe5cfcd02e6152ec79505341e0774be',
    gaugeAddress: '0x9c9d06c7378909c6d0a2a0017bb409f7fb8004e0',
  },
  {
    tokenAddress: '0x825ba129b3ea1ddc265708fcbb9dd660fdd2ef73', // sdBPT
    underlyingTokenAddress: '0x0ec9f76202a7061eb9b3a7d6b59d36215a7e37da', // BPT
    poolAddress: '0x9d259ca698746586107c234e9e9461d385ca1041',
    gaugeAddress: '0xa291faeef794df6216f196a63f514b5b22244865',
  },
];

@PositionTemplate()
export class EthereumStakeDaoLockerTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'Lockers';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoContractFactory) protected readonly contractFactory: StakeDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network });
  }

  getAddresses() {
    return LOCKERS.map(v => v.tokenAddress);
  }

  async getUnderlyingTokenDefinitions({ address }: GetUnderlyingTokensParams<Erc20>) {
    return [{ address: LOCKERS.find(v => v.tokenAddress == address)!.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<Erc20>) {
    // Lockers are minted 1:1; if an exchange market exists in Curve, use it to derive the price
    const locker = LOCKERS.find(v => v.tokenAddress == appToken.address)!;
    if (!locker.poolAddress) return [1];

    const pool = this.contractFactory.stakeDaoCurvePool({ address: locker.poolAddress, network: this.network });
    const token0 = await multicall.wrap(pool).coins(0);
    const knownIndex = locker.underlyingTokenAddress === token0.toLowerCase() ? 0 : 1;
    const amount = new BigNumber(1e18).toFixed(0);

    const pricePerShareRaw = await multicall.wrap(pool).get_dy(1 - knownIndex, knownIndex, amount);
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return [pricePerShare];
  }
}
