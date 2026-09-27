import { useBoardStore } from "../core";
import { createImage } from "../types";

const MAX_IMAGE_EDGE = 320;

const loadImageDimensions = async (src: string) => {
  const fallback = { width: MAX_IMAGE_EDGE, height: MAX_IMAGE_EDGE };
  const image = new window.Image();

  return await new Promise<{ width: number; height: number }>((resolve) => {
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width || fallback.width,
        height: image.naturalHeight || image.height || fallback.height,
      });
    };

    image.onerror = () => resolve(fallback);
    image.src = src;
  });
};

const fitToMaxEdge = (width: number, height: number, maxEdge: number) => {
  const scale = Math.min(maxEdge / width, maxEdge / height, 1);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

type StartUpload = (files: File[]) => Promise<{ ufsUrl: string }[] | undefined>;

type InsertImageFromFileOptions = {
  position: { x: number; y: number };
  startUpload: StartUpload;
  anchor?: "top-left" | "center";
};

export const insertImageFromFile = async (
  file: File,
  options: InsertImageFromFileOptions,
) => {
  const { position, startUpload, anchor = "top-left" } = options;
  const store = useBoardStore.getState();
  const previewUrl = URL.createObjectURL(file);
  const dimensions = await loadImageDimensions(previewUrl);
  const size = fitToMaxEdge(
    dimensions.width,
    dimensions.height,
    MAX_IMAGE_EDGE,
  );
  const x = anchor === "center" ? position.x - size.width / 2 : position.x;
  const y = anchor === "center" ? position.y - size.height / 2 : position.y;

  const shape = createImage({
    x,
    y,
    width: size.width,
    height: size.height,
    imageUrl: previewUrl,
  });

  store.addElement(shape);
  store.setImageUploadState(shape.id, {
    status: "uploading",
  });
  store.setTool("select");
  store.pureSelect(shape.id);
  store.setSelectionType("transform");

  try {
    const uploaded = await startUpload([file]);
    const uploadedUrl = uploaded?.[0]?.ufsUrl;

    if (!uploadedUrl) {
      throw new Error("Upload finished without a file URL");
    }

    store.updateElement(shape.id, { imageUrl: uploadedUrl });
    store.clearImageUploadState(shape.id);
    URL.revokeObjectURL(previewUrl);
  } catch (error) {
    console.error("Image upload failed", error);
    store.setImageUploadState(shape.id, {
      status: "failed",
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }

  return shape.id;
};
