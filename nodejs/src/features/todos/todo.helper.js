import { redisClient } from '#server/shared/configs/redis';

export const clearTodoCache = async (userId) => {
  const patternList = `todo_list:*${userId}*`;
  const patternDetail = `todo_detail:*${userId}*`;

  const [keysList, keysDetail] = await Promise.all([
    redisClient.keys(patternList),
    redisClient.keys(patternDetail),
  ]);

  const allKeys = [...keysList, ...keysDetail];
  if (allKeys.length > 0) {
    await redisClient.del(allKeys);
    console.log(`🧹 Cleared ${allKeys.length} cache keys for User: ${userId}`);
  }
};
