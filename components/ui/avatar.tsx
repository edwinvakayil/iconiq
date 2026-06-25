"use client";

import type { ComponentPropsWithoutRef, ElementRef } from "react";
import * as React from "react";
import {
  Avatar as RegistryAvatar,
  AvatarBadge as RegistryAvatarBadge,
  AvatarFallback as RegistryAvatarFallback,
  AvatarGroup as RegistryAvatarGroup,
  AvatarGroupCount as RegistryAvatarGroupCount,
  AvatarImage as RegistryAvatarImage,
  getAvatarInitials as registryGetAvatarInitials,
} from "@/registry/avatar";

export type {
  AvatarBadgeProps,
  AvatarBadgeVariant,
  AvatarProps,
  AvatarSize,
} from "@/registry/avatar";

type AvatarProps = import("@/registry/avatar").AvatarProps;
type AvatarBadgeProps = import("@/registry/avatar").AvatarBadgeProps;

const Avatar = React.forwardRef<ElementRef<typeof RegistryAvatar>, AvatarProps>(
  (props, ref) => <RegistryAvatar {...props} ref={ref} />
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  ElementRef<typeof RegistryAvatarImage>,
  ComponentPropsWithoutRef<typeof RegistryAvatarImage>
>((props, ref) => <RegistryAvatarImage {...props} ref={ref} />);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  ElementRef<typeof RegistryAvatarFallback>,
  ComponentPropsWithoutRef<typeof RegistryAvatarFallback>
>((props, ref) => <RegistryAvatarFallback {...props} ref={ref} />);
AvatarFallback.displayName = "AvatarFallback";

const AvatarBadge = React.forwardRef<
  ElementRef<typeof RegistryAvatarBadge>,
  AvatarBadgeProps
>((props, ref) => <RegistryAvatarBadge {...props} ref={ref} />);
AvatarBadge.displayName = "AvatarBadge";

const AvatarGroup = React.forwardRef<
  ElementRef<typeof RegistryAvatarGroup>,
  ComponentPropsWithoutRef<typeof RegistryAvatarGroup>
>((props, ref) => <RegistryAvatarGroup {...props} ref={ref} />);
AvatarGroup.displayName = "AvatarGroup";

const AvatarGroupCount = React.forwardRef<
  ElementRef<typeof RegistryAvatarGroupCount>,
  ComponentPropsWithoutRef<typeof RegistryAvatarGroupCount>
>((props, ref) => <RegistryAvatarGroupCount {...props} ref={ref} />);
AvatarGroupCount.displayName = "AvatarGroupCount";

function getAvatarInitials(
  ...args: Parameters<typeof registryGetAvatarInitials>
) {
  return registryGetAvatarInitials(...args);
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  getAvatarInitials,
};
