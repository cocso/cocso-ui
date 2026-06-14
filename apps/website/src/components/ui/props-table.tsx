import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface PropDefinition {
  default?: string;
  description: string;
  name: string;
  required?: boolean;
  type: string;
}

interface PropsTableProps extends ComponentProps<"div"> {
  data: PropDefinition[];
}

export const PropsTable = ({ data, className, ...props }: PropsTableProps) => {
  return (
    <div className={twMerge("w-full overflow-x-auto", className)} {...props}>
      <table className="min-w-[640px] table-fixed border-collapse text-[11px]">
        <colgroup>
          <col className="w-[140px]" />
          <col className="w-[220px]" />
          <col className="w-[100px]" />
          <col />
        </colgroup>
        <thead>
          <tr className="border-neutral-200 border-b text-left">
            <th className="px-3 py-2 font-semibold text-neutral-950">Prop</th>
            <th className="px-3 py-2 font-semibold text-neutral-950">Type</th>
            <th className="px-3 py-2 font-semibold text-neutral-950">
              Default
            </th>
            <th className="px-3 py-2 font-semibold text-neutral-950">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((prop) => (
            <tr
              className="border-neutral-100 border-b last:border-b-0"
              key={prop.name}
            >
              <td className="px-3 py-2.5 align-top">
                <code className="rounded bg-neutral-50 px-1.5 py-0.5 font-mono text-[11px] text-neutral-900">
                  {prop.name}
                  {prop.required && (
                    <span className="ml-0.5 text-danger-500">*</span>
                  )}
                </code>
              </td>
              <td className="break-all px-3 py-2.5 align-top">
                <code className="font-mono text-[11px] text-info-600">
                  {prop.type}
                </code>
              </td>
              <td className="px-3 py-2.5 align-top">
                {prop.default ? (
                  <code className="font-mono text-[11px] text-neutral-600">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-neutral-400">-</span>
                )}
              </td>
              <td className="px-3 py-2.5 align-top text-[13px] text-neutral-700">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
