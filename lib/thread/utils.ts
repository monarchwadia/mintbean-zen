import { TreeNode } from "./types";
import { Comment } from "@prisma/client";

export const createCommentTree = (data: Comment[], depth = 0, parentId?: number): TreeNode<Comment>[] => {
  const topLevel: TreeNode<Comment>[] = data
    .filter((comment) => (
      parentId 
        ? comment.parentId === parentId 
        : !comment.parentId
    ))
    .map((comment): TreeNode<Comment> => ({
      data: comment,
      depth: depth,
      children: createCommentTree(data, depth + 1, comment.id),
    }));

  return topLevel;
}