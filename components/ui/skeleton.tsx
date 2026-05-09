"use client";

import { ShimmerSkeleton as RegistryShimmerSkeleton } from "@/registry/skeleton";

type SkeletonProps = import("@/registry/skeleton").ShimmerSkeletonProps;

function Skeleton(props: SkeletonProps) {
  return <RegistryShimmerSkeleton {...props} />;
}

export { Skeleton, Skeleton as ShimmerSkeleton };
export type { SkeletonProps, SkeletonProps as ShimmerSkeletonProps };
