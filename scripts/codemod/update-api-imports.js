/**
 * @description Quick and dirty code modification when importing things from zapper-api
 * @example node ./scripts/codemod/update-api-imports.js [glob-path]
 */
const fs = require('fs');

const dedent = require('dedent');

///////////////////////
// General utility func
///////////////////////
function deleteLinesContaining(content, targets) {
  const next = [];
  const byLine = content.split('\n');
  for (const line of byLine) {
    let skip = false;
    for (const target of targets) {
      if (line.includes(target)) {
        skip = true;
        continue;
      }
    }
    if (!skip) {
      next.push(line);
    }
  }

  return next.join('\n');
}

function append(content, injectString) {
  return `${injectString}\n${content}`;
}

function lineModifier(s, cb) {
  let next = s;
  const lines = next.split('\n');
  const nextLines = [];
  for (const line of lines) {
    const modifiedLine = cb(line);
    nextLines.push(modifiedLine);
  }
  next = nextLines.join('\n');
  return next;
}

///////////////////////
// Codemod & Strategies
///////////////////////
class CodeModder {
  constructor(contents = '') {
    this.contents = contents;
    this.modifiers = [];
  }

  addModifier(fn) {
    this.modifiers.push(fn);
  }

  setContents(contents) {
    this.contents = contents;
  }

  exec() {
    let nextContents = this.contents;
    for (const modifier of this.modifiers) {
      nextContents = modifier(nextContents);
    }
    return nextContents;
  }
}

function replaceNetworkImport(s) {
  return s.replace('@zapper-fi/types/networks', '~types/network.interface');
}

function injectAppToolkit(s) {
  let next = s;
  next = next.replace('constructor(', 'constructor(\n@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,\n');
  next = append(next, `import { APP_TOOLKIT, IAppToolkit } from '~lib';`);

  next = next.replaceAll('this.multicallService.multicall({ network })', 'this.appToolkit.getMulticall(network)');

  next = next.replaceAll(
    'this.priceService.getBaseTokenV3Prices({ network })',
    'this.appToolkit.getBaseTokenPrices(network)',
  );

  next = next.replaceAll(' this.tokenBalanceHelper.getVaultBalances', 'this.appToolkit.getBaseTokenPrices(network)');

  next = next.replaceAll(
    'this.masterChefFarmContractPositionBalanceHelper.getBalances',
    'this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances',
  );

  next = next.replaceAll(
    'this.masterChefFarmContractPositionDefaultStakedBalanceStrategy.build',
    'this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build',
  );

  next = next.replaceAll(
    'this.masterChefFarmContractPositionDefaultStakedBalanceStrategy.build',
    'this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build',
  );

  next = next.replaceAll(
    'this.masterchefFarmContractPositionHelper.getContractPositions',
    'this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions',
  );

  next = deleteLinesContaining(next, ['@Inject(PRICES_SERVICE)', '@Inject(MulticallService)']);

  return next;
}

function replaceRegistration(s) {
  let next = s;
  next = next.replace('@RegisterAppV3Definition', '@Register.AppDefinition');
  next = next.replace('@AppsV3BalanceFetcher', '@Register.BalanceFetcher');
  next = next.replace('BalanceFetcherV3', 'BalanceFetcher');
  next = next.replace('buildBalanceFetcherV3Response', 'presentBalanceFetcherResponse');

  if (next.includes('implements PositionFetcher<ContractPosition>')) {
    next = next.replace('@RegisterPositionFetcher', '@Register.ContractPositionFetcher');
    next.replace('type: ContractType.POSITION', '');
    append(next, `import { PositionFetcher } from '~position/position-fetcher.interface';`);
    append(next, `import { ContractPosition } from '~position/position.interface';`);
  }

  if (next.includes('implements PositionFetcher<AppToken>')) {
    next = next.replace('@RegisterPositionFetcher', '@Register.TokenPositionFetcher');
    next = next.replace('type: ContractType.APP_TOKEN', '');
    next = next.replace('<AppToken>', '<AppTokenPosition>');
    append(next, `import { AppTokenPosition } from '~position/position.interface';`);
  }

  next = deleteLinesContaining(next, [
    `import { RegisterAppV3Definition } from '~apps-v3/apps-definition.decorator';`,
    `import { AppsV3BalanceFetcher } from '~balance/fetchers/balance-fetcher.decorator';`,
    `import { RegisterPositionFetcher } from '~position/position-fetcher.decorator';`,
    `from '~position/position-fetcher.interface'`,
    `from '~position/balance-fetcher.utils'`,
  ]);
  next = append(next, `import { Register } from '~app-toolkit/decorators';`);

  return next;
}

function replaceImageUtilityImport(s) {
  return s.replace('~util/images.utility', '~app-toolkit/helpers/presentation/image.present');
}

function replacePositionFetcherUtilityImport(s) {
  return s.replace('~position/position-fetcher.utils', '~app-toolkit/helpers/presentation/display-item.present');
}

