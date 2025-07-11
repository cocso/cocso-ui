export declare function createColor(token: string | undefined): string | undefined;
declare const FONT_WEIGHT_MAP: {
    readonly thin: "100";
    readonly 'extra-light': "200";
    readonly light: "300";
    readonly normal: "400";
    readonly medium: "500";
    readonly 'semi-bold': "600";
    readonly bold: "700";
    readonly 'extra-bold': "800";
    readonly black: "900";
};
export type FontWeightToken = keyof typeof FONT_WEIGHT_MAP;
export declare function createFontWeight(token: string | undefined): string | undefined;
export {};
