import { BrandLoader } from "@/components/ui/BrandLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <BrandLoader label="Loading meeting" />
    </div>
  );
}
