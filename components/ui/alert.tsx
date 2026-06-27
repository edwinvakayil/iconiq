"use client";

import { forwardRef } from "react";

import * as AlertRegistry from "@/registry/alert";

type AlertProps = AlertRegistry.AlertProps;

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <AlertRegistry.default ref={ref} {...props} />;
  }
);

Alert.displayName = "Alert";

const AlertAction = AlertRegistry.AlertAction;
const AlertDescription = AlertRegistry.AlertDescription;
const AlertTitle = AlertRegistry.AlertTitle;

export { Alert, AlertAction, AlertDescription, AlertTitle };
export default Alert;
export type {
  AlertActionProps,
  AlertAppearance,
  AlertDescriptionProps,
  AlertPosition,
  AlertProps,
  AlertSize,
  AlertTitleLines,
  AlertTitleProps,
  AlertVariant,
} from "@/registry/alert";
