/**
 * @description Quick and dirty code modification when importing things from zapper-api
 * @example node ./scripts/codemod/update-api-imports.js [glob-path]
 */
const fs = require('fs');
const recast = require('recast');
const dedent = require('dedent');

///////////////////////
// AST magic
///////////////////////
const createAST = source =>
  recast.parse(source, {
    parser: require('recast/parsers/typescript'),
  });

const b = recast.types.builders;

/**
 *
 * @param {recast.types.Visitor<{}>} p
 */
function createVisitor(p) {
  return p;
}

///////////////////////
// General utility func
///////////////////////
const noop = () => {};

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

class CodeMod {
  constructor(contents = '') {
    this.contents = contents;
    this.modifiers = [];
    this.visitors = [];
    this.originalSource = contents;
    this.ast = createAST(contents);
  }

  addModifier(fn) {
    this.modifiers.push(fn);
  }

  /**
   *
   * @param {() => recast.types.Visitor<{}>} visitor
   */
  addAstVisitor(visitor) {
    this.visitors.push(visitor);
  }

  setContents(contents) {
    this.contents = contents;
  }

  exec() {
    for (const visitor of this.visitors) {
      recast.visit(this.ast, visitor());
    }

    let nextContents = recast.print(this.ast).code;

    for (const modifier of this.modifiers) {
      nextContents = modifier(nextContents);
    }
    return nextContents;
  }
}

