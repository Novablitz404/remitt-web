import Image from "next/image";

// TEMPORARY holding page while the site is rebuilt — a single full-screen
// section over the hero photo, copy anchored to the left so the photo stays
// visible. The full landing page is preserved in landing-full.tsx.bak;
// restore from there when the new site is ready.
export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <Image
        src="/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_30%]"
      />
      {/* Darken the left side for legibility; leave the photo visible on
          the right. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/15" />

      <div className="relative flex max-w-xl flex-col items-start px-6 py-16 text-left sm:px-10 lg:px-20">
        <Image
          src="/remitt_wht_horizontal.png"
          alt="Remitt"
          width={300}
          height={68}
          priority
          className="h-14 w-auto drop-shadow-lg sm:h-16"
        />
        <h1 className="mt-10 font-display text-4xl font-extrabold leading-tight text-white drop-shadow-md sm:text-5xl">
          We&rsquo;re rebuilding to a better Remitt.
        </h1>
        <p className="mt-5 text-lg font-medium leading-relaxed text-white drop-shadow-md sm:text-xl">
          Our new website is on its way.
        </p>
        <div className="mt-12 flex items-center gap-3">
          <span className="text-sm font-medium text-white/70 drop-shadow-md">
            Powered by
          </span>
          {/* Black logotype flipped to white for the dark backdrop. */}
          <Image
            src="/Stellar Logo Final Black RGB.png"
            alt="Stellar"
            width={140}
            height={35}
            className="h-6 w-auto invert drop-shadow-md sm:h-7"
          />
        </div>
      </div>

      <p className="absolute bottom-6 left-6 text-xs text-white/70 sm:left-10 lg:left-20">
        © {new Date().getFullYear()} Remitt
      </p>
    </section>
  );
}
