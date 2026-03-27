"use client";

import { Dropdown, Typography, toast } from "@cocso-ui/react";
import { ContentCopyIcon } from "@cocso-ui/react-icons";
import { type ComponentProps, useCallback } from "react";
import { twMerge } from "tailwind-merge";

interface ColorSwatchProps {
  name: string;
  token: string;
  value: string;
}

const ColorSwatch = ({ name, token, value }: ColorSwatchProps) => {
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  }, []);

  return (
    <Dropdown>
      <Dropdown.Trigger
        render={
          <button
            className="flex w-full cursor-pointer flex-col gap-1.5 rounded-lg border border-transparent bg-transparent p-1 text-left transition-colors hover:border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100"
            type="button"
          >
            <div
              className="h-10 w-full rounded-lg border border-neutral-200"
              style={{ backgroundColor: value }}
            />
            <div className="flex flex-col gap-0.5">
              <Typography
                className="text-neutral-900"
                size={13}
                type="custom"
                weight="medium"
              >
                {name}
              </Typography>
              <Typography
                className="font-mono text-neutral-500"
                size={11}
                type="custom"
              >
                {token}
              </Typography>
              <Typography
                className="font-mono text-neutral-400"
                size={11}
                type="custom"
              >
                {value}
              </Typography>
            </div>
          </button>
        }
      />
      <Dropdown.Content>
        <Dropdown.Item
          onClick={() => handleCopy(token)}
          prefix={<ContentCopyIcon size={14} />}
        >
          Token
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleCopy(value)}
          prefix={<ContentCopyIcon size={14} />}
        >
          Value
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
};

interface ColorScaleProps extends ComponentProps<"div"> {
  colors: Array<{ step: string; token: string; value: string }>;
  name: string;
}

const ColorScale = ({ name, colors, className, ...props }: ColorScaleProps) => {
  return (
    <div className={twMerge("flex flex-col gap-3", className)} {...props}>
      <Typography
        className="text-neutral-950"
        size={14}
        type="custom"
        weight="semibold"
      >
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
