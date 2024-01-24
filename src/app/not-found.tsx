import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container d-flex flex-column align-items-center w-100 justify-content-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        //prefetch={typeof window === "undefined" ? false : navigator.onLine}
      >
        Return Home
      </Link>
    </div>
  );
}
