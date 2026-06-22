"use client";

import { ChevronDown, Pipette } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const controlCornerInheritClassName =
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]";

const FORMAT_OPTIONS = ["HEX", "RGB", "HSL", "OKLCH"] as const;
const FORMAT_MENU_SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const HEX_HASH_PREFIX = /^#/;
const HEX_RGB_PATTERN = /^[0-9A-F]{6}$/;
const HEX_RGBA_PATTERN = /^[0-9A-F]{8}$/;
const HEX_INPUT_SANITIZE_PATTERN = /[^0-9a-fA-F]/g;

const formatMenuPanelClassName =
  "absolute top-full left-0 z-50 mt-1.5 w-28 origin-top-left overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-1 text-[color:var(--color-card-foreground)] shadow-[0_10px_28px_-20px_rgba(15,23,42,0.28)] dark:shadow-[0_12px_32px_-22px_rgba(0,0,0,0.5)]";

const formatMenuItemClassName =
  "relative w-full px-3 py-1.5 text-left text-sm outline-none transition-[color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

const formatMenuHighlightClassName =
  "absolute inset-0 bg-[color:var(--color-accent)]";

const formatMenuHighlightTransition = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.72,
};

const formatTriggerTransitionClassName =
  "transition-[color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

function getFormatMenuMotion() {
  return {
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: -6,
    },
    initial: {
      opacity: 0,
      scale: 0.94,
      y: -8,
    },
    transition: {
      duration: 0.26,
      ease: FORMAT_MENU_SOFT_EASE,
    },
  };
}

function getFormatItemMotion(index: number) {
  return {
    animate: { opacity: 1, x: 0 },
    initial: { opacity: 0, x: -8 },
    transition: {
      delay: 0.04 + index * 0.035,
      duration: 0.22,
      ease: FORMAT_MENU_SOFT_EASE,
    },
  };
}

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const alphaCheckerClassName =
  "bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)] bg-[length:10px_10px]";

type Format = (typeof FORMAT_OPTIONS)[number];

export interface ColorPickerProps {
  /** Merged onto the outer picker shell. */
  className?: string;
  /** Starting color for uncontrolled usage (6- or 8-digit hex, with or without `#`). */
  defaultValue?: string;
  /** Starting alpha percentage (0–100) when `defaultValue` has no alpha channel. */
  defaultAlpha?: number;
  /** Disables interaction and lowers opacity. */
  disabled?: boolean;
  /** Called when the selected color changes. Emits `#RRGGBB` or `#RRGGBBAA` when alpha is below 100%. */
  onChange?: (color: string) => void;
  /** Fires when EyeDropper is unavailable (no `window.alert` is shown). */
  onEyedropperUnsupported?: () => void;
  /** Hides the pipette control when false. */
  showEyedropper?: boolean;
  /** Controlled hex color (6- or 8-digit, with or without `#`). */
  value?: string;
}

/** @deprecated Use ColorPicker instead. */
export type FluidColorPickerProps = ColorPickerProps;

function hsvToRgb(h: number, s: number, v: number) {
  const saturation = s / 100;
  const brightness = v / 100;
  const chroma = brightness * saturation;
  const intermediate = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const minimum = brightness - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) {
    red = chroma;
    green = intermediate;
  } else if (h < 120) {
    red = intermediate;
    green = chroma;
  } else if (h < 180) {
    green = chroma;
    blue = intermediate;
  } else if (h < 240) {
    green = intermediate;
    blue = chroma;
  } else if (h < 300) {
    red = intermediate;
    blue = chroma;
  } else {
    red = chroma;
    blue = intermediate;
  }

  return {
    r: Math.round((red + minimum) * 255),
    g: Math.round((green + minimum) * 255),
    b: Math.round((blue + minimum) * 255),
  };
}

