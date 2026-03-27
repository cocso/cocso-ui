import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TokenDefinition {
  name: string;
  preview?: ReactNode;
  token: string;
  value: string;
}

interface TokenTableProps extends ComponentProps<"div"> {
  data: TokenDefinition[];
}

export const TokenTable = ({ data, className, ...props }: TokenTableProps) => {
  return (
    <div className={twMerge("w-full overflow-x-auto", className)} {...props}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-neutral-200 border-b text-left">
            <th className="whitespace-nowrap px-3 py-2 font-semibold text-neutral-950">
              Name
            </th>
            <th className="whitespace-nowrap px-3 py-2 font-semibold text-neutral-950">
              Token
            </th>
            <th className="whitespace-nowrap px-3 py-2 font-semibold text-neutral-950">
              Value
            </th>
            <th className="px-3 py-2 font-semibold text-neutral-950">
              Preview
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((token) => (
            <tr
              className="border-neutral-100 border-b last:border-b-0"
              key={token.name}
            >
              <td className="px-3 py-2.5 align-middle">
                <code className="rounded bg-neutral-50 px-1.5 py-0.5 font-mono text-[13px] text-neutral-900">
                  {token.name}
                </code>
              </td>
              <td className="px-3 py-2.5 align-middle">
                <code className="font-mono text-[13px] text-info-600">
                  {token.token}
                </code>
              </td>
              <td className="px-3 py-2.5 align-middle">
                <code className="font-mono text-[13px] text-neutral-600">
                  {token.value}
                </code>
              </td>
              <td className="px-3 py-2.5 align-middle">{token.preview}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
