import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.bonds.id;
const network = Network.POLYGON_MAINNET;

export const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

const BOND_TELLERS = [
  {
    name: 'Solace DAI Bond',
    address: '0x501ace677634fd09a876e88126076933b686967a',
    deposit: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
  },
  {
    name: 'Solace ETH Bond',
    address: '0x501ace367f1865dea154236d5a8016b80a49e8a9',
    deposit: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  },
  {
    name: 'Solace USDC Bond',
    address: '0x501ace7e977e06a3cb55f9c28d5654c9d74d5ca9',
    deposit: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  },
  {
    name: 'Solace WBTC Bond',
    address: '0x501acef0d0c73bd103337e6e9fd49d58c426dc27',
    deposit: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
  },
  {
    name: 'Solace USDT Bond',
    address: '0x501ace5ceec693df03198755ee80d4ce0b5c55fe',
    deposit: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
  {
    name: 'Solace FRAX Bond',
    address: '0x501acef4f8397413c33b13cb39670ad2f17bfe62',
    deposit: '0x45c32fa6df82ead1e2ef74d17b76547eddfaff89',
  },
  {
    name: 'Solace MATIC Bond',
    address: '0x501ace133452d4df83ca68c684454fcba608b9dd',
    deposit: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
  },
];

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonSolaceBondsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const solace = baseTokens.find(t => t.address === SOLACE_ADDRESS)!;

    const positions = await Promise.all(
      BOND_TELLERS.map(async teller => {
        const depositToken = baseTokens.find(v => v.address === teller.deposit)!;
        if (!depositToken || !solace) return null;
        const tokens = [supplied(depositToken), claimable(solace)];

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
