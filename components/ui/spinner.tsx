"use client";

import RegistrySpinner from "@/registry/spinner";

type SpinnerProps = import("@/registry/spinner").SpinnerProps;
type SpinnerSize = import("@/registry/spinner").SpinnerSize;
type SpinnerVariant = import("@/registry/spinner").SpinnerVariant;

function Spinner(props: SpinnerProps) {
  return <RegistrySpinner {...props} />;
}

export { Spinner };
export default Spinner;
export type { SpinnerProps, SpinnerSize, SpinnerVariant };
