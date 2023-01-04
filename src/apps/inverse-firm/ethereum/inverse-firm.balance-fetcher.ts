import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { INVERSE_FIRM_DEFINITION } from '../inverse-firm.definition';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { InverseFirmContractFactory } from '../contracts';
import { drillBalance } from '~app-toolkit';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(INVERSE_FIRM_DEFINITION.id, network)
export class EthereumInverseFirmBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(InverseFirmContractFactory) private readonly inverseFirmContractFactory: InverseFirmContractFactory,
  ) { }

  async getDbrBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances(
      {
        address,
        appId: INVERSE_FIRM_DEFINITION.id,
        groupId: INVERSE_FIRM_DEFINITION.groups.dbr.id,
        network: Network.ETHEREUM_MAINNET,
        resolveBalances: async ({ address, contractPosition, multicall }) => {
          const dbrToken = contractPosition.tokens[0];
          const contract =
            this.inverseFirmContractFactory.dbr({ address: contractPosition.address, network });

          const [debtRaw, balanceRaw] = await Promise.all([
            multicall.wrap(contract).debts(address),
            multicall.wrap(contract).balanceOf(address),
          ]);

          return [
            drillBalance({
              ...dbrToken, symbol: 'DBR Balance in wallet'
            }, balanceRaw.toString()),
            drillBalance({
              ...dbrToken, symbol: 'DBR Yearly Spend Rate'
            }, debtRaw.toString(), { isDebt: true }),
          ];
        },
      }
    );
  }

  async getLoanBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances(
      {
        address,
        appId: INVERSE_FIRM_DEFINITION.id,
        groupId: INVERSE_FIRM_DEFINITION.groups.loan.id,
        network: Network.ETHEREUM_MAINNET,
        resolveBalances: async ({ address, contractPosition, multicall }) => {
          const suppliedToken = contractPosition.tokens.find(isSupplied)!;
          const borrowedToken = contractPosition.tokens.find(isBorrowed)!;

          const contract =
            this.inverseFirmContractFactory.simpleMarket({ address: contractPosition.address, network });

          const personalEscrow = await multicall.wrap(contract).escrows(address);

          const escrowContract =
            this.inverseFirmContractFactory.simpleEscrow({ address: personalEscrow, network });

          const [depositRaw, debtRaw] = await Promise.all([
            multicall.wrap(escrowContract).balance(),
            multicall.wrap(contract).debts(address),
          ]);

          return [
            drillBalance(suppliedToken, depositRaw.toString()),
            drillBalance(borrowedToken, debtRaw.toString(), { isDebt: true }),
          ];
        },
      }
    );
  }

  async getBalances(address: string) {
    const [loans, dbrBalances] = await Promise.all([
      this.getLoanBalances(address),
      this.getDbrBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: "Lending",
        assets: loans.concat(dbrBalances),
      },
    ]);
  }
}
