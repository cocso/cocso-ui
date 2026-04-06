import { Skeleton } from "@cocso-ui/react";

export default function SkeletonDefault() {
  return (
    <div className="p-4" style={{ width: 320 }}>
      <div className="flex gap-3">
        <Skeleton style={{ width: 40, height: 40 }} variant="circular" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton variant="text" />
          <Skeleton style={{ width: "60%" }} variant="text" />
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton style={{ width: "80%" }} variant="text" />
      </div>
    </div>
  );
}
