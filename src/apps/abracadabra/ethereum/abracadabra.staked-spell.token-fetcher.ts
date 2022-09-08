import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory } from '../contracts';
import { AbracadabraStakedSpell } from '../contracts/ethers';

type AbracadabraStakedSpellAppTokenDataProps = {
  liquidity: number;
};

@Injectable()
export class EthereumAbracadabraStakedSpellTokenFetcher extends AppTokenTemplatePositionFetcher<
  AbracadabraStakedSpell,
  AbracadabraStakedSpellAppTokenDataProps
> {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Staked SPELL';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) protected readonly contractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AbracadabraStakedSpell {
    return this.contractFactory.abracadabraStakedSpell({ address, network: this.network });
  }

  getAddresses() {
    return ['0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9'];
  }

  getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<AbracadabraStakedSpell>) {
    return contract.token();
  }

  async getPricePerShare({
    appToken,
    multicall,
  }: GetPricePerShareParams<AbracadabraStakedSpell, AbracadabraStakedSpellAppTokenDataProps>) {
    const underlyingToken = appToken.tokens[0]!;
    const underlying = this.contractFactory.erc20(underlyingToken);
    const reserveRaw = await multicall.wrap(underlying).balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    return reserve / appToken.supply;
  }

  async getDataProps({
    appToken,
  }: GetDataPropsParams<AbracadabraStakedSpell, AbracadabraStakedSpellAppTokenDataProps>) {
    const liquidity = appToken.supply * appToken.price;
    return { liquidity };
  }
}