function injectAppToolkit(s) {
  let next = s;

  if (!next.includes('@Inject(APP_TOOLKIT')) {
    next = next.replace(
      'constructor(',
      'constructor(\n@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,\n',
    );
    next = append(next, `import { APP_TOOLKIT, IAppToolkit } from '~lib';`);
  }

  next = next.replaceAll(' this.tokenBalanceHelper.getVaultBalances', 'this.appToolkit.getBaseTokenPrices(network)');

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
  next = append(next, `import { AbstractApp } from '~app/app.dynamic-module';`);
  next = lineModifier(next, line => {
    if (line.includes('export class ')) {
      const [_export, _class, identifier] = line.split(' ');
      return `export class ${identifier} extends AbstractApp() {};`;
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

function extractConstantsCommonStrategy() {
  function extractConstantsCommon(specifiers, cb = noop) {
    const importDeclarations = [];
    const addressSpecifiers = [];
    const addressImportPath = b.literal('~app-toolkit/constants/address');

    const blocksSpecifiers = [];
    const blocksImportPath = b.literal('~app-toolkit/constants/blocks');

    for (const { from, originalImportedName, renamedImport } of specifiers) {
      if (from === '~constants/common') {
        if (originalImportedName === 'ZERO_ADDRESS') {
          addressSpecifiers.push(b.importSpecifier(b.identifier(originalImportedName), b.identifier(renamedImport)));
        }
        if (originalImportedName === 'ETH_ADDR_ALIAS') {
          addressSpecifiers.push(b.importSpecifier(b.identifier(originalImportedName), b.identifier(renamedImport)));
        }

        if (originalImportedName === 'BLOCKS_PER_DAY') {
          blocksSpecifiers.push(b.importSpecifier(b.identifier(originalImportedName), b.identifier(renamedImport)));
        }
      }
    }

    if (addressSpecifiers.length) {
      importDeclarations.push(b.importDeclaration(addressSpecifiers, addressImportPath));
    }

    if (blocksSpecifiers.length) {
      importDeclarations.push(b.importDeclaration(blocksSpecifiers, blocksImportPath));
    }

    if (importDeclarations.length) {
      cb(importDeclarations);
    }
  }

  return createVisitor({
    visitProgram(path) {
      this.traverse(path);
    },
    visitImportSpecifier(path) {
      this.traverse(path);
    },
    visitImportDeclaration(path) {
      const importedFrom = path.node.source.value;

      const shortSpecifiers = path.node.specifiers
        .map(specifier => {
          if (!specifier.imported) {
            return null;
          }

          const originalImportedName = specifier.imported.name;
          const renamedImport = specifier.local.name;
          const from = importedFrom;

          return {
            originalImportedName,
            renamedImport,
            from,
          };
        })
        .filter(Boolean);

      extractConstantsCommon(shortSpecifiers, next => {
        for (const n of next) {
          path.parentPath.insertAt(0, n);
        }
        path.prune();
      });

      this.traverse(path);
    },
  });
}

function createGenericImportRenamingStrategy(original, next) {
  return createVisitor({
    visitProgram(path) {
      this.traverse(path);
    },
    visitImportSpecifier(path) {
      this.traverse(path);
    },
    visitImportDeclaration(path) {
      const importedFrom = path.node.source.value;
      if (importedFrom !== original) {
        return false;
      }

      const shortSpecifiers = path.node.specifiers.map(specifier => {
        const originalImportedName = specifier.imported.name;
        const renamedImport = specifier.local.name;
        const from = importedFrom;

        return {
          originalImportedName,
          renamedImport,
          from,
        };
      });

      const specifiers = shortSpecifiers.map(specifier => {
        return b.importSpecifier(b.identifier(specifier.originalImportedName), b.identifier(specifier.renamedImport));
      });

      const importDeclaration = b.importDeclaration(specifiers, b.literal(next));

      path.replace(importDeclaration);

      this.traverse(path);
    },
  });
}

function renameUtilityImportStrategy() {
  return createGenericImportRenamingStrategy('~util/images.utility', '~app-toolkit/helpers/presentation/image.present');
}

function renamePositionFetcherImportStrategy() {
  return createGenericImportRenamingStrategy(
    '~position/position-fetcher.utils',
    '~app-toolkit/helpers/presentation/display-item.present',
  );
}

function renameNetworkImportStrategy() {
  return createGenericImportRenamingStrategy('@zapper-fi/types/networks', '~types/network.interface');
}

function appToolkitStrategy() {
  const injectableClasses = {};

  return createVisitor({
    visitProgram(path) {
      this.traverse(path);
    },
    visitClassDeclaration(path) {
      this.traverse(path);
    },
    visitClassMethod(path) {
      if (path.node.kind === 'constructor') {
        path.node.params.forEach(param => {
          let injectable = '';
          param.decorators.forEach(decorator => {
            if (decorator.expression.callee.name === 'Inject') {
              injectable = decorator.expression.arguments[0].name;
            }
          });

          if (injectable) {
            const thisInvocation = param.parameter.name;
            injectableClasses[thisInvocation] = injectable;
          }
        });
        return false;
      }

      recast.visit(path.node, {
        visitMemberExpression(path) {
          this.traverse(path);
        },

        visitCallExpression(path) {
          const methodName = path.node.callee.property?.name;

          if (!methodName) {
            return false;
          }

          function createThisCallExpression({ stringPath = '', method = methodName, args = path.node.arguments }) {
            let memberExpression = b.thisExpression();
            for (const content of stringPath.split('.')) {
              memberExpression = b.memberExpression(memberExpression, b.identifier(content));
            }

            return b.callExpression(b.memberExpression(memberExpression, b.identifier(method)), args);
          }

          let replacement = null;

          recast.visit(path.node, {
            visitThisExpression(path) {
              const thisInvocation = path.parentPath.node.property.name;
              const itIsThisClass = className => injectableClasses[thisInvocation] === className;

              if (itIsThisClass('TokenBalanceHelper') && methodName === 'getVaultBalances') {
                replacement = createThisCallExpression({ stringPath: 'appToolkit.helpers.tokenBalanceHelper' });
              }

              if (itIsThisClass('MasterChefContractPositionHelper')) {
                replacement = createThisCallExpression({
                  stringPath: 'appToolkit.helpers.masterChefContractPositionHelper',
                });
              }

              if (itIsThisClass('MasterChefRewarderClaimableTokenStrategy')) {
                replacement = createThisCallExpression({
                  stringPath: 'appToolkit.helpers.masterChefV2ClaimableTokenStrategy',
                });
              }

              if (itIsThisClass('MasterChefContractPositionBalanceHelper')) {
                replacement = createThisCallExpression({
                  stringPath: 'appToolkit.helpers.masterChefContractPositionBalanceHelper',
                });
              }

              if (itIsThisClass('MasterChefDefaultStakedBalanceStrategy')) {
                replacement = createThisCallExpression({
                  stringPath: 'appToolkit.helpers.masterChefDefaultStakedBalanceStrategy',
                });
              }
              if (itIsThisClass('MasterChefContractPositionHelper')) {
                replacement = createThisCallExpression({
                  stringPath: 'appToolkit.helpers.masterChefContractPositionHelper',
                });
              }

              if (itIsThisClass('PRICES_SERVICE')) {
                replacement = createThisCallExpression({
                  stringPath: 'appToolkit',
                  method: 'getBaseTokenPrices',
                  args: [b.identifier('network')],
                });
              }

              if (itIsThisClass('MulticallService')) {
                replacement = createThisCallExpression({
                  stringPath: 'appToolkit',
                  method: 'getMulticall',
                  args: [b.identifier('network')],
                });
              }

              return false;
            },
          });

          // Rename the method
          if (replacement) {
            path.replace(replacement);
          }

          this.traverse(path);
        },
      });
      this.traverse(path);
    },
  });
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

  const strategy = new CodeMod(contents);

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
    strategy.addAstVisitor(appToolkitStrategy);
    strategy.addModifier(injectAppToolkit);
    strategy.addModifier(removeMasterChefImports);
    strategy.addModifier(replaceRegistration);
  }

  // Globally applicable strategies
  strategy.addModifier(replaceAppsV3Import);

  strategy.addAstVisitor(renameNetworkImportStrategy);
  strategy.addAstVisitor(renameUtilityImportStrategy);
  strategy.addAstVisitor(extractConstantsCommonStrategy);
  strategy.addAstVisitor(renamePositionFetcherImportStrategy);

  fs.writeFileSync(file, strategy.exec(), 'utf-8');
}
