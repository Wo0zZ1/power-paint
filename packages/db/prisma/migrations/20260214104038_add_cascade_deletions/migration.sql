-- DropForeignKey
ALTER TABLE "board" DROP CONSTRAINT "board_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "board_member" DROP CONSTRAINT "board_member_board_id_fkey";

-- DropForeignKey
ALTER TABLE "board_member" DROP CONSTRAINT "board_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace" DROP CONSTRAINT "workspace_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace_member" DROP CONSTRAINT "workspace_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "workspace_member" DROP CONSTRAINT "workspace_member_workspace_id_fkey";

-- AddForeignKey
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_member" ADD CONSTRAINT "board_member_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_member" ADD CONSTRAINT "board_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
