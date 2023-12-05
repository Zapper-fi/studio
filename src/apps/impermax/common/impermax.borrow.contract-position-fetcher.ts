import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { ImpermaxViemContractFactory } from '../contracts';
import { Borrowable } from '../contracts/viem';

export abstract class ImpermaxBorrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Borrowable> {
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

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const factoryContract = multicall.wrap(
      this.contractFactory.factory({ network: this.network, address: this.factoryAddress }),
    );

    const poolLength = await factoryContract.read.allLendingPoolsLength().then(length => Number(length));
    const collateralAddresses = await Promise.all(
      _.range(poolLength).map(async i => {
        const poolAddress = await factoryContract.read.allLendingPools([BigInt(i)]);
        const [initialized, , , borrowable0, borrowable1] = await factoryContract.read.getLendingPool([poolAddress]);
        return initialized ? [borrowable0.toLowerCase(), borrowable1.toLowerCase()] : [];
      }),
    ).then(addresses => addresses.flat());

    return collateralAddresses.map(address => ({ address }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Borrowable>) {
    const underlyingAddress = await contract.read.underlying();
    return [
      {
        metaType: MetaType.BORROWED,
        address: underlyingAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Borrowable>): Promise<DisplayProps['label']> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getSecondaryLabel({
    contractPosition,
  }: GetDisplayPropsParams<Borrowable>): Promise<DisplayProps['secondaryLabel']> {
    const [underlyingToken] = contractPosition.tokens;
    return buildDollarDisplayItem(underlyingToken.price);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Borrowable>) {
    const balanceRaw = await contract.read.borrowBalance([address]);
    return [balanceRaw];
  }
}