function toHex(value: number) {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex(red: number, green: number, blue: number) {
  return `${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function rgbToHsv(red: number, green: number, blue: number) {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === normalizedRed) {
      hue = ((normalizedGreen - normalizedBlue) / delta) % 6;
    } else if (max === normalizedGreen) {
      hue = (normalizedBlue - normalizedRed) / delta + 2;
    } else {
      hue = (normalizedRed - normalizedGreen) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }
  }

  const saturation = max === 0 ? 0 : (delta / max) * 100;
  const value = max * 100;

  return { h: hue, s: saturation, v: value };
}

function rgbToHsl(red: number, green: number, blue: number) {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === normalizedRed) {
      hue = ((normalizedGreen - normalizedBlue) / delta) % 6;
    } else if (max === normalizedGreen) {
      hue = (normalizedBlue - normalizedRed) / delta + 2;
    } else {
      hue = (normalizedRed - normalizedGreen) / delta + 4;
    }
    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function srgbToLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.040_45
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function rgbToOklch(red: number, green: number, blue: number) {
  const linearRed = srgbToLinear(red);
  const linearGreen = srgbToLinear(green);
  const linearBlue = srgbToLinear(blue);
  const lightnessCandidate =
    0.412_221_470_8 * linearRed +
    0.536_332_536_3 * linearGreen +
    0.051_445_992_9 * linearBlue;
  const mediumCandidate =
    0.211_903_498_2 * linearRed +
    0.680_699_545_1 * linearGreen +
    0.107_396_956_6 * linearBlue;
  const shortCandidate =
    0.088_302_461_9 * linearRed +
    0.281_718_837_6 * linearGreen +
    0.629_978_700_5 * linearBlue;
  const lightness =
    0.210_454_255_3 * lightnessCandidate ** (1 / 3) +
    0.793_617_785 * mediumCandidate ** (1 / 3) -
    0.004_072_046_8 * shortCandidate ** (1 / 3);
  const axisA =
    1.977_998_495_1 * lightnessCandidate ** (1 / 3) -
    2.428_592_205 * mediumCandidate ** (1 / 3) +
    0.450_593_709_9 * shortCandidate ** (1 / 3);
  const axisB =
    0.025_904_037_1 * lightnessCandidate ** (1 / 3) +
    0.782_771_766_2 * mediumCandidate ** (1 / 3) -
    0.808_675_766 * shortCandidate ** (1 / 3);
  const chroma = Math.hypot(axisA, axisB);
  let hue = (Math.atan2(axisB, axisA) * 180) / Math.PI;
  if (hue < 0) {
    hue += 360;
  }

  return { l: lightness, c: chroma, h: hue };
}

function clampChannel(value: number, min = 0, max = 255) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function linearToSrgb(channel: number) {
  const absolute = Math.abs(channel);

  if (absolute > 0.003_130_8) {
    return Math.sign(channel) * (1.055 * absolute ** (1 / 2.4) - 0.055);
  }

  return 12.92 * channel;
}

function hslToRgb(hue: number, saturation: number, lightness: number) {
  const saturationNormalized = saturation / 100;
  const lightnessNormalized = lightness / 100;
  const chroma =
    (1 - Math.abs(2 * lightnessNormalized - 1)) * saturationNormalized;
  const intermediate = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const minimum = lightnessNormalized - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = chroma;
    green = intermediate;
  } else if (hue < 120) {
    red = intermediate;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = intermediate;
  } else if (hue < 240) {
    green = intermediate;
    blue = chroma;
  } else if (hue < 300) {
    red = intermediate;
    blue = chroma;
  } else {
    red = chroma;
    blue = intermediate;
  }

  return {
    r: clampChannel((red + minimum) * 255),
    g: clampChannel((green + minimum) * 255),
    b: clampChannel((blue + minimum) * 255),
  };
}

function oklchToRgb(lightness: number, chroma: number, hue: number) {
  const hueRadians = (hue * Math.PI) / 180;
  const axisA = chroma * Math.cos(hueRadians);
  const axisB = chroma * Math.sin(hueRadians);
  const lightnessPrime =
    lightness + 0.396_337_777_4 * axisA + 0.215_803_757_3 * axisB;
  const mediumPrime =
    lightness - 0.105_561_345_8 * axisA - 0.063_854_172_8 * axisB;
  const shortPrime =
    lightness - 0.089_484_177_5 * axisA - 1.291_485_548 * axisB;
  const linearRed =
    4.076_741_662_1 * lightnessPrime ** 3 -
    3.307_711_591_3 * mediumPrime ** 3 +
    0.230_969_929_2 * shortPrime ** 3;
  const linearGreen =
    -1.268_438_004_6 * lightnessPrime ** 3 +
    2.609_757_401_1 * mediumPrime ** 3 -
    0.341_319_396_5 * shortPrime ** 3;
  const linearBlue =
    -0.004_196_086_3 * lightnessPrime ** 3 -
    0.703_418_614_7 * mediumPrime ** 3 +
    1.707_614_701 * shortPrime ** 3;

  return {
    r: clampChannel(linearToSrgb(linearRed) * 255),
    g: clampChannel(linearToSrgb(linearGreen) * 255),
    b: clampChannel(linearToSrgb(linearBlue) * 255),
  };
}

function expandShortHex(normalized: string) {
  if (normalized.length === 3) {
    return normalized
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
  }

  return normalized;
}

type ParsedHexColor = Rgb & { alpha?: number };

function parseHexColor(input?: string): ParsedHexColor | null {
  if (!input) {
    return null;
  }

  const normalized = expandShortHex(
    input.trim().replace(HEX_HASH_PREFIX, "").toUpperCase()
  );

  if (HEX_RGB_PATTERN.test(normalized)) {
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  if (HEX_RGBA_PATTERN.test(normalized)) {
    const alphaChannel = Number.parseInt(normalized.slice(6, 8), 16);

    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
      alpha: Math.round((alphaChannel / 255) * 100),
    };
  }

  return null;
}

function formatColorValue(rgb: Rgb, alpha: number) {
  const hex = `#${rgbToHex(rgb.r, rgb.g, rgb.b)}`;

  if (alpha >= 100) {
    return hex;
  }

  const alphaChannel = Math.max(
    0,
    Math.min(255, Math.round((alpha / 100) * 255))
  );

  return `${hex}${toHex(alphaChannel)}`;
}

function getInitialAlpha(color: string | undefined, fallbackAlpha: number) {
  const parsed = parseHexColor(color);

  if (parsed?.alpha !== undefined) {
    return parsed.alpha;
  }

  return Math.max(0, Math.min(100, Math.round(fallbackAlpha)));
}

type Rgb = { r: number; g: number; b: number };

const DEFAULT_RGB: Rgb = { r: 59, g: 130, b: 246 };

function getInitialRgb(color?: string): Rgb {
  return parseHexColor(color) ?? DEFAULT_RGB;
}

function normalizeColorValue(color: string, alphaFallback = 100) {
  const parsed = parseHexColor(color);

  if (!parsed) {
    return null;
  }

  const { alpha, ...rgb } = parsed;

  return formatColorValue(rgb, alpha ?? alphaFallback);
}

function getPickerHsv(rgb: Rgb) {
  const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);

  return {
    h,
    s: Math.round(s),
    v: Math.round(v),
  };
}

