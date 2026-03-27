import { Typography } from "@cocso-ui/react";

const weights = [
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
] as const;

export default function TypographyWeight() {
  return (
    <div className="flex w-full flex-col gap-3 p-4">
      {weights.map((w) => (
        <div className="flex items-baseline gap-4" key={w}>
          <span className="w-20 shrink-0 text-right font-mono text-neutral-400 text-xs">
            {w}
          </span>
          <Typography size={18} type="custom" weight={w}>
            의약 CSO의 새로운 기준을 만듭니다.
          </Typography>
        </div>
      ))}
    </div>
  );
}
