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

const getallpoststatus = async () => {};

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
  await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatepost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
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

  return updatepost;
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

const deletepoststatus = async () => {};

export const postservice = {
  createpost,
  getallpost,
  getallpoststatus,
  getmypoststatus,
  getpostmyidstatus,
  updatepoststatus,
  deletepoststatus,
};
