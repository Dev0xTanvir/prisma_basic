import { Commentstatus, Poststatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { Ipostpayload, Iupdatepost } from "./post.interfase";

// create post

const createpost = async (payload: Ipostpayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

// getall post

const getallpost = async () => {
  const post = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return post;
};

// getpost status

const getallpoststatus = async () => {

  const transactionpost = await prisma.$transaction(async (tx) => {
    
    // const totalpublickpost = await tx.post.count({
    //   where: {
    //     status: Poststatus.PUBLISHED,
    //   },
    // });

    // const totaldraftpost = await tx.post.count({
    //   where: {
    //     status: Poststatus.DRAFT,
    //   },
    // });

    // const totalprivatepost = await tx.post.count({
    //   where: {
    //     status: Poststatus.PRIVATE,
    //   },
    // });

    // const totalapprovedcomment = await tx.comment.count({
    //   where: {
    //     status: Commentstatus.APPROVED,
    //   },
    // });

    // const totalrejectcomment = await tx.comment.count({
    //   where: {
    //     status: Commentstatus.REJECT,
    //   },
    // });

    // // aggregatation

    // const totalpostviewaggregations = await tx.post.aggregate({
    //   _sum: { views: true },
    // });

    // const sumaggrate = totalpostviewaggregations._sum.views

    // return {
    //   totalpublickpost,
    //   totalapprovedcomment,
    //   totaldraftpost,
    //   totalrejectcomment,
    //   totalprivatepost,
    //   sumaggrate
    // };

    const [
      totalPost,
      totalpublickpost,
      totaldraftpost,
      totalprivatepost,
      totalapprovedcomment,
      totalrejectcomment,
      totalpostviewaggregations,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: Poststatus.PUBLISHED,
        },
      }),

      await tx.post.count({
        where: {
          status: Poststatus.DRAFT,
        },
      }),

      await tx.post.count({
        where: {
          status: Poststatus.PRIVATE,
        },
      }),

      await tx.comment.count({
        where: {
          status: Commentstatus.APPROVED,
        },
      }),

      await tx.comment.count({
        where: {
          status: Commentstatus.REJECT,
        },
      }),

      await tx.post.aggregate({
        _sum: { views: true },
      }),
    ]);

    return {
      totalPost,
      totalpublickpost,
      totaldraftpost,
      totalprivatepost,
      totalapprovedcomment,
      totalrejectcomment,
      totalPostViews: totalpostviewaggregations._sum.views ?? 0,
    };
  });

  return transactionpost;
};

// getmy post

const getmypoststatus = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },

    orderBy: {
      createdAt: "asc",
    },

    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
  return result;
};

// getpost myid

const getpostmyidstatus = async (postId: string) => {
  // transction and roll back

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findFirstOrThrow({
      where: {
        id: postId,
      },

      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: true,
      },
    });
    return post;
  });
  return transaction;
};

// updatepost

const updatepoststatus = async (
  postId: string,
  payload: Iupdatepost,
  authorId: string,
  isAdmin: boolean,
) => {
  const result = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && result.authorId !== authorId) {
    throw new Error("user not valide");
  }

  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return post;
};

// deletepost

const deletepoststatus = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const result = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && result.authorId !== authorId) {
    throw new Error("user not valide");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return null;
};

export const postservice = {
  createpost,
  getallpost,
  getallpoststatus,
  getmypoststatus,
  getpostmyidstatus,
  updatepoststatus,
  deletepoststatus,
};