function replaceZeroAddressImport(s) {
  return s.replace(
    `import { ZERO_ADDRESS } from '~constants/common';`,
    `import { ZERO_ADDRESS } from '~app-toolkit/constants/address';`,
  );
}

function reshapeGroups(s) {
  let isGroups = false;
  return lineModifier(s, line => {
    if (line.includes('groups: {')) {
      isGroups = true;
      return line;
    }

    if (line.includes('},')) {
      isGroups = false;
      return line;
    }

    if (isGroups) {
      const [key, value] = line.split(':').map(l => l.toLowerCase());
      return `${key}: { id: ${value.replace(',', '')}, type: GroupType.REPLACE_ME },`;
    }

    return line;
  });
}

function augmentBalanceImport(s) {
  let next = s;
  next = deleteLinesContaining(next, ['@zapper-fi/types/balances']);
  next = append(next, `import { GroupType, ProtocolAction, ProtocolTag } from '~app/app.interface';`);
  return next;
}

function replaceAppDefinitionImport(s) {
  let next = s;
  next = next.replace('~apps/app-definition.interface', '~app/app.definition');
  next = deleteLinesContaining(next, ['~apps-v3/apps-definition.decorator']);
  return next;
}

function appendAbstractDynamicApp(s) {
  let next = s;
  next = append(next, `import { AbstractDynamicApp } from '~app/app.dynamic-module';`);
  next = lineModifier(next, line => {
    if (line.includes('export class ')) {
      const [_export, _class, identifier] = line.split(' ');
      return `export class ${identifier} extends AbstractDynamicApp<${identifier}>() {};`;
    } else {
      return line;
    }
  });
  return next;
}

function replaceAppsV3Import(s) {
  return s.replaceAll('~apps-v3/', '~apps/');
}

function warnAboutExternallyConfiguredAppModules(s) {
  if (s.includes('~apps-v3')) {
    return append(
      s,
      dedent`
    // @warning: External module is possibly present, please use the "ExternalAppImport" helper to inject them within imports
    //           Import it as such: import { ExternalAppImport } from '~app/app.dynamic-module.ts'
    //           Use it as such: @Module({ imports: [...ExternalAppImport(AppleAppModule, BananaAppModule)]
    `,
    );
  }
  return s;
}

function removeMasterChefImports(s) {
  if (!s.includes('helpers/master-chef.')) {
    return s;
  }
  let next = s;

  next = lineModifier(next, line => {
    if (line.includes('~position/helpers/master-chef.contract-position-balance-helper')) {
      return '';
    }

    if (line.includes('~position/helpers/master-chef.default.staked-token-balance-strategy')) {
      return '';
    }

    if (line.includes('~position/helpers/master-chef.rewarder.claimable-token-balances-strategy')) {
      return '';
    }

    return line;
  });
}

function removeLegacyModulesFromModuleDefinition(s) {
  let next = s;
  next = deleteLinesContaining(next, [
    `from '~web3/web3.module';`,
    `from '~multicall/multicall.module';`,
    `from '~prices/prices.module';`,
  ]);
  next = next.replace(/Web3Module,?/, '');
  next = next.replace(/PricesModule,?/, '');
  next = next.replace(/MulticallModule,?/, '');
  return next;
}

//////////////////////////
// Actual script execution
//////////////////////////
const files = process.argv.slice(2);

if (!files) {
  console.warn('No files found');
  process.exit(0);
}

for (const file of files) {
  const contents = fs.readFileSync(file, 'utf-8');
  const strategy = new CodeModder(contents);

  // Definition file strategies
  if (file.endsWith('.definition.ts')) {
    strategy.addModifier(reshapeGroups);
    strategy.addModifier(augmentBalanceImport);
    strategy.addModifier(replaceAppDefinitionImport);
    strategy.addModifier(replaceRegistration);
  }

  // Module strategies
  if (file.endsWith('.module.ts')) {
    strategy.addModifier(appendAbstractDynamicApp);
    strategy.addModifier(removeLegacyModulesFromModuleDefinition);
    strategy.addModifier(warnAboutExternallyConfiguredAppModules);
  }

  if (
    file.endsWith('.balance-fetcher.ts') ||
    file.endsWith('.token-fetcher.ts') ||
    file.endsWith('.contract-position-fetcher.ts')
  ) {
    strategy.addModifier(injectAppToolkit);
    strategy.addModifier(removeMasterChefImports);
    strategy.addModifier(replaceRegistration);
  }

  // Globally applicable strategies
  strategy.addModifier(replaceAppsV3Import);
  strategy.addModifier(replaceNetworkImport);
  strategy.addModifier(replaceImageUtilityImport);
  strategy.addModifier(replacePositionFetcherUtilityImport);
  strategy.addModifier(replaceZeroAddressImport);

  fs.writeFileSync(file, strategy.exec(), 'utf-8');
}
