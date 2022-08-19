import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Erc20 } from '~contract/contracts';
import {
  AppTokenTemplatePositionFetcher,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types';

import { StakeDaoContractFactory } from '../contracts';
import { STAKE_DAO_DEFINITION } from '../stake-dao.definition';

const appId = STAKE_DAO_DEFINITION.id;
const groupId = STAKE_DAO_DEFINITION.groups.locker.id;
const network = Network.ETHEREUM_MAINNET;

const LOCKERS = [
  {
    tokenAddress: '0x402f878bdd1f5c66fdaf0fababcf74741b68ac36',
    underlyingTokenAddress: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
    poolAddress: '0x8c524635d52bd7b1bd55e062303177a7d916c046',
  },
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStakeDaoLockerTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  appId = appId;
  groupId = groupId;
  network = network;

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

  async getUnderlyingTokenAddresses({ address }: UnderlyingTokensStageParams<Erc20>): Promise<string | string[]> {
    return LOCKERS.find(v => v.tokenAddress == address)!.underlyingTokenAddress;
  }

  async getPricePerShare({ appToken, multicall }: PricePerShareStageParams<Erc20>) {
    // Derive the price per share using the exchange rate on Curve
    const locker = LOCKERS.find(v => v.tokenAddress == appToken.address)!;
    const pool = this.contractFactory.stakeDaoCurvePool({ address: locker.poolAddress, network: this.network });

    const token0 = await multicall.wrap(pool).coins(0);
    const knownIndex = locker.underlyingTokenAddress === token0.toLowerCase() ? 0 : 1;
    const amount = new BigNumber(1e18).toFixed(0);

    const pricePerShareRaw = await multicall.wrap(pool).get_dy(1 - knownIndex, knownIndex, amount);
    return Number(pricePerShareRaw) / 10 ** 18;
  }
}
