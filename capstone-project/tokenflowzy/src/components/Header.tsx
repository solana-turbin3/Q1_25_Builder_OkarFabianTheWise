import { Logo } from "@/assets/images";
import { CustomWalletMultiButton } from "@/solactions/WalletConnect";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full bg-black/90 backdrop-blur-sm border-b border-[#009933]/30 fixed top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 text-white">
          <Link to="/" className="w-10 h-10">
            <img src={Logo} alt="" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <CustomWalletMultiButton />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 -mr-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden border-t border-green-300/10 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex justify-center">
              <CustomWalletMultiButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
