#!/usr/bin/node
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '../packages');
const outputName = path.resolve(__dirname, '../components.js');

const whiteFiles = ['utils', 'types', 'components', 'Editor'];
let fileStr = '// 注意：此文件为自动生成，请勿手动修改！\n';
const createExportsFile = () => {
  const files = fs.readdirSync(rootDir);
  const filterFiles = files.filter((el) => !whiteFiles.includes(el));
  let fileNames = [];
  filterFiles.forEach((name) => {
    fileStr += `import ${name} from './packages/${name}/${name}.vue';\n`;
    fileNames.push(name);
  })
  fileStr += `\nexport {
  ${fileNames.join(', ')}
}
`
}
createExportsFile();
fs.writeFileSync(
  path.resolve(outputName),
  fileStr,
);


