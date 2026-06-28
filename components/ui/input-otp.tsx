"use client";

import type { ComponentPropsWithoutRef } from "react";
import {
  OTP as RegistryOTP,
  OTPGroup as RegistryOTPGroup,
  OTPSeparator as RegistryOTPSeparator,
  OTPSlot as RegistryOTPSlot,
  OTPSlots as RegistryOTPSlots,
} from "@/registry/input-otp";

export type {
  OTPProps,
  OTPSize,
  OTPSlotProps,
  OTPSlotsProps,
} from "@/registry/input-otp";

function OTP(props: import("@/registry/input-otp").OTPProps) {
  return <RegistryOTP {...props} />;
}

function OTPGroup(props: ComponentPropsWithoutRef<typeof RegistryOTPGroup>) {
  return <RegistryOTPGroup {...props} />;
}

function OTPSeparator(
  props: ComponentPropsWithoutRef<typeof RegistryOTPSeparator>
) {
  return <RegistryOTPSeparator {...props} />;
}

function OTPSlot(props: import("@/registry/input-otp").OTPSlotProps) {
  return <RegistryOTPSlot {...props} />;
}

function OTPSlots(props: import("@/registry/input-otp").OTPSlotsProps) {
  return <RegistryOTPSlots {...props} />;
}

export { OTP, OTPGroup, OTPSeparator, OTPSlot, OTPSlots };
