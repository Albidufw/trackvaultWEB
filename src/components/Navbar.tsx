"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const links = [
  { href: "/store", label: "Store" },
  { href: "/upload", label: "Upload" },
  { href: "/account", label: "Account" },
  { href: "/cart", label: "Cart" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <Link href="/" className="font-bold text-lg hover:opacity-80 transition">
        TrackVault
      </Link>

      <div className="flex items-center gap-6 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:opacity-80 transition ${
              pathname === link.href ? "underline underline-offset-4" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}

        {session ? (
          <button
            onClick={() => signOut()}
            className="hover:opacity-80 transition text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="hover:opacity-80 transition text-sm"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
