import { prisma } from "../../lib/prisma";

const createpremium = async () => {

  const post = await prisma.post.findMany({
    where: {
      isPremium: true,
    },
  });
  
  return post
};


export const premiumservice = {
  createpremium,
};
