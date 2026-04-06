import { Skeleton } from "@cocso-ui/react";

export default function SkeletonAnimations() {
  return (
    <div className="flex flex-col gap-4 p-4" style={{ width: 320 }}>
      <div className="flex flex-col gap-1">
        <Skeleton animation="pulse" variant="text" />
        <span className="text-neutral-500 text-sm">pulse</span>
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton animation="wave" variant="text" />
        <span className="text-neutral-500 text-sm">wave</span>
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton animation="none" variant="text" />
        <span className="text-neutral-500 text-sm">none</span>
      </div>
    </div>
  );
}
