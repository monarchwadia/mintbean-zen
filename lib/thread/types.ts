export type TreeNode<T> = {
  data: T,
  depth: number,
  children: TreeNode<T>[]
}