import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GroContractFactory } from '../contracts';
import { GRO_DEFINITION } from '../gro.definition';

const appId = GRO_DEFINITION.id;
const groupId = GRO_DEFINITION.groups.labs.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheGroLabsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GroContractFactory) private readonly groContractFactory: GroContractFactory,
  ) {}

  async getPositions() {
    const daiLabVaultAddress = '0x6063597B9356B246E706Fd6A48C780F897e3ef55';
    const usdcLabVaultAddress = '0x2Eb05cfFA24309b9aaf300392A4D8Db745d4E592';
    const usdtLabVaultAddress = '0x6EF44077a1F5e10cDfcCc30EFb7dCdb1d5475581';
    const vaultAddresses = [daiLabVaultAddress, usdcLabVaultAddress, usdtLabVaultAddress];

    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await Promise.all(
      vaultAddresses.map(async vaultAddress => {
        const contract = this.groContractFactory.groLabsVault({ address: vaultAddress, network });

        const [symbol, decimals, supplyRaw, pricePerShare, name] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).getPricePerShare(),
          multicall.wrap(contract).name(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: vaultAddress,
          network,
          symbol,
          decimals,
          supply,
          pricePerShare: Number(pricePerShare),
          price: Number(pricePerShare),
          tokens: [],
          dataProps: {},
          displayProps: {
            label: name,
            images: [],
            secondaryLabel: undefined,
            tertiaryLabel: undefined,
          },
        };
        return token;
      }),
    );

    // Use compact from lodash to filter out any null elements
    return _.compact(tokens);
  }
}
