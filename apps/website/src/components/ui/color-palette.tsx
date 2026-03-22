"use client";

import { Typography } from "@cocso-ui/react";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface ColorSwatchProps {
  name: string;
  token: string;
  value: string;
}

const ColorSwatch = ({ name, token, value }: ColorSwatchProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-10 w-full rounded-lg border border-neutral-200"
        style={{ backgroundColor: value }}
      />
      <div className="flex flex-col gap-0.5">
        <Typography className="text-neutral-900" size={13} weight="medium">
          {name}
        </Typography>
        <Typography className="font-mono text-neutral-500" size={11}>
          {token}
        </Typography>
        <Typography className="font-mono text-neutral-400" size={11}>
          {value}
        </Typography>
      </div>
    </div>
  );
};

interface ColorScaleProps extends ComponentProps<"div"> {
  name: string;
  colors: Array<{ step: string; token: string; value: string }>;
}

const ColorScale = ({
  name,
  colors,
  className,
  ...props
}: ColorScaleProps) => {
  return (
    <div className={twMerge("flex flex-col gap-3", className)} {...props}>
      <Typography className="text-neutral-950" size={14} weight="semibold">
        {name}
      </Typography>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
        {colors.map((color) => (
          <ColorSwatch
            key={color.step}
            name={color.step}
            token={color.token}
            value={color.value}
          />
        ))}
      </div>
    </div>
  );
};

export { ColorSwatch, ColorScale };
