import { Inject } from '@nestjs/common';
import Axios from 'axios';
import _, { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from "~app-toolkit/helpers/presentation/display-item.present";
import {
  getImagesFromToken,
  getLabelFromToken,
} from "~app-toolkit/helpers/presentation/image.present";
import { ContractType } from "~position/contract.interface";
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RoboVaultContractFactory } from '../contracts';
import { ROBO_VAULT_DEFINITION } from '../robovault.definition';

const appId = ROBO_VAULT_DEFINITION.id;
const groupId = ROBO_VAULT_DEFINITION.groups.vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

export type RoboVaultDetails = {
  addr: string;
  chain: string;
  status: string;
  apy: number;
};
//robo
export type RoboTokenDataProps = {
  apy: number;
  liquidity: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomRoboVaultVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RoboVaultContractFactory) private readonly roboVaultContractFactory: RoboVaultContractFactory,
  ) { }

  async getPositions() {
    const endpoint = 'https://api.robo-vault.com/vaults';
    const data = await Axios.get<RoboVaultDetails[]>(endpoint).then(v => v.data);
    const ethData = data.filter(({ chain, status }) => chain === 'fantom' && status === 'active');
    const jarAddresses = ethData.map(({ addr }) => addr.toLowerCase());
    const jarAddressToDetails = _.keyBy(ethData, v => v.addr.toLowerCase());

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: "uniswap-v2", groupIds: ["pool"], network },
      { appId: "curve", groupIds: ["pool"], network }
    );
    const allTokens = [...appTokens, ...baseTokens];

    // Build out the token objects
    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      jarAddresses.map(async (jarAddress) => {
        const contract = this.roboVaultContractFactory.roboVault({
          address: jarAddress,
          network,
        });

        const [
          symbol,
          decimals,
          supplyRaw,
          underlyingTokenAddressRaw,
          ratioRaw,
        ] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall
            .wrap(contract)
            .token()
            .catch(() => ""),
          multicall
            .wrap(contract)
            .debtRatio()
            .catch(() => ""),
        ]);
        const supply = Number(supplyRaw) / 10 ** decimals;
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = allTokens.find(
          (v) => v.address === underlyingTokenAddress
        );
        if (!underlyingToken) return null;
        const underlyingTokenContract = this.roboVaultContractFactory.roboVault({
          address: underlyingToken.address,
          network,
        });
        //reserveRaw is used for calculating liquidity
        const reserveRaw = await multicall
          .wrap(underlyingTokenContract)
          .balanceOf(jarAddress);

        const tokens = [underlyingToken];
        const pricePerShare = Number(ratioRaw) / 10 ** 18;
        const price = pricePerShare * underlyingToken.price;
        const apy = (jarAddressToDetails[jarAddress]?.apy ?? 0) / 100;
        const supplyReserve =
          Number(reserveRaw) / 10 ** underlyingToken.decimals;
        const liquidity = supplyReserve * underlyingToken.price;

        // As a label, we'll use the underlying label (i.e.: 'LOOKS' or 'UNI-V2 LOOKS / ETH'), and suffix it with 'Jar'
        const label = `${getLabelFromToken(underlyingToken)} Jar`;
        // For images, we'll use the underlying token images as well
        const images = getImagesFromToken(underlyingToken);
        // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(price);
        // And for a tertiary label, we'll use the APY
        const tertiaryLabel = `${(apy * 100).toFixed(3)}% APY`;

        const token: AppTokenPosition<RoboTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: jarAddress,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {
            apy,
            liquidity,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
            tertiaryLabel,
          },
        };

        return token;
      })
    );

    return compact(tokens);
  }
}
