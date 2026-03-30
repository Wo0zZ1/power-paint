export { BoardCard } from "./ui/BoardCard";

export type { BoardWithAccess, Board } from "./model/types";

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
