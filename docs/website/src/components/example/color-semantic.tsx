'use client';

const semanticColors = [
  { name: 'Text Primary', variable: '--ds-color-text-primary', ref: 'Neutral 950', hex: '#131416' },
  {
    name: 'Text Secondary',
    variable: '--ds-color-text-secondary',
    ref: 'Neutral 600',
    hex: '#58616A',
  },
  {
    name: 'Text Tertiary',
    variable: '--ds-color-text-tertiary',
    ref: 'Neutral 400',
    hex: '#8A949E',
  },
];

export default function ColorSemantic() {
  return (
    <div className="flex w-full flex-col gap-3">
      {semanticColors.map(color => (
        <div key={color.name} className="flex items-center gap-3">
          <div
            className="size-10 shrink-0 rounded-lg border border-neutral-200"
            style={{ backgroundColor: color.hex }}
          />
          <div className="flex flex-col">
            <span className="font-medium text-neutral-950 text-sm">{color.name}</span>
            <span className="text-neutral-500 text-xs">{color.ref}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
