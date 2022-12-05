import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { StakeDaoContractFactory } from '../contracts';

export const LOCKERS = [
  {
    tokenAddress: '0x402f878bdd1f5c66fdaf0fababcf74741b68ac36', // sdFXS
    underlyingTokenAddress: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0', // FXS
    poolAddress: '0x8c524635d52bd7b1bd55e062303177a7d916c046',
    gaugeAddress: '0xf3c6e8fbb946260e8c2a55d48a5e01c82fd63106',
  },
  {
    tokenAddress: '0xd1b5651e55d4ceed36251c61c50c889b36f6abb5', // sdCRV
    underlyingTokenAddress: '0xd533a949740bb3306d119cc777fa900ba034cd52', // CRV
    poolAddress: '0xf7b55c3732ad8b2c2da7c24f30a69f55c54fb717',
    gaugeAddress: '0x7f50786a0b15723d741727882ee99a0bf34e3466',
  },
  {
    tokenAddress: '0x752b4c6e92d96467fe9b9a2522ef07228e00f87c', // sdANGLE
    underlyingTokenAddress: '0x31429d1856ad1377a8a0079410b297e1a9e214c2', // ANGLE
    poolAddress: '0x48ff31bbbd8ab553ebe7cbd84e1ea3dba8f54957',
    gaugeAddress: '0xe55843a90672f7d8218285e51ee8ff8e233f35d5',
  },
  {
    tokenAddress: '0xf24d8651578a55b0c119b9910759a351a3458895', // sdBAL
    underlyingTokenAddress: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56', // Balancer 80BAL-20WETH
    gaugeAddress: '0x3e8c72655e48591d93e6dfda16823db0ff23d859',
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

  async getUnderlyingTokenAddresses({ address }: GetUnderlyingTokensParams<Erc20>): Promise<string | string[]> {
    return LOCKERS.find(v => v.tokenAddress == address)!.underlyingTokenAddress;
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<Erc20>) {
    // Lockers are minted 1:1; if an exchange market exists in Curve, use it to derive the price
    const locker = LOCKERS.find(v => v.tokenAddress == appToken.address)!;
    if (!locker.poolAddress) return 1;

    const pool = this.contractFactory.stakeDaoCurvePool({ address: locker.poolAddress, network: this.network });
    const token0 = await multicall.wrap(pool).coins(0);
    const knownIndex = locker.underlyingTokenAddress === token0.toLowerCase() ? 0 : 1;
    const amount = new BigNumber(1e18).toFixed(0);

    const pricePerShareRaw = await multicall.wrap(pool).get_dy(1 - knownIndex, knownIndex, amount);
    return Number(pricePerShareRaw) / 10 ** 18;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Erc20>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<Erc20>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
