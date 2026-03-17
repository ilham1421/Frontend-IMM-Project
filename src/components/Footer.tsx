"use client";

import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {

  return (
    <footer className="bg-imm-black text-white print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo-IMM.png" alt="Logo IMM" width={40} height={40} className="w-10 h-10 object-contain" />
              <div>
                <h3 className="font-bold text-lg">Perkaderan IMM</h3>
                <p className="text-sm text-gray-400">Ikatan Mahasiswa Muhammadiyah</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Program perkaderan Ikatan Mahasiswa Muhammadiyah.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-bold text-lg mb-4">Kontak Panitia</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-imm-red" />
                <span>panitia@imm.or.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-imm-red" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-imm-red" />
                <span>Gedung Dakwah Muhammadiyah</span>
              </div>
            </div>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="font-bold text-lg mb-4">Sosial Media</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <span>Instagram: @imm_official</span>
              <span>Facebook: IMM Indonesia</span>
              <span>YouTube: IMM Channel</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Ikatan Mahasiswa Muhammadiyah. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}
