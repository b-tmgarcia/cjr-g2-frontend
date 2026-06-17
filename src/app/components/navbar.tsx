"use client";

import Image from "next/image";
import stockioLogo from "../../../public/images/LOGO_Stock_io.png";
import Link from "next/link";
import profileIcon from "../../../public/images/ion_person.png";
import logoutIcon from "../../../public/images/fluent_arrow-exit-28-filled.png";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface UserDataProps {
  userId: number;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myId, setMyId] = useState(0);
  const [profileHovered, setProfileHovered] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { userId } = jwtDecode<UserDataProps>(token);
      setMyId(userId);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleProfile = () => {
    router.push(`/profile/${myId}`);
  };

  function AuthButtons() {
    return (
      <div className="flex text-[#F6F3E4] items-center justify-center gap-10">
        {isLoggedIn ? (
          <>
            {/* Ícone perfil — roxo #6A38F3 no hover */}
            <button
              onClick={handleProfile}
              onMouseEnter={() => setProfileHovered(true)}
              onMouseLeave={() => setProfileHovered(false)}
              className="transition duration-200"
            >
              <Image
                src={profileIcon}
                alt="Perfil"
                width={26}
                height={26}
                style={{
                  filter: profileHovered
                    ? "brightness(0) saturate(100%) invert(22%) sepia(93%) saturate(2000%) hue-rotate(243deg) brightness(97%) contrast(97%)"
                    : "brightness(0) invert(1)",
                  transition: "filter 0.2s",
                }}
              />
            </button>

            {/* Ícone logout — vermelho #FF0000 no hover */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setLogoutHovered(true)}
              onMouseLeave={() => setLogoutHovered(false)}
              className="transition duration-200"
            >
              <Image
                src={logoutIcon}
                alt="LogOut"
                width={26}
                height={26}
                style={{
                  filter: logoutHovered
                    ? "brightness(0) saturate(100%) invert(13%) sepia(99%) saturate(7481%) hue-rotate(0deg) brightness(103%) contrast(113%)"
                    : "brightness(0) invert(1)",
                  transition: "filter 0.2s",
                }}
              />
            </button>
          </>
        ) : (
          <>
            <Link
              href={`/login?returnTo=${encodeURIComponent(pathname)}`}
              className="font-spartan font-semibold text-[13px] leading-none tracking-normal text-center px-4 py-2 rounded-full hover:text-[#6A38F3] transition duration-200"
            >
              LOGIN
            </Link>
            <Link
              href="/cadastro"
              className="font-spartan font-semibold text-[13px] leading-none tracking-normal text-center bg-[#6A38F3] text-[#F6F3E4] px-4 py-2 rounded-full hover:bg-[#F6F3E4] hover:text-[#6A38F3] transition duration-200"
            >
              CADASTRE-SE
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <nav className="flex w-full py-3 bg-[#171918] items-center justify-between px-16 border-b border-white/5">
      <Image src={stockioLogo} width={180} alt="stock.io" loading="eager" />
      <AuthButtons />
    </nav>
  );
}
