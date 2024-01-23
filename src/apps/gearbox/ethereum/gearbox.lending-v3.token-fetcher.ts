import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { GearboxViemContractFactory } from '../contracts';
import { GearboxLendingTokenV3 } from '../contracts/viem';

@PositionTemplate()
export class EthereumGearboxLendingV3TokenFetcher extends AppTokenTemplatePositionFetcher<GearboxLendingTokenV3> {
  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(GearboxViemContractFactory) private readonly gearboxContractFactory: GearboxViemContractFactory,
  ) {
    super(appToolkit);
  }

  groupLabel = 'Lending V3';

  getContract(address: string) {
    return this.gearboxContractFactory.gearboxLendingTokenV3({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DefaultAppTokenDefinition[]> {
    const contractsRegister = this.gearboxContractFactory.contractsRegister({
      address: '0xa50d4e7d8946a7c90652339cdbd262c375d54d99',
      network: this.network,
    });

    const poolAddresses = await multicall
      .wrap(contractsRegister)
      .read.getPools()
      .then(v => [...v]);

    const definitions = await Promise.all(
      poolAddresses.map(async poolAddress => {
        const contract = this.gearboxContractFactory.gearboxLendingTokenV3({
          address: poolAddress,
          network: this.network,
        });
        try {
          await multicall.wrap(contract).read.asset();
          return {
            address: poolAddress,
          };
        } catch (error) {
          return null;
        }
      }),
    );

    return compact(definitions);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<GearboxLendingTokenV3>) {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<GearboxLendingTokenV3>) {
    const amount = BigNumber.from((1e18).toString()).toString();
    const ratioRaw = await contract.read.convertToAssets([BigInt(amount)]);
    const ratio = Number(ratioRaw) / 10 ** 18;
    return [ratio];
  }
}
