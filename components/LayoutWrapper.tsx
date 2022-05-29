import Link from "next/link";
import React from "react";
import Image from "next/image";
import ThemeSwitch from "./ThemeSwitch";
import Logo from "./logo";

import headerNavLinks from "../data/headerNavLinks";
import siteMetadata from "../data/siteMetadata";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl min-h-screen px-4 mx-auto sm:px-6 xl:max-w-5xl xl:px-0">
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <a className="flex items-center justify-between gap-3 p-1 text-2xl font-semibold duration-200 ease-in-out rounded-md hover:bg-opacity-80 md:p-3 hover:bg-overlay ">
            <Logo />
            {siteMetadata.headerTitle}
          </a>
        </Link>
      </div>
      <div className="flex items-center text-base leading-5 ">
        <div className="hidden space-x-1 md:block">
          {headerNavLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <a className="p-1 font-medium duration-200 ease-in-out rounded-md md:p-4 text-text hover:bg-opacity-80 hover:bg-overlay">
                {link.title}
              </a>
            </Link>
          ))}
        </div>
        <ThemeSwitch />
        {/* <MobileNav /> */}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="flex justify-between py-6 text-sm border-t-[1px] border-t-muted">
        <div>
          © {new Date().getFullYear()} {siteMetadata.author} •{" "}
          {siteMetadata.description}
        </div>
        <div>
          <a target="_blank" href={siteMetadata.github} rel="noreferrer">
            Github
          </a>{" "}
          •{" "}
          <a target="_blank" href={siteMetadata.facebook} rel="noreferrer">
            Facebook
          </a>{" "}
          •{" "}
          <a target="_blank" href={siteMetadata.linkedin} rel="noreferrer">
            Linkedin
          </a>
        </div>
      </div>
    </footer>
  );
}
