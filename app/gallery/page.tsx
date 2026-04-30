import { Metadata } from "next";
import PhotoGallery from "../lib/components/FeaturedGallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "TODO",
};

export default function Gallery() {
  return (
    <div className="min-h-dvh px-2 py-2 lg:py-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-domine text-center">
        Photography
      </h1>
      <PhotoGallery />
    </div>
  );
}
