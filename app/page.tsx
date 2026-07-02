import Image from "next/image";
import Link from "next/link";
import CorridorsGrid from "@/components/CorridorsGrid";

const corridors = [
  { code: "us", name: "USA", live: true },
  { code: "ph", name: "Philippines", live: true },
  { code: "th", name: "Thailand", live: false },
  { code: "sg", name: "Singapore", live: false },
  { code: "jp", name: "Japan", live: false },
  { code: "au", name: "Australia", live: false },
  { code: "id", name: "Indonesia", live: false },
  { code: "my", name: "Malaysia", live: false },
  { code: "vn", name: "Vietnam", live: false },
  { code: "kr", name: "South Korea", live: false },
  { code: "hk", name: "Hong Kong", live: false },
  { code: "gb", name: "United Kingdom", live: false },
  { code: "ca", name: "Canada", live: false },
  { code: "ae", name: "UAE", live: false },
  { code: "sa", name: "Saudi Arabia", live: false },
  { code: "nz", name: "New Zealand", live: false },
  { code: "tw", name: "Taiwan", live: false },
  { code: "in", name: "India", live: false },
  { code: "mx", name: "Mexico", live: false },
  { code: "de", name: "Germany", live: false },
];

const useCases = [
  {
    tag: "Remittance",
    title: "Send money home",
    body: "Support family across borders with fast, low-cost transfers that arrive in minutes.",
  },
  {
    tag: "Commerce",
    title: "Pay a merchant",
    body: "Buyers pay overseas sellers directly — no card friction and no exchange-rate surprises.",
  },
  {
    tag: "B2B",
    title: "Settle invoices",
    body: "Businesses pay cross-border supplier and vendor invoices with a clear, auditable trail.",
  },
  {
    tag: "Payroll",
    title: "Pay contractors",
    body: "Companies pay international contractors and remote teams on time, every cycle.",
  },
];

const features = [
  {
    title: "Know the full price first",
    body: "See the exchange rate, transfer fee, and exact payout amount before you place an order.",
  },
  {
    title: "Pay with familiar rails",
    body: "Use the payment methods you already have on the send side, with local payout on the receive side.",
  },
  {
    title: "Built on fast settlement",
    body: "Stellar-based settlement helps keep transfers quick, auditable, and cost efficient.",
  },
];

const trustItems = [
  {
    title: "Transparent",
    body: "No hidden markup buried in the exchange rate.",
  },
  {
    title: "Supported",
    body: "A payout flow designed around local recipient access.",
  },
  {
    title: "Operator ready",
    body: "Liquidity providers can add USDC capacity for order flow.",
  },
];

const steps = [
  "Enter the amount to send",
  "Review the rate and fee",
  "Pay through a supported rail",
  "Recipient gets paid out",
];

