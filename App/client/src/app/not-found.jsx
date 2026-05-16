// src/app/not-found.jsx
// Next.js App Router custom 404

import Link from "next/link";

export const metadata = {
  title: "Page Not Found | IQCars",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center
      bg-[var(--bg)] text-[var(--text)] px-6 gap-6 text-center">

      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
        style={{ background: "var(--accent)", fontFamily: "var(--font-display)" }}>
        404
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Page Not Found
        </h1>
        <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link href="/"
        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white
          hover:opacity-90 transition-opacity"
        style={{ background: "var(--accent)" }}>
        Back to Home
      </Link>
    </div>
  );
}
