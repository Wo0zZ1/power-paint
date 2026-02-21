import { redirect } from "next/navigation";

import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";

import { WorkspacesCarouselBlock } from "@/widgets/workspaces-carousel";

export async function DashboardPage() {
  const session = await getSession();

  if (!session) redirect(ROUTES.LOGIN);

  return (
    <div>
      <WorkspacesCarouselBlock />
      {/* Boards */}
      {/* <h3 className="text-2xl font-semibold mt-8 mb-4">Boards</h3>
      {boardsData.length ? (
        <Carousel opts={{ dragFree: true }}>
          <CarouselContent className="">
            {filteredBoardsFetchData.map(({ board, access }, index) => (
              <CarouselItem key={board.id} className="basis-1/3">
                <Link href={ROUTES.BOARD(board.id)}>
                  <Card className="aspect-video">
                    <CardHeader className="border-b">
                      <h4 className="text-lg font-medium">{board.name}</h4>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold">
                        {index + 1}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className="text-muted-foreground">No boards found.</p>
      )} */}
    </div>
  );
}