const faqs = [
  {
    question: "Which corridors and currencies are supported?",
    answer:
      "Remitt is live for USD to PHP today, with additional currency pairs and corridors rolling out. The platform is built to add new pairs without changing the experience.",
  },
  {
    question: "Will I see the fee before sending?",
    answer:
      "Yes. Remitt shows the transfer fee, exchange rate, and final recipient amount before the order is placed.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "On the current corridor, US pay-in options are Venmo, Cash App, and Zelle, with local payout on the receive side. Supported methods expand as new corridors launch.",
  },
  {
    question: "How do liquidity providers participate?",
    answer:
      "Providers deposit USDC, choose the payment rails they support, and make capacity available for transfers.",
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/remitt_background.png"
            alt="A sender checking a phone near the city waterfront"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Even overlay to seat the copy on the image */}
          <div className="absolute inset-0 bg-black/25" />
          {/* Left-weighted gradient scrim: darker behind the text, clear over the subject */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        </div>

        <div className="relative flex min-h-[calc(100vh-4rem)] w-full items-center px-6 pb-16 pt-16 sm:px-10 lg:px-16 lg:pb-24 lg:pt-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
              Built for payments
              <br />
              across borders.
            </h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
              Remitt shows you the rate, fee, and exact payout before you send —
              then settles on fast, transparent rails. One platform for
              remittance, commerce, B2B, and payroll.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/send"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-950/30 transition-colors hover:bg-indigo-500"
              >
                Start sending
              </Link>
              <Link
                href="/merchants"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/15 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
              >
                Provide liquidity
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
            One platform, many use cases
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            However money needs to cross a border.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            The same transparent quote and fast settlement powers each flow —
            for people and for businesses.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => (
            <article
              key={useCase.tag}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 transition-colors hover:border-indigo-200"
            >
              <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">
                {useCase.tag}
              </span>
              <h3 className="mt-4 text-xl font-bold text-slate-950">
                {useCase.title}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">{useCase.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              What users see first
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              The important details are visible before checkout.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              The homepage now leads with the same kind of practical quote
              clarity users expect from premium money-transfer products.
            </p>
          </div>

          <div className="grid gap-4">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-600">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-remitt" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              Why Remitt
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              A simpler way to move money across borders.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-lg font-black text-white">
                  ✓
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">
                How it works
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Four steps from quote to payout.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Keep the user journey direct: amount, review, pay, receive.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/10 bg-white/10 p-5"
                >
                  <p className="text-sm font-black text-sky-300">
                    0{index + 1}
                  </p>
                  <p className="mt-3 font-bold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="destinations" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Where can you send with Remitt?
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Select a destination to see live rates and payout options.
            </p>
          </div>

          <div className="mt-12">
            <CorridorsGrid corridors={corridors} />
          </div>
        </div>
      </section>

      <section id="faq" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Answers before the next step.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Reduce friction with the questions a sender or operator will ask
              before they commit.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-white px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-950">
                  {item.question}
                  <span className="text-xl text-indigo-600 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid overflow-hidden rounded-2xl bg-indigo-600 shadow-2xl shadow-indigo-950/20 lg:grid-cols-[1fr_0.8fr]">
          <div className="p-8 text-white sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-100">
              Ready when you are
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Get a live quote before the money moves.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-indigo-100">
              Start with the amount, see the exchange rate, and choose the
              payout flow that fits the recipient.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/send"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 font-semibold text-slate-950 transition-colors hover:bg-slate-100"
              >
                Send money
              </Link>
              <Link
                href="/merchants"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
              >
                Add liquidity
              </Link>
            </div>
          </div>
          <div className="hidden bg-slate-950 p-8 text-white lg:block">
            <div className="rounded-xl border border-white/10 bg-white/10 p-5">
              <p className="text-sm text-slate-300">Example quote</p>
              <p className="mt-2 text-4xl font-bold tabular-nums">₱56,420</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">You send</span>
                  <span className="font-bold tabular-nums">$1,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fee</span>
                  <span className="font-bold tabular-nums">$12.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate</span>
                  <span className="font-bold tabular-nums">₱56.42</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
          <div>
            <Image
              src="/remitt_blk_horizontal.png"
              alt="Remitt"
              width={220}
              height={50}
              className="h-11 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              Fast, transparent cross-border payments powered by local rails and
              Stellar settlement.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950">Product</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <Link href="/send" className="block hover:text-slate-950">
                Send money
              </Link>
              <Link href="/merchants" className="block hover:text-slate-950">
                Liquidity
              </Link>
              <Link href="/#use-cases" className="block hover:text-slate-950">
                Use cases
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950">Company</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <Link href="/#why-remitt" className="block hover:text-slate-950">
                Why Remitt
              </Link>
              <Link href="/#faq" className="block hover:text-slate-950">
                FAQ
              </Link>
              <span className="block">Support</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950">Rails</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <span className="block">Venmo</span>
              <span className="block">Cash App</span>
              <span className="block">Coins.ph</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
