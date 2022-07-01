import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
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
const network = Network.ETHEREUM_MAINNET;

const SOLACE_TOKEN_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

const BOND_TELLER_ADDRESSES = [
  '0x501ace677634fd09a876e88126076933b686967a', // DAI Bond
  '0x501ace95141f3eb59970dd64af0405f6056fb5d8', // ETH Bond
  '0x501ace7e977e06a3cb55f9c28d5654c9d74d5ca9', // USDC Bond
  '0x501acef0d0c73bd103337e6e9fd49d58c426dc27', // WBTC Bond
  '0x501ace5ceec693df03198755ee80d4ce0b5c55fe', // USDT Bond
  '0x501ace00fd8e5db7c3be5e6d254ba4995e1b45b7', // SCP Bond
  '0x501acef4f8397413c33b13cb39670ad2f17bfe62', // FRAX Bond
];

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumSolaceBondsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [SOLACE_DEFINITION.groups.scp.id],
      network,
    });

    const allTokens = [...appTokens, ...baseTokens];
    const solaceToken = baseTokens.find(t => t.address === SOLACE_TOKEN_ADDRESS)!;

    const positions = await Promise.all(
      BOND_TELLER_ADDRESSES.map(async bondTellerAddress => {
        const bondTellerContract = this.solaceContractFactory.bondTellerErc20({ address: bondTellerAddress, network });

        const [underlyingAddressRaw, underWritingPoolAddress, name] = await Promise.all([
          multicall.wrap(bondTellerContract).principal(),
          multicall.wrap(bondTellerContract).underwritingPool(),
          multicall.wrap(bondTellerContract).name(),
        ]);

        const underlyingAddress = underlyingAddressRaw.toLowerCase();

        const depositToken = baseTokens.find(v => v.address === underlyingAddress);
        if (!depositToken || !solaceToken) return null;
        const tokens = [supplied(depositToken), claimable(solaceToken)];

        const baseTokenContract = this.solaceContractFactory.erc20({ address: underlyingAddress, network });
        const balanceOfRaw = await multicall.wrap(baseTokenContract).balanceOf(underWritingPoolAddress);
        const balanceOf = Number(balanceOfRaw) / 10 ** depositToken.decimals;
        const liquidity = balanceOf * depositToken.price;

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: bondTellerAddress,
          network,
          tokens,
          dataProps: {
            liquidity,
          },
          displayProps: {
            label: name,
            images: getImagesFromToken(depositToken),
            statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }
}
