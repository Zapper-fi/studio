export const getPoolNameFromID = (poolID: number) => {
  switch (poolID) {
    case 0:
      return '360 Day Pool';
    case 1:
      return '180 Day Pool';
    case 2:
      return '90 Day Pool';
    case 3:
      return '30 Day Pool';
  }
};
