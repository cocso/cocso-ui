import { Skeleton } from "@cocso-ui/react";

export default function SkeletonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <Skeleton style={{ width: 200 }} variant="text" />
        <span className="text-neutral-500 text-sm">text</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton style={{ width: 48, height: 48 }} variant="circular" />
        <span className="text-neutral-500 text-sm">circular</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Skeleton style={{ width: 200, height: 120 }} variant="rectangular" />
        <span className="text-neutral-500 text-sm">rectangular</span>
      </div>
    </div>
  );
}
