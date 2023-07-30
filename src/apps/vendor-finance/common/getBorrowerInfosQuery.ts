export const borrowerInfosQuery = (address: string) => {
  return {
    query: `query {
    borrower(id: "${address}") {
      positions {
        pool {
          id
          _mintRatio
        }
        totalBorrowed
        effectiveRate
      }
    }
  }`,
  };
};
