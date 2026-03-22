import { Typography } from "@cocso-ui/react";

const sizes = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 44, 60] as const;

export default function TypographyScale() {
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {sizes.map((size) => (
        <div className="flex items-baseline gap-4" key={size}>
          <span className="w-8 shrink-0 text-right font-mono text-neutral-400 text-xs">{size}</span>
          <Typography size={size}>다람쥐 헌 쳇바퀴에 타고파</Typography>
        </div>
      ))}
    </div>
  );
}
