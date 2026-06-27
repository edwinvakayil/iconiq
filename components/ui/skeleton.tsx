"use client";

import RegistrySkeleton, {
  SkeletonAvatar as RegistrySkeletonAvatar,
  SkeletonButton as RegistrySkeletonButton,
  SkeletonText as RegistrySkeletonText,
} from "@/registry/skeleton";

type SkeletonProps = import("@/registry/skeleton").SkeletonProps;

function Skeleton(props: SkeletonProps) {
  return <RegistrySkeleton {...props} />;
}

function SkeletonAvatar(props: Omit<SkeletonProps, "rounded">) {
  return <RegistrySkeletonAvatar {...props} />;
}

function SkeletonButton(props: Omit<SkeletonProps, "rounded">) {
  return <RegistrySkeletonButton {...props} />;
}

function SkeletonText(props: SkeletonProps) {
  return <RegistrySkeletonText {...props} />;
}

const ShimmerSkeleton = Skeleton;

export {
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonText,
  ShimmerSkeleton,
};
export default Skeleton;
export type {
  ShimmerSkeletonProps,
  SkeletonProps,
  SkeletonRounded,
  SkeletonVariant,
} from "@/registry/skeleton";
