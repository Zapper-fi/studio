const fs = require('fs');
const glob = require('glob');

const recast = require('recast');

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

function removeTemplateAttributes(s) {
  return lineModifier(s, line => {
    const attributes = ['appId', 'groupId', 'network'];
    for (const attr of attributes) {
      const r = new RegExp(`^${attr} =.*;$`);
      if (r.test(line.toString().trim())) line = '';
    }

    return line;
  });
}

function replaceInjects(s) {
  return lineModifier(s, line => {
    if (/^@Injectable\(\)$/.test(line.toString().trim())) {
      line = [
        "import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';",
        '@PositionTemplate()',
      ].join('\n');
    }

    return line;
  });
}

//////////////////////////
// Actual script execution
//////////////////////////

glob('src/*/*/*/*.ts', {}, function (er, files) {
  const maybeTemplates = files.filter(file => file.split('.').length === 4);
  for (const file of maybeTemplates) {
    const contents = fs.readFileSync(file, 'utf-8');
    if (
      !contents.includes('extends AppTokenTemplatePositionFetcher') &&
      !contents.includes('extends ContractPositionTemplatePositionFetcher')
    )
      continue;

    const strategy = new CodeMod(contents);
    // strategy.addModifier(removeTemplateAttributes);
    strategy.addModifier(replaceInjects);
    strategy.exec();
    // fs.writeFileSync(file, strategy.exec(), 'utf-8');
  }
});
