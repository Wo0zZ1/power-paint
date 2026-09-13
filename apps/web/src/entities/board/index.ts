export { BoardCard } from "./ui/BoardCard";

export { useGetBoardsQuery, useGetBoardQuery } from "./model/queries";
export {
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} from "./model/mutations";

export type { CreateBoardFormData } from "./model/schemas";
export {
  createBoardSchema,
  getCreateBoardFormSchema,
  updateBoardSchema,
  type UpdateBoardData,
} from "./model/schemas";
