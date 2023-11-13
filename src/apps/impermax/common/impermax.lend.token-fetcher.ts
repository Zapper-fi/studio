import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { ImpermaxViemContractFactory } from '../contracts';
import { Borrowable } from '../contracts/viem';

const deprecatedMarkets = [
  '0xb7e5e74b52b9ada1042594cfd8abbdee506cc6c5', // ETH/IMX
  '0x8884cc766b43ca10ea41b30192324c77efdd04cd', // ETH/NYAN
  '0x82cde182702841dab46916738207123fe535909f', // ETH/USDC
  '0x4062f4775bc001595838fbaae38908b250ee07cf', // ETH/SWPR
  '0xcc5c1540683aff992201d8922df44898e1cc9806', // ETH/IMX
  '0xc48a16493b97bf90545793cf89884ede71aac39a', // ETH/LINK
  '0xd52c2e7feae13abbc9ac4861ef697f7210586696', // USDT/USDC
  '0x4fefa59353636c64c5950fd23c969cbaab5e7bba', // MKR/ETH
  '0xe965129938867a125f91a67e1b6d34d022bda569', // ETH/DAI
  '0xb8942a1c1bbb90272190269d42c2f1dff2fde3a4', // WBTC/ETH
];

export abstract class ImpermaxLendTokenFetcher extends AppTokenTemplatePositionFetcher<Borrowable> {
  abstract factoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxViemContractFactory) private readonly contractFactory: ImpermaxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.borrowable({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams): Promise<string[]> {
    const factoryContract = multicall.wrap(
      this.contractFactory.factory({ network: this.network, address: this.factoryAddress }),
    );

    const poolLength = await factoryContract.read.allLendingPoolsLength().then(length => Number(length));
    const collateralAddressesRaw = await Promise.all(
      _.range(poolLength).map(async i => {
        const poolAddress = await factoryContract.read.allLendingPools([BigInt(i)]);
        if (deprecatedMarkets.includes(poolAddress.toLowerCase())) return null;
        const [initialized, , , borrowable0, borrowable1] = await factoryContract.read.getLendingPool([poolAddress]);
        return initialized ? [borrowable0.toLowerCase(), borrowable1.toLowerCase()] : [];
      }),
    );

    const collateralAddresses = _.compact(collateralAddressesRaw);

    return _.flatten(collateralAddresses);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Borrowable>) {
    return [{ address: await contract.read.underlying(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<Borrowable>) {
    const [underlyingToken] = appToken.tokens;
    const exchangeRate = await contract.read.exchangeRateLast();

    return [Number(exchangeRate) / 10 ** underlyingToken.decimals];
  }

  async getReserves({ appToken, contract }: GetDataPropsParams<Borrowable>) {
    const marketRaw = await contract.read.totalBalance();
    const borrowAmountRaw = await contract.read.totalBorrows();
    const reservesRaw = Number(marketRaw) + Number(borrowAmountRaw);
    const reserves = reservesRaw / 10 ** appToken.tokens[0].decimals;

    return [reserves * appToken.tokens[0].price];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Borrowable>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
