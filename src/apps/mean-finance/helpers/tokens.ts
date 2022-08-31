export const sortTokens = (tokenA: string, tokenB: string) => {
  let token0 = tokenA;
  let token1 = tokenB;

  if (tokenA > tokenB) {
    token0 = tokenB;
    token1 = tokenA;
  }

  return [token0, token1];
};
