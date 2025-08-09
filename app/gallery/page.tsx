// import LoadingSpinner from "../components/LoadingSpinner";
import { Metadata } from "next";
import PhotoGallery from "../lib/components/FeaturedGallery";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function Gallery() {
  return (
    <>
      <PhotoGallery />
    </>
  );
}
