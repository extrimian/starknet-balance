import { Provider, Call, validateAndParseAddress } from 'starknet'
import { toBigInt, toNumber } from 'ethers'

async function index() {
  const provider = new Provider({
    sequencer: {
      network: 'mainnet-alpha' //'mainnet-alpha' or 'goerli-alpha'
    }
  })

// Get first argument from the command line
const account = process.argv[2];

// Check that account is a valid address
if (!account || !account.match(/^0x[0-9a-fA-F]+$/)) {
  console.error("Invalid account address");
  process.exit(1);
}

const ethTokenContract = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const accountContract = toBigInt(account).toString();

// Call the contract to get the account's balance
const balanceCall: Call = {
  contractAddress: ethTokenContract,
  entrypoint: 'balanceOf',
  calldata: [ accountContract ],
}
const balanceResponse = await provider.callContract(balanceCall);

// Call the contract to extract the decimals used in the balance
const decimalCall: Call = {
  contractAddress: ethTokenContract,
  entrypoint: 'decimals',
}
const decimalResponse = await provider.callContract(decimalCall);

const decimals = parseInt(decimalResponse.result[0].toString(), 16);
const balance = parseInt(balanceResponse.result[0].toString(), 16) * 10 **-decimals;
console.log("Balance", balance);
}

index();
