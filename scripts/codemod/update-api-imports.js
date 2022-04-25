/**
 * @description Quick and dirty code modification when importing things from zapper-api
 * @example node ./scripts/codemod/update-api-imports.js [glob-path]
 */

const fs = require('fs');

///////////////////////
// General utility func
///////////////////////
function deleteLinesContaining(content, targets) {
  const byLine = content.split('\n');
  content = byLine
    .filter(line => {
      for (const t of targets) {
        if (!line.includes(t)) {
          return true;
        }
      }

      return false;
    })
    .join('\n');
  return content;
}

function append(content, injectString) {
  return `${injectString}\n${content}`;
}

///////////////////////
// Codemod & Strategies
///////////////////////
class CodeModder {
  constructor(contents) {
    this.contents = contents;
    this.modifiers = [];
  }

  addModifier(fn) {
    this.modifiers.push(fn);
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
  next = s.replace('constructor(', 'constructor(\n@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,\n');
  next = append(next, `import { APP_TOOLKIT, IAppToolkit } from '~lib';`);
  next = s.replaceAll('this.multicallService.multicall({ network })', 'this.appToolkit.getMulticall(network)');
  next = s.replaceAll(
    'this.priceService.getBaseTokenV3Prices({ network })',
    'this.appToolkit.getBaseTokenPrices(network)',
  );

  next = deleteLinesContaining(next, ['@Inject(PRICES_SERVICE)', '@Inject(MulticallService)']);

  return next;
}

function replaceRegistration(s) {
  let next = s;
  next = s.replace('@RegisterAppV3Definition', '@Register.AppDefinition');
  next = s.replace('@AppsV3BalanceFetcher', '@Register.BalanceFetcher');
  if (next.includes('implements PositionFetcher<ContractPosition>')) {
    next = s.replace('@RegisterPositionFetcher', '@Register.ContractPositionFetcher');
  }

  if (next.includes('implements PositionFetcher<AppToken>')) {
    next = s.replace('@RegisterPositionFetcher', '@Register.TokenPositionFetcher');
    next = s.replace('implements PositionFetcher<AppToken>', 'implements PositionFetcher<AppTokenPosition>');
    append(next, `import { AppTokenPosition } from '~position/position.interface';`);
  }

  next = deleteLinesContaining(next, [
    `import { RegisterAppV3Definition } from '~apps-v3/apps-definition.decorator';`,
    `import { AppsV3BalanceFetcher } from '~balance/fetchers/balance-fetcher.decorator';`,
    `import { RegisterPositionFetcher } from '~position/position-fetcher.decorator';`,
  ]);
  next = append(next, `import { Register } from '~app-toolkit/decorators'`);

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
  const r = new CodeModder(contents);
  r.addModifier(replaceNetworkImport);
  r.addModifier(replaceImageUtilityImport);
  r.addModifier(replacePositionFetcherUtilityImport);
  r.addModifier(injectAppToolkit);
  r.addModifier(replaceRegistration);
  r.addModifier(replaceZeroAddressImport);

  fs.writeFileSync(file, r.exec(), 'utf-8');
}
