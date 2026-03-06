"use client";

const NAME = "lucidewave";

const HeroName = () => {
  return (
    <h1
      className="hero-name font-bold font-sans text-[40px] text-black leading-[0.95] tracking-[-0.04em] min-[640px]:text-[56px] min-[960px]:text-[72px]"
      style={{ textTransform: "lowercase" }}
    >
      {NAME.split("").map((char, i) => (
        <span
          className="hero-name-char inline-block opacity-0"
          key={i}
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};

export { HeroName };
