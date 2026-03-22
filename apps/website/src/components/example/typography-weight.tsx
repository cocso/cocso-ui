import { Typography } from "@cocso-ui/react";

const weights = ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"] as const;

export default function TypographyWeight() {
  return (
    <div className="flex w-full flex-col gap-3 p-4">
      {weights.map((w) => (
        <div className="flex items-baseline gap-4" key={w}>
          <span className="w-20 shrink-0 text-right font-mono text-neutral-400 text-xs">{w}</span>
          <Typography type="custom" size={18} weight={w}>다람쥐 헌 쳇바퀴에 타고파</Typography>
        </div>
      ))}
    </div>
  );
}
