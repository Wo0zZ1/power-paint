-- CreateIndex
CREATE UNIQUE INDEX "workspace_personal_owner_key" ON "boards"."workspace"("owner_id") WHERE (type = 'personal');
