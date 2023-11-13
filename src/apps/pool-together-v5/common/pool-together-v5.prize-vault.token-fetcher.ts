import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc4626 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types';

import { PoolTogetherV5ViemContractFactory } from '../contracts';

export const PRIZE_VAULT_FACTORY_ADDRESSES: Partial<Record<Network, string>> = {
  [Network.OPTIMISM_MAINNET]: '0xf65fa202907d6046d1ef33c521889b54bde08081',
};

export abstract class PoolTogetherV5PrizeVaultTokenFetcher extends AppTokenTemplatePositionFetcher<Erc4626> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV5ViemContractFactory) private readonly contractFactory: PoolTogetherV5ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc4626({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(def => def.address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DefaultAppTokenDefinition[]> {
    const vaultFactoryAddress = PRIZE_VAULT_FACTORY_ADDRESSES[this.network]!;

    const vaultFactoryContract = this.contractFactory.poolTogetherV5VaultFactory({
      address: vaultFactoryAddress,
      network: this.network,
    });
    const vaultNumberRaw = await multicall.wrap(vaultFactoryContract).read.totalVaults();

    return Promise.all(
      range(0, Number(vaultNumberRaw)).map(async index => {
        const address = await multicall.wrap(vaultFactoryContract).read.allVaults([BigInt(index)]);
        return {
          address,
        };
      }),
    );
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Erc4626>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<Erc4626>) {
    const sampleAmount = BigNumber.from(10).pow(appToken.decimals).toString();
    const ratioRaw = await contract.read.convertToAssets([BigInt(sampleAmount)]);
    const ratio = Number(ratioRaw) / 10 ** appToken.decimals;
    return [ratio];
  }

  async getLiquidity({ contract, appToken }: GetDataPropsParams<Erc4626>) {
    const reserveRaw = await contract.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ contract, appToken }: GetDataPropsParams<Erc4626>) {
    const reserveRaw = await contract.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getLabel({ contract }: GetDisplayPropsParams<Erc4626>) {
    return contract.read.name();
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<Erc4626>) {
    return appToken.symbol;
  }
}
