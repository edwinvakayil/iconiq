"use client";

import { forwardRef } from "react";

import {
  type ColorPickerProps,
  ColorPicker as RegistryColorPicker,
} from "@/registry/color-picker";

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(props, ref) {
    return <RegistryColorPicker ref={ref} {...props} />;
  }
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
export type {
  ColorPickerChangeDetail,
  ColorPickerFormat,
  ColorPickerProps,
  ColorPickerSwatchShape,
} from "@/registry/color-picker";
export default ColorPicker;
