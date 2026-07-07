import { prisma } from "../../lib/prisma";
import {
  Icreatecommentpayload,
  Imodaratecommentpayload,
  Iupdatecommentpayload,
} from "./comment.interface";
// create comment

const createcomment = async (
  authorId: string,
  payload: Icreatecommentpayload,
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const result = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return result;
};

// get comment by author id

const getCommentByAuthorId = async (authorId: string) => {
  const comment = await prisma.comment.findMany({
    where: {
      id: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return comment;
};

//  get comment id

const getcommentid = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });

  return result;
};

// updatecomment

const updatecomment = async (
  commentId: string,
  data: Iupdatecommentpayload,
  authorId: string,
) => {
  const findcommentid = await prisma.comment.findUnique({
    where: {
      id: commentId,
      authorId,
    },
  });

  if (!findcommentid) {
    throw new Error("commentid not found");
  }

  const update = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });

  return update;
};

// deletecomment

const deletecomment = async (commentId: string, authorId: string) => {
  const commentid = await prisma.comment.findUnique({
    where: {
      id: commentId,
      authorId,
    },
  });

  if (!commentid) {
    throw new Error("commentid not found");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return null;
};

// modaratecomment

const modaratecomment = async (
  commentId: string,
  payload: Imodaratecommentpayload,
) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });
  const update = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: payload.status,
    },
  });

  return update;
};

export const commentservice = {
  createcomment,
  getCommentByAuthorId,
  getcommentid,
  updatecomment,
  deletecomment,
  modaratecomment,
};
