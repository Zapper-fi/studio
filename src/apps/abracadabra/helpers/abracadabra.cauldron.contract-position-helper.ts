import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory } from '../contracts';

type AbracadabraCauldronContractPositionHelperParams = {
  cauldronAddresses: string[];
  network: Network;
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class AbracadabraCauldronContractPositionHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) private readonly contractFactory: AbracadabraContractFactory,
  ) {}

  async getContractPositions({
    cauldronAddresses,
    network,
    dependencies = [],
  }: AbracadabraCauldronContractPositionHelperParams) {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];

    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);

    const contractPositions = await Promise.all(
      cauldronAddresses.map(async cauldronAddress => {
        const contract = contractFactory.abracadabraCouldronTokenContract({ network, address: cauldronAddress });
        const collateralAddressRaw = await multicall.wrap(contract).collateral();

        // Abracadabra wraps Convex pools in its own wrapper ERC20 token
        const convexWrapperContract = contractFactory.abracadabraConvexWrapper({
          network,
          address: collateralAddressRaw.toLowerCase(),
        });
        const maybeConvexAddressRaw = await multicall
          .wrap(convexWrapperContract)
          .convexToken()
          .catch(() => '');
        const collateralAddress = maybeConvexAddressRaw
          ? maybeConvexAddressRaw.toLowerCase()
          : collateralAddressRaw.toLowerCase();

        // Tokens
        const collateralToken = allTokens.find(v => v.address === collateralAddress);
        const debtToken = baseTokens.find(v => v.symbol === 'MIM');
        if (!collateralToken || !debtToken) return null;
        const tokens = [supplied(collateralToken), borrowed(debtToken)];

        // Display Props
        const label = `${getLabelFromToken(collateralToken)} Cauldron`;
        const secondaryLabel = buildDollarDisplayItem(collateralToken.price);
        const images = getImagesFromToken(collateralToken);
        const statsItems = [];

        const contractPosition: ContractPosition = {
          type: ContractType.POSITION,
          address: cauldronAddress,
          appId: ABRACADABRA_DEFINITION.id,
          groupId: ABRACADABRA_DEFINITION.groups.cauldron.id,
          network,
          tokens,

          dataProps: {},

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return contractPosition;
      }),
    );

    return compact(contractPositions);
  }
}
