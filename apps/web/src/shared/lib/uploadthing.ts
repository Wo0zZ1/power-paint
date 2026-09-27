import { generateReactHelpers } from "@uploadthing/react";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// const auth = async (req: NextRequest) => {
//   const verificationId = req.cookies.get(SESSION_ID_COOKIE_NAME)?.value;

//   if (!verificationId) return null;

//   const verification = await prisma.signupVerification.findUnique({
//     where: { verificationId },
//   });

//   return verification;
// };

export const ourFileRouter = {
  canvasImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    return { fileUrl: file.ufsUrl };
  }),

  userPictureUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // .middleware(async ({}) => {
    // const user = await auth(req);

    // if (!user) throw new UploadThingError("Unauthorized");

    // return { userId: user.userId };
    // return {};
    // })
    .onUploadComplete(async ({ file }) => {
      // console.log("file url", file.ufsUrl);
      return { fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
