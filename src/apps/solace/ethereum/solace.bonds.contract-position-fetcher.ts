import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SOLACE_DEFINITION } from '../solace.definition';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.bonds.id;
const network = Network.ETHEREUM_MAINNET;

const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

const BOND_TELLERS = [
  {
    name: 'Solace DAI Bond',
    address: '0x501ace677634fd09a876e88126076933b686967a',
    deposit: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    name: 'Solace ETH Bond',
    address: '0x501ace95141f3eb59970dd64af0405f6056fb5d8',
    deposit: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    name: 'Solace USDC Bond',
    address: '0x501ace7e977e06a3cb55f9c28d5654c9d74d5ca9',
    deposit: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    name: 'Solace WBTC Bond',
    address: '0x501acef0d0c73bd103337e6e9fd49d58c426dc27',
    deposit: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
  {
    name: 'Solace USDT Bond',
    address: '0x501ace5ceec693df03198755ee80d4ce0b5c55fe',
    deposit: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  {
    name: 'Solace SCP Bond',
    address: '0x501ace00fd8e5db7c3be5e6d254ba4995e1b45b7',
    deposit: '0x501acee83a6f269b77c167c6701843d454e2efa0',
  },
  {
    name: 'Solace FRAX Bond',
    address: '0x501acef4f8397413c33b13cb39670ad2f17bfe62',
    deposit: '0x853d955acef822db058eb8505911ed77f175b99e',
  },
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSolaceBondsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [SOLACE_DEFINITION.groups.scp.id],
      network,
    });

    const allTokens = [...appTokens, ...baseTokens];
    const solaceToken = baseTokens.find(t => t.address === SOLACE_ADDRESS)!;

    const positions = await Promise.all(
      BOND_TELLERS.map(async teller => {
        const depositToken = allTokens.find(v => v.address === teller.deposit);
        if (!depositToken || !solaceToken) return null;
        const tokens = [depositToken, solaceToken];

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: teller.address,
          network,
          tokens,
          dataProps: {},
          displayProps: {
            label: `${getLabelFromToken(depositToken)} Bond`,
            images: getImagesFromToken(depositToken),
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }
}
