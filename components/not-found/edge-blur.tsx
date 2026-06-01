type EdgeBlurProps = {
  className: string;
  gradientClassName: string;
  maskImage: string;
};

function EdgeBlurLayer({
  className,
  gradientClassName,
  maskImage,
}: EdgeBlurProps) {
  const maskStyle = {
    maskImage,
    WebkitMaskImage: maskImage,
  } as const;

  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div
        className={`absolute inset-0 ${gradientClassName}`}
        style={maskStyle}
      />
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={maskStyle}
      />
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          ...maskStyle,
          opacity: 0.85,
        }}
      />
    </div>
  );
}

export function NotFoundEdgeBlur() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
      <EdgeBlurLayer
        className="inset-x-0 top-0 h-28 sm:h-36"
        gradientClassName="bg-gradient-to-b from-background via-background/90 to-transparent"
        maskImage="linear-gradient(to bottom, black 0%, black 30%, transparent 100%)"
      />
      <EdgeBlurLayer
        className="inset-x-0 bottom-0 h-28 sm:h-36"
        gradientClassName="bg-gradient-to-t from-background via-background/90 to-transparent"
        maskImage="linear-gradient(to top, black 0%, black 30%, transparent 100%)"
      />
      <EdgeBlurLayer
        className="inset-y-0 left-0 w-24 sm:w-32"
        gradientClassName="bg-gradient-to-r from-background via-background/90 to-transparent"
        maskImage="linear-gradient(to right, black 0%, black 35%, transparent 100%)"
      />
      <EdgeBlurLayer
        className="inset-y-0 right-0 w-24 sm:w-32"
        gradientClassName="bg-gradient-to-l from-background via-background/90 to-transparent"
        maskImage="linear-gradient(to left, black 0%, black 35%, transparent 100%)"
      />
    </div>
  );
}
