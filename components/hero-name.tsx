"use client";

const NAME = "Iconiq";

const HeroName = () => {
  return (
    <h1
      className="hero-name font-sans font-bold leading-[0.95] tracking-[-0.04em] text-black text-[40px] min-[640px]:text-[56px] min-[960px]:text-[72px]"
      style={{ textTransform: "lowercase" }}
    >
      {NAME.split("").map((char, i) => (
        <span
          key={i}
          className="hero-name-char inline-block opacity-0"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

export { HeroName };
