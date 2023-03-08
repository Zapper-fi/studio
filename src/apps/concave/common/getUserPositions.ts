import axios from 'axios';
export const getuserPositions = async () => {
  const gqlUrl = 'https://concave.hasura.app/v1/graphql';

  const {
    data: {
      data: { logStakingV1_Lock: rawPositions },
    },
  } = await axios({
    url: gqlUrl,
    method: 'post',
    data: {
      query: `query ZapperLSDCNV {
  logStakingV1_Lock(where: {positionID: {_is_null: false}}) {
    deposit
    maturity
    poolBalance
    poolID
    poolTerm
    positionID
    rewardDebt
    to
  }
}`,
    },
  });
  return rawPositions;
};
