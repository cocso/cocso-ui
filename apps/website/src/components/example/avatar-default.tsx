import { Avatar } from "@cocso-ui/react";

export default function AvatarDefault() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Avatar alt="Alice Kim" src="https://i.pravatar.cc/150?img=1" />
      <Avatar alt="Bob Lee" fallback="BL" />
      <Avatar alt="Carol Park" />
    </div>
  );
}
