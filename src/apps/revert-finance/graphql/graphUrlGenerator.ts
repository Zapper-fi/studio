export const generateGraphUrlForNetwork = (network: string): string => {
  let parsedNetwork = '';
  switch (network) {
    case 'ethereum':
      parsedNetwork = 'mainnet';
      break;
    default:
      parsedNetwork = network;
      break;
  }
  return `https://api.thegraph.com/subgraphs/name/revert-finance/compoundor-${parsedNetwork}`;
};
