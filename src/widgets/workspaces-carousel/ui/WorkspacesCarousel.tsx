"use client";

import { useTranslations } from "next-intl";

import { WorkspaceCard, useGetWorkspacesQuery } from "@/entities/workspace";
import { ChangeWorkspaceAccessModal } from "@/features/change-workspace-access";
import { DeleteWorkspaceModal } from "@/features/delete-workspace";
import { RenameWorkspaceModal } from "@/features/rename-workspace";
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from "@/shared/ui";

import { useWorkspacesCarousel } from "../model/useWorkspacesCarousel";

import { ErrorWorkspacesCarousel } from "./ErrorWorkspacesCarousel";
import { LoadingWorkspacesCarousel } from "./LoadingWorkspacesCarousel";

export function WorkspacesCarousel() {
  const t = useTranslations();

  const { data, isLoading, isError, error } = useGetWorkspacesQuery({
    type: "team",
  });

  const {
    selectedWorkspace,
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeWorkspaceName,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteWorkspace,
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeWorkspaceAccess,
  } = useWorkspacesCarousel();

  if (isLoading) return <LoadingWorkspacesCarousel />;

  if (isError) return <ErrorWorkspacesCarousel error={error} />;

  return (
    <>
      <Carousel opts={{ dragFree: true }}>
        {data && data?.length > 0 ? (
          <CarouselContent>
            {data.map(({ workspace, accessRole }) => (
              <CarouselItem
                key={workspace.id}
                className="basis-1/1 xs:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
              >
                <WorkspaceCard
                  workspace={workspace}
                  accessRole={accessRole}
                  buttonText={t("open")}
                  onEditWorkspaceName={handleChangeWorkspaceName}
                  onEditWorkspaceAccess={handleChangeWorkspaceAccess}
                  onDeleteWorkspace={handleDeleteWorkspace}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        ) : (
          <div className="text-muted-foreground">{t("workspace.empty")}</div> // TODO add empty state design
        )}

        <CarouselPrevious
          variant="secondary"
          className="bg-secondary/75 left-6 size-10"
        />

        <CarouselNext
          variant="secondary"
          className="bg-secondary/75 right-6 size-10"
        />
      </Carousel>

      <RenameWorkspaceModal
        workspace={selectedWorkspace!}
        open={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
      />

      <ChangeWorkspaceAccessModal
        workspace={selectedWorkspace}
        open={isChangeAccessModalOpen}
        onOpenChange={setIsChangeAccessModalOpen}
      />

      <DeleteWorkspaceModal
        workspace={selectedWorkspace}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  );
}
