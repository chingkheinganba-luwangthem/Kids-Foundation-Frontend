import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-6xl font-bold text-[#17345F] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[#17345F] mb-2">Page Not Found</h2>
      <p className="text-slate-600 mb-6 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-[#F47C61] text-white font-semibold text-sm hover:bg-[#e0684e] transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}

