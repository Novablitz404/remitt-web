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
        <a
          href="https://t.me/+YUJ6nrbb4WRhYzFl"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-lg shadow-ink/30 transition-colors hover:bg-accent-dark"
        >
          {/* Telegram paper plane */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Join our Telegram for updates
        </a>
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
