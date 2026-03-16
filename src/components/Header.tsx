"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-imm-red text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-IMM.png" alt="Logo IMM" width={40} height={40} className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Perkaderan IMM</h1>
              <p className="text-xs text-white/80">Ikatan Mahasiswa Muhammadiyah</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-imm-yellow-light transition-colors">
              Home
            </Link>
            <Link href="/informasi" className="hover:text-imm-yellow-light transition-colors">
              Informasi
            </Link>
            <Link href="/pendaftaran" className="hover:text-imm-yellow-light transition-colors">
              Pendaftaran
            </Link>
            <Link
              href="/login"
              className="bg-white text-imm-red px-4 py-2 rounded-lg font-semibold hover:bg-imm-yellow-light hover:text-imm-black transition-colors"
            >
              Login Admin
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3 text-sm font-medium">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-imm-yellow-light">
              Home
            </Link>
            <Link href="/informasi" onClick={() => setMenuOpen(false)} className="hover:text-imm-yellow-light">
              Informasi
            </Link>
            <Link href="/pendaftaran" onClick={() => setMenuOpen(false)} className="hover:text-imm-yellow-light">
              Pendaftaran
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-white text-imm-red px-4 py-2 rounded-lg font-semibold text-center hover:bg-imm-yellow-light hover:text-imm-black transition-colors"
            >
              Login Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
