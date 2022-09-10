const path = require('path');
const fs = require('fs');
const solc = require('solc');

async function main() {
  // Path to the .sol file
  const sourcePath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
  console.log(`Path to source: ${sourcePath}`);
  // Load the contract source code
  console.log(`Reading source file...`);
  const sourceCode = await fs.readFileSync(sourcePath, 'utf-8');
  // Compile the source code and retrieve the ABI and Bytecode
  console.log('Compiling source into api and bytecode...');
  const { abi, bytecode } = compile(sourceCode, 'Inbox');
  // Store the ABI and Bytecode into a JSON file

  console.log(`Saving output to Inbox.json...`);
  const artifact = JSON.stringify({ abi, bytecode }, null, 2);
  await fs.writeFileSync('Inbox.json', artifact);
  console.log('Done!');
}

function compile(sourceCode, contractName) {
  // Create the Solidity Compiler Standard Input and Output JSON
  const input = {
    language: 'Solidity',
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
  };
  // Parse the compiler output to retrieve the ABI and Bytecode
  const output = solc.compile(JSON.stringify(input));
  const artifact = JSON.parse(output).contracts.main[contractName];
  return {
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object,
  };
}

main().then(() => process.exit(0));
