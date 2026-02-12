'use client';

const palettes = [
  {
    name: 'Neutral',
    shades: [
      { level: '50', hex: '#F4F5F6' },
      { level: '100', hex: '#E6E8EA' },
      { level: '200', hex: '#CDD1D5' },
      { level: '300', hex: '#B1B8BE' },
      { level: '400', hex: '#8A949E' },
      { level: '500', hex: '#6D7882' },
      { level: '600', hex: '#58616A' },
      { level: '700', hex: '#464C53' },
      { level: '800', hex: '#33363D' },
      { level: '900', hex: '#1E2124' },
      { level: '950', hex: '#131416' },
    ],
  },
  {
    name: 'Primary',
    shades: [
      { level: '50', hex: '#ECF2FE' },
      { level: '100', hex: '#D8E5FD' },
      { level: '200', hex: '#B1CEFB' },
      { level: '300', hex: '#86AFF9' },
      { level: '400', hex: '#4C87F6' },
      { level: '500', hex: '#256EF4' },
      { level: '600', hex: '#0B50D0' },
      { level: '700', hex: '#083891' },
      { level: '800', hex: '#052561' },
      { level: '900', hex: '#03163A' },
      { level: '950', hex: '#020F27' },
    ],
  },
  {
    name: 'Danger',
    shades: [
      { level: '50', hex: '#FDEFEC' },
      { level: '100', hex: '#FCDFD9' },
      { level: '200', hex: '#F7AFA1' },
      { level: '300', hex: '#F48771' },
      { level: '400', hex: '#F05F42' },
      { level: '500', hex: '#DE3412' },
      { level: '600', hex: '#BD2C0F' },
      { level: '700', hex: '#8A240F' },
      { level: '800', hex: '#5C180A' },
      { level: '900', hex: '#390D05' },
      { level: '950', hex: '#260903' },
    ],
  },
  {
    name: 'Warning',
    shades: [
      { level: '50', hex: '#FFF3DB' },
      { level: '100', hex: '#FFE0A3' },
      { level: '200', hex: '#FFC95C' },
      { level: '300', hex: '#FFB114' },
      { level: '400', hex: '#C78500' },
      { level: '500', hex: '#9E6A00' },
      { level: '600', hex: '#8A5C00' },
      { level: '700', hex: '#614100' },
      { level: '800', hex: '#422C00' },
      { level: '900', hex: '#2E1F00' },
      { level: '950', hex: '#241800' },
    ],
  },
  {
    name: 'Success',
    shades: [
      { level: '50', hex: '#EAF6EC' },
      { level: '100', hex: '#D8EEDD' },
      { level: '200', hex: '#A9DAB4' },
      { level: '300', hex: '#7EC88E' },
      { level: '400', hex: '#3FA654' },
      { level: '500', hex: '#228738' },
      { level: '600', hex: '#267337' },
      { level: '700', hex: '#285D33' },
      { level: '800', hex: '#1F4727' },
      { level: '900', hex: '#122B18' },
      { level: '950', hex: '#0E2012' },
    ],
  },
];

export default function ColorPalette() {
  return (
    <div className="flex w-full flex-col gap-6">
      {palettes.map(palette => (
        <div key={palette.name} className="flex flex-col gap-2">
          <span className="font-medium text-neutral-950 text-sm">{palette.name}</span>
          <div className="grid grid-cols-11 gap-1">
            {palette.shades.map(shade => (
              <div key={shade.level} className="flex flex-col items-center gap-1">
                <div
                  className="aspect-square w-full rounded-lg border border-neutral-200"
                  style={{ backgroundColor: shade.hex }}
                />
                <span className="text-[10px] text-neutral-500">{shade.level}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
