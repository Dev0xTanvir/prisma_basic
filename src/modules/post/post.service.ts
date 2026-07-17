import { Commentstatus, Poststatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Ipostpayload, Ipostquery, Iupdatepost } from "./post.interfase";

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

const getallpost = async (query: Ipostquery) => {
  const page = query.page ? Number(query.page) : 10;
  const limit = query.limit ? Number(query.limit) : 1;
  const skip = (page - 1) * limit;
  const sortby = query.sortby ? query.sortby : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const post = await prisma.post.findMany({
    where: {
      AND: [
        // searching

        query.searchItem
          ? {
              OR: [
                {
                  title: {
                    contains: query.searchItem,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: query.searchItem,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},

        // filtaring

        query.title
          ? {
              title: query.title,
            }
          : {},

        query.content
          ? {
              content: query.content,
            }
          : {},
      ],
    },

    // pagination

    take: limit,
    skip: skip,

    // sort

    orderBy: {
      [sortby]: sortOrder,
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

  return {
    post,
    data: {
      page: page,
      limit: limit,
      skip: skip,
    },
  };
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
