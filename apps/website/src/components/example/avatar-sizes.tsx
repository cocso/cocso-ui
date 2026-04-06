import { Avatar } from "@cocso-ui/react";

export default function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <Avatar alt="User" fallback="U" size="xs" />
      <Avatar alt="User" fallback="U" size="sm" />
      <Avatar alt="User" fallback="U" size="md" />
      <Avatar alt="User" fallback="U" size="lg" />
      <Avatar alt="User" fallback="U" size="xl" />
    </div>
  );
}
