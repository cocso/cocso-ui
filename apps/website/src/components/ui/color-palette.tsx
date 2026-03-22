"use client";

import { Typography } from "@cocso-ui/react";
import { type ComponentProps, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ColorSwatchProps {
  name: string;
  token: string;
  value: string;
}

const ColorSwatch = ({ name, token, value }: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [token]);

  return (
    <button
      className="flex cursor-pointer flex-col gap-1.5 rounded-lg border border-transparent bg-transparent p-1 text-left transition-colors hover:border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100"
      onClick={handleCopy}
      type="button"
    >
      <div
        className="h-10 w-full rounded-lg border border-neutral-200"
        style={{ backgroundColor: value }}
      />
      <div className="flex flex-col gap-0.5">
        <Typography className="text-neutral-900" size={13} weight="medium">
          {copied ? "Copied!" : name}
        </Typography>
        <Typography className="font-mono text-neutral-500" size={11}>
          {token}
        </Typography>
        <Typography className="font-mono text-neutral-400" size={11}>
          {value}
        </Typography>
      </div>
    </button>
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
