import { ContractType } from '~position/contract.interface';
import { AbstractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { AppTokenSelectorKey } from '~position/selectors/app-token-selector.interface';
import { TokenDependency } from '~position/selectors/token-dependency-selector.interface';

export interface PositionSource {
  getPositions<T extends AbstractPosition<any>>(
    definitions: AppGroupsDefinition[],
    contractType: ContractType,
  ): Promise<T[]>;

  getTokenDependenciesBatch(queries: AppTokenSelectorKey[]): Promise<(TokenDependency | null)[]>;
}
