export const hexColorRegex = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/;

// Generate Colors Section

export const generateRandomHslColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

export const generateRandomHexColor = () => hslToHex(generateRandomHslColor());

export const getContrastingTextColor = (bgColor: string): string => {
  const hexMatch = bgColor.match(hexColorRegex);
  const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  let hslColor: string = "";

  if (hexMatch) {
    hslColor = hexToHsl(bgColor);
  } else if (rgbMatch) {
    hslColor = rgbToHsl(bgColor);
  } else {
    return "#ffffff"; // fallback
  }

  const hslMatch = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

  if (!hslMatch) return "#ffffff";

  const l = parseInt(hslMatch[3]);

  return l > 50 ? "#000000" : "#ffffff";
};

// Convert colors Section

export const invertHslColor = (hsl: string): string => {
  const hslMatch = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

  if (!hslMatch) throw new Error("Invalid HSL color format");

  const h = parseInt(hslMatch[1]);
  const s = parseInt(hslMatch[2]);
  const l = 100 - parseInt(hslMatch[3]);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const invertHexColor = (hex: string): string => {
  const hsl = hexToHsl(hex);
  return invertHslColor(hsl);
};

export const hexToRgb = (hex: string): string => {
  const isHex = hexColorRegex.test(hex);

  if (!isHex) throw new Error("Invalid hex color format");

  return `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
};

export const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/\d+/g);

  if (!match) throw new Error("Invalid RGB color format");

  const [r, g, b] = match.map(Number);

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToHsl = (rgb: string): string => {
  const match = rgb.match(/\d+/g);

  if (!match) throw new Error("Invalid RGB color format");

  let [r, g, b] = match.map(Number);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s;

  if (max == min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export const hexToHsl = (hex: string): string => {
  const rgbColor = hexToRgb(hex);
  return rgbToHsl(rgbColor);
};

export const hslToHex = (hsl: string): string => {
  const hslMatch = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);

  if (!hslMatch) throw new Error("Invalid HSL color format");

  const h = parseInt(hslMatch[1]);
  const s = parseInt(hslMatch[2]);
  let l = parseInt(hslMatch[3]);
  l /= 100;

  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const normalizeHexColor = (hex: string): string => {
  if (!hex.startsWith("#")) hex = `#${hex}`;

  if (hex.length === 4)
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;

  return hex;
};

// Utils Section

export const hexValueToInputValue = (value: string) => value.slice(1);