export function ColorPicker({
  className,
  defaultAlpha = 100,
  defaultValue = "#3B82F6",
  disabled = false,
  onChange,
  onEyedropperUnsupported,
  showEyedropper = true,
  value,
}: ColorPickerProps) {
  const initialRgb = getInitialRgb(value ?? defaultValue);
  const initialAlpha = getInitialAlpha(value ?? defaultValue, defaultAlpha);
  const initialPickerHsv = getPickerHsv(initialRgb);
  const [rgb, setRgb] = useState<Rgb>(initialRgb);
  const [pickerHue, setPickerHue] = useState(initialPickerHsv.h);
  const [pickerSat, setPickerSat] = useState(initialPickerHsv.s);
  const [pickerVal, setPickerVal] = useState(initialPickerHsv.v);
  const [alpha, setAlpha] = useState(initialAlpha);
  const [format, setFormat] = useState<Format>("HEX");
  const [formatOpen, setFormatOpen] = useState(false);
  const [hoveredFormat, setHoveredFormat] = useState<Format | null>(null);
  const [hexInput, setHexInput] = useState("");
  const [hexFocused, setHexFocused] = useState(false);
  const onChangeRef = useRef(onChange);
  const rgbRef = useRef(initialRgb);
  const pickerHueRef = useRef(initialPickerHsv.h);
  const pickerSatRef = useRef(initialPickerHsv.s);
  const pickerValRef = useRef(initialPickerHsv.v);
  const alphaRef = useRef(initialAlpha);
  const lastEmittedColorRef = useRef(
    normalizeColorValue(value ?? defaultValue, defaultAlpha) ??
      formatColorValue(initialRgb, initialAlpha)
  );
  const isEditingRef = useRef(false);
  const isDraggingSvRef = useRef(false);
  const isDraggingHueRef = useRef(false);
  const isDraggingAlphaRef = useRef(false);

  const { r, g, b } = rgb;
  const hex = rgbToHex(r, g, b);
  const hueColor = hsvToRgb(pickerHue, 100, 100);
  const hueHex = rgbToHex(hueColor.r, hueColor.g, hueColor.b);
  const colorValue = formatColorValue(rgb, alpha);

  rgbRef.current = rgb;
  alphaRef.current = alpha;
  pickerHueRef.current = pickerHue;
  pickerSatRef.current = pickerSat;
  pickerValRef.current = pickerVal;
  onChangeRef.current = onChange;

  const syncPickerFromRgb = useCallback((nextRgb: Rgb) => {
    const nextPickerHsv = getPickerHsv(nextRgb);
    const nextHue =
      nextPickerHsv.s === 0 ? pickerHueRef.current : nextPickerHsv.h;

    pickerHueRef.current = nextHue;
    pickerSatRef.current = nextPickerHsv.s;
    pickerValRef.current = nextPickerHsv.v;
    setPickerHue(nextHue);
    setPickerSat(nextPickerHsv.s);
    setPickerVal(nextPickerHsv.v);
  }, []);

  const emitColor = useCallback(
    (nextRgb: Rgb, nextAlpha = alphaRef.current) => {
      const normalized = formatColorValue(nextRgb, nextAlpha);

      if (normalized === lastEmittedColorRef.current) {
        return;
      }

      lastEmittedColorRef.current = normalized;
      onChangeRef.current?.(normalized);
    },
    []
  );

  const applyAlpha = useCallback(
    (nextAlpha: number, shouldEmit = true) => {
      const clampedAlpha = Math.max(0, Math.min(100, Math.round(nextAlpha)));

      alphaRef.current = clampedAlpha;
      setAlpha(clampedAlpha);

      if (shouldEmit) {
        emitColor(rgbRef.current, clampedAlpha);
      }
    },
    [emitColor]
  );

  const applyRgb = useCallback(
    (nextRgb: Rgb, shouldEmit = true, syncPicker = true) => {
      rgbRef.current = nextRgb;
      setRgb(nextRgb);

      if (syncPicker) {
        syncPickerFromRgb(nextRgb);
      }

      if (shouldEmit) {
        emitColor(nextRgb);
      }
    },
    [emitColor, syncPickerFromRgb]
  );

  const applyPickerHsv = useCallback(
    (
      nextHue: number,
      nextSaturation: number,
      nextValue: number,
      shouldEmit = true
    ) => {
      const roundedSaturation = Math.max(
        0,
        Math.min(100, Math.round(nextSaturation))
      );
      const roundedValue = Math.max(0, Math.min(100, Math.round(nextValue)));
      const nextRgb = hsvToRgb(nextHue, roundedSaturation, roundedValue);

      pickerHueRef.current = nextHue;
      pickerSatRef.current = roundedSaturation;
      pickerValRef.current = roundedValue;
      setPickerHue(nextHue);
      setPickerSat(roundedSaturation);
      setPickerVal(roundedValue);
      applyRgb(nextRgb, shouldEmit, false);
    },
    [applyRgb]
  );

  const setFromHex = useCallback(
    (nextValue: string) => {
      const parsed = parseHexColor(nextValue);

      if (!parsed) {
        return false;
      }

      applyRgb(parsed);
      return true;
    },
    [applyRgb]
  );

  const setFromHsl = useCallback(
    (nextHue: number, nextSaturation: number, nextLightness: number) => {
      applyRgb(hslToRgb(nextHue, nextSaturation, nextLightness));
    },
    [applyRgb]
  );

  const setFromOklch = useCallback(
    (nextLightness: number, nextChroma: number, nextHue: number) => {
      applyRgb(oklchToRgb(nextLightness, nextChroma, nextHue));
    },
    [applyRgb]
  );

  const commitHexInput = useCallback(
    (rawValue: string) => {
      const normalized = rawValue
        .trim()
        .replace(HEX_HASH_PREFIX, "")
        .toUpperCase();

      if (normalized.length === 6) {
        return setFromHex(normalized);
      }

      if (normalized.length === 3) {
        return setFromHex(expandShortHex(normalized));
      }

      return false;
    },
    [setFromHex]
  );

  useEffect(() => {
    if (
      !value ||
      isEditingRef.current ||
      hexFocused ||
      isDraggingSvRef.current ||
      isDraggingHueRef.current ||
      isDraggingAlphaRef.current
    ) {
      return;
    }

    const normalizedValue = normalizeColorValue(value, defaultAlpha);

    if (!normalizedValue || normalizedValue === lastEmittedColorRef.current) {
      return;
    }

    const parsed = parseHexColor(normalizedValue);

    if (!parsed) {
      return;
    }

    const { alpha: parsedAlpha, ...nextRgb } = parsed;
    const nextAlpha = parsedAlpha ?? defaultAlpha;

    lastEmittedColorRef.current = normalizedValue;
    rgbRef.current = nextRgb;
    alphaRef.current = nextAlpha;
    setRgb(nextRgb);
    setAlpha(nextAlpha);
    syncPickerFromRgb(nextRgb);
  }, [defaultAlpha, hexFocused, syncPickerFromRgb, value]);

  const svRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<null | "sv" | "hue" | "alpha">(null);
  const formatMenuRef = useRef<HTMLDivElement>(null);
  const formatMenuMotion = getFormatMenuMotion();

  const updateSV = useCallback(
    (event: { clientX: number; clientY: number }, shouldEmit = false) => {
      const element = svRef.current;

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );
      const y = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
      );

      applyPickerHsv(
        pickerHueRef.current,
        Math.round(x * 100),
        Math.round((1 - y) * 100),
        shouldEmit
      );
    },
    [applyPickerHsv]
  );

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (dragRef.current === "sv") {
        updateSV(event, false);
      }
    };
    const up = () => {
      if (
        dragRef.current === "sv" ||
        dragRef.current === "hue" ||
        dragRef.current === "alpha"
      ) {
        emitColor(rgbRef.current, alphaRef.current);
      }

      dragRef.current = null;
      isDraggingSvRef.current = false;
      isDraggingHueRef.current = false;
      isDraggingAlphaRef.current = false;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [emitColor, updateSV]);

  useEffect(() => {
    if (!formatOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (formatMenuRef.current?.contains(target)) {
        return;
      }

      setFormatOpen(false);
      setHoveredFormat(null);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [formatOpen]);

  useEffect(() => {
    if (!formatOpen) {
      setHoveredFormat(null);
    }
  }, [formatOpen]);

  const pickWithEyedropper = useCallback(async () => {
    const browserWindow = window as Window & {
      EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
    };

    if (!browserWindow.EyeDropper) {
      onEyedropperUnsupported?.();
      return;
    }

    try {
      const result = await new browserWindow.EyeDropper().open();
      setFromHex(result.sRGBHex);
    } catch {
      // User cancelled the picker.
    }
  }, [onEyedropperUnsupported, setFromHex]);

  const hsl = useMemo(() => rgbToHsl(r, g, b), [r, g, b]);
  const oklch = useMemo(() => rgbToOklch(r, g, b), [r, g, b]);

  return (
    <div
      aria-disabled={disabled || undefined}
      className={cn(
        componentThemeClassName,
        controlCornerClassName,
        "relative isolate w-[300px] max-w-full overflow-visible border border-border bg-card p-3.5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.16)] dark:shadow-[0_12px_32px_-20px_rgba(0,0,0,0.35)]",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      data-slot="color-picker"
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-10 overflow-hidden opacity-[0.12] blur-2xl motion-reduce:opacity-0",
          controlCornerClassName
        )}
      >
        <div
          className="absolute top-[20%] left-[20%] h-32 w-32 animate-pulse rounded-full motion-reduce:animate-none"
          style={{
            background: colorValue,
            transition: "background 0.3s",
          }}
        />
        <div
          className="absolute right-[10%] bottom-[10%] h-24 w-24 animate-pulse rounded-full [animation-delay:1.2s] motion-reduce:animate-none"
          style={{
            background: `#${hueHex}`,
            transition: "background 0.3s",
          }}
        />
      </div>

      <div className="relative">
        <div
          className={cn(
            "relative h-40 w-full cursor-crosshair touch-none select-none overflow-hidden transition-[background-color] duration-300",
            controlCornerClassName
          )}
          onPointerDown={(event) => {
            dragRef.current = "sv";
            isDraggingSvRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            updateSV(event, false);
          }}
          ref={svRef}
          style={{ backgroundColor: `#${hueHex}` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, #fff, transparent)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #000, transparent)" }}
          />
          <div
            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
            style={{
              left: `${pickerSat}%`,
              top: `${100 - pickerVal}%`,
              backgroundColor: colorValue,
            }}
          />
        </div>

        <div
          className="relative mt-3 h-2.5 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
          }}
        >
          <input
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            max={360}
            min={0}
            onChange={(event) => {
              applyPickerHsv(
                Number(event.target.value),
                pickerSatRef.current,
                pickerValRef.current,
                false
              );
            }}
            onPointerDown={(event) => {
              dragRef.current = "hue";
              isDraggingHueRef.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            type="range"
            value={pickerHue}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white shadow"
            style={{ left: `${(pickerHue / 360) * 100}%` }}
          />
        </div>

        <div
          className={cn(
            "relative mt-2.5 h-2.5 overflow-hidden rounded-full",
            alphaCheckerClassName
          )}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, transparent, ${colorValue})`,
            }}
          />
          <input
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            max={100}
            min={0}
            onChange={(event) => {
              applyAlpha(Number(event.target.value), false);
            }}
            onPointerDown={(event) => {
              dragRef.current = "alpha";
              isDraggingAlphaRef.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            type="range"
            value={alpha}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white shadow"
            style={{ left: `${alpha}%` }}
          />
        </div>

        <div className="relative z-20 mt-4 flex items-center justify-between text-muted-foreground text-sm">
          <div className="relative z-30" ref={formatMenuRef}>
            <button
              aria-expanded={formatOpen}
              aria-haspopup="listbox"
              className={cn(
                "flex items-center gap-1 px-1 py-0.5 hover:bg-[color:var(--color-accent)] hover:text-foreground",
                controlCornerClassName,
                formatTriggerTransitionClassName
              )}
              onClick={() => setFormatOpen((open) => !open)}
              type="button"
            >
              {format}
              <motion.span
                animate={{ rotate: formatOpen ? 180 : 0 }}
                transition={{
                  duration: 0.22,
                  ease: FORMAT_MENU_SOFT_EASE,
                }}
              >
                <ChevronDown className="h-3 w-3" />
              </motion.span>
            </button>
            <AnimatePresence>
              {formatOpen ? (
                <motion.div
                  {...formatMenuMotion}
                  className={cn(
                    formatMenuPanelClassName,
                    controlCornerClassName
                  )}
                  role="listbox"
                >
                  {FORMAT_OPTIONS.map((option, index) => {
                    const isSelected = format === option;
                    const isHovered = hoveredFormat === option;
                    const showHighlight =
                      isHovered || (hoveredFormat === null && isSelected);

                    return (
                      <motion.button
                        {...getFormatItemMotion(index)}
                        aria-selected={isSelected}
                        className={cn(
                          formatMenuItemClassName,
                          controlCornerClassName,
                          isSelected || isHovered
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                        key={option}
                        onClick={() => {
                          setFormat(option);
                          setFormatOpen(false);
                        }}
                        onMouseEnter={() => setHoveredFormat(option)}
                        onMouseLeave={() => setHoveredFormat(null)}
                        role="option"
                        type="button"
                      >
                        {showHighlight ? (
                          <motion.span
                            className={cn(
                              formatMenuHighlightClassName,
                              controlCornerInheritClassName
                            )}
                            layoutId="color-picker-format-highlight"
                            transition={formatMenuHighlightTransition}
                          />
                        ) : null}
                        <span
                          className={cn(
                            "relative z-10 block",
                            isSelected && "font-medium"
                          )}
                        >
                          {option}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {showEyedropper ? (
            <button
              aria-label="Pick color from screen"
              className="transition-colors hover:text-foreground"
              disabled={disabled}
              onClick={pickWithEyedropper}
              title="Pick color from screen"
              type="button"
            >
              <Pipette className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="relative z-10 mt-2 flex items-center gap-2 text-foreground">
          {format === "HEX" ? (
            <>
              <span className="font-light text-base text-muted-foreground">
                #
              </span>
              <input
                className="flex-1 bg-transparent font-light text-base tracking-wide outline-none"
                onBlur={() => {
                  isEditingRef.current = false;
                  setHexFocused(false);
                  commitHexInput(hexInput);
                }}
                onChange={(event) => {
                  const nextValue = event.target.value
                    .replace(HEX_INPUT_SANITIZE_PATTERN, "")
                    .slice(0, 6)
                    .toUpperCase();
                  setHexInput(nextValue);

                  if (nextValue.length === 6) {
                    commitHexInput(nextValue);
                  }
                }}
                onFocus={() => {
                  isEditingRef.current = true;
                  setHexInput(hex);
                  setHexFocused(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                spellCheck={false}
                value={hexFocused ? hexInput : hex}
              />
              <ChannelInput
                max={100}
                min={0}
                onChange={applyAlpha}
                suffix="%"
                value={alpha}
              />
            </>
          ) : null}
          {format === "RGB" ? (
            <>
              <ChannelInput
                max={255}
                min={0}
                onChange={(nextRed) => applyRgb({ r: nextRed, g, b })}
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                value={r}
              />
              <ChannelInput
                max={255}
                min={0}
                onChange={(nextGreen) => applyRgb({ r, g: nextGreen, b })}
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                value={g}
              />
              <ChannelInput
                max={255}
                min={0}
                onChange={(nextBlue) => applyRgb({ r, g, b: nextBlue })}
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                value={b}
              />
              <ChannelInput
                max={100}
                min={0}
                onChange={applyAlpha}
                suffix="%"
                value={alpha}
              />
            </>
          ) : null}
          {format === "HSL" ? (
            <>
              <ChannelInput
                max={360}
                min={0}
                onChange={(nextHue) => setFromHsl(nextHue, hsl.s, hsl.l)}
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                value={hsl.h}
              />
              <ChannelInput
                max={100}
                min={0}
                onChange={(nextSaturation) =>
                  setFromHsl(hsl.h, nextSaturation, hsl.l)
                }
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                value={hsl.s}
              />
              <ChannelInput
                max={100}
                min={0}
                onChange={(nextLightness) =>
                  setFromHsl(hsl.h, hsl.s, nextLightness)
                }
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                value={hsl.l}
              />
              <ChannelInput
                max={100}
                min={0}
                onChange={applyAlpha}
                suffix="%"
                value={alpha}
              />
            </>
          ) : null}
          {format === "OKLCH" ? (
            <>
              <ChannelInput
                max={1}
                min={0}
                onChange={(nextLightness) =>
                  setFromOklch(nextLightness, oklch.c, oklch.h)
                }
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                step={0.01}
                value={Math.round(oklch.l * 100) / 100}
              />
              <ChannelInput
                max={0.4}
                min={0}
                onChange={(nextChroma) =>
                  setFromOklch(oklch.l, nextChroma, oklch.h)
                }
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                step={0.001}
                value={Math.round(oklch.c * 1000) / 1000}
              />
              <ChannelInput
                max={360}
                min={0}
                onChange={(nextHue) => setFromOklch(oklch.l, oklch.c, nextHue)}
                onEditEnd={() => {
                  isEditingRef.current = false;
                }}
                onEditStart={() => {
                  isEditingRef.current = true;
                }}
                value={Math.round(oklch.h)}
              />
              <ChannelInput
                max={100}
                min={0}
                onChange={applyAlpha}
                suffix="%"
                value={alpha}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ChannelInput({
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
  onEditEnd,
  onEditStart,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
  onEditEnd?: () => void;
  onEditStart?: () => void;
}) {
  const [local, setLocal] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const displayValue = focused ? local : String(value);

  useEffect(() => {
    if (!focused) {
      setLocal(String(value));
    }
  }, [focused, value]);

  const commit = () => {
    const parsed = Number(local);

    if (Number.isNaN(parsed) || local.trim() === "") {
      setLocal(String(value));
      return;
    }

    onChange(Math.max(min, Math.min(max, parsed)));
  };

  return (
    <div className="flex min-w-0 flex-1 items-baseline justify-center gap-0.5">
      <input
        aria-label={suffix ? `Value ${suffix}` : "Channel value"}
        className="w-full min-w-0 bg-transparent text-center font-light text-base tabular-nums outline-none"
        inputMode="decimal"
        onBlur={() => {
          setFocused(false);
          onEditEnd?.();
          commit();
        }}
        onChange={(event) => {
          setLocal(event.target.value);
        }}
        onFocus={() => {
          onEditStart?.();
          setLocal(String(value));
          setFocused(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        step={step}
        type="text"
        value={displayValue}
      />
      {suffix ? (
        <span className="text-muted-foreground text-sm">{suffix}</span>
      ) : null}
    </div>
  );
}

export { ColorPicker as FluidColorPicker };
export default ColorPicker;
