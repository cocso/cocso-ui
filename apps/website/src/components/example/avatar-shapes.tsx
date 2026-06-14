import { Avatar } from "@cocso-ui/react";

export default function AvatarShapes() {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar alt="Circle" fallback="C" shape="circle" size="lg" />
        <span className="text-neutral-500 text-sm">circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar alt="Square" fallback="S" shape="square" size="lg" />
        <span className="text-neutral-500 text-sm">square</span>
      </div>
    </div>
  );
}
