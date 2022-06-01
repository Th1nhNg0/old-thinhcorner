import Link from "next/link";
import React, { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import Logo from "./logo";
import classNames from "classnames";
import headerNavLinks from "../../data/headerNavLinks";
import siteMetadata from "../../data/siteMetadata";
import { useRouter } from "next/router";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl min-h-screen px-5 mx-auto">
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between py-10">
      <MobileNav />
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <a className="flex items-center justify-between gap-3 p-1 text-2xl font-semibold duration-200 ease-in-out rounded-md hover:bg-opacity-80 md:p-3 hover:bg-overlay ">
            <span className="wave">
              <Logo />
            </span>
            <span className="hidden md:block">{siteMetadata.headerTitle}</span>
          </a>
        </Link>
      </div>
      <div className="flex items-center justify-center text-base leading-5 ">
        <div className="hidden space-x-1 md:block">
          {headerNavLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <a
                className={classNames(
                  "p-1 duration-200 ease-in-out rounded-md  md:p-4 hover:bg-opacity-80 hover:bg-overlay",
                  {
                    "text-subtle font-medium": link.href != router.pathname,
                    "text-text  font-bold": link.href == router.pathname,
                  }
                )}
              >
                {link.title}
              </a>
            </Link>
          ))}
        </div>
        <ThemeSwitch />
      </div>
    </header>
  );
}
const MobileNav = () => {
  const [navShow, setNavShow] = useState(false);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = "auto";
      } else {
        // Prevent scrolling
        document.body.style.overflow = "hidden";
      }
      return !status;
    });
  };

  return (
    <div className="sm:hidden">
      <button
        type="button"
        className="w-8 h-8 ml-1 mr-1 rounded"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-text"
        >
          {navShow ? (
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          )}
        </svg>
      </button>
      <div
        className={`fixed   w-full h-full top-24 right-0 bg-overlay z-10 transform ease-in-out duration-300 ${
          navShow ? "opacity-95 visible" : "opacity-0 invisible"
        }`}
      >
        <button
          type="button"
          aria-label="toggle modal"
          className="fixed w-full h-full cursor-auto focus:outline-none"
          onClick={onToggleNav}
        ></button>
        <nav className="fixed h-full mt-8">
          {headerNavLinks.map((link, i) => (
            <div
              key={link.title}
              className={classNames(
                "px-12 py-4 transform ease-in-out duration-300",
                navShow ? "translate-x-0" : "-translate-x-full"
              )}
              style={{
                transitionDelay: `${(i + 1) * 100}ms`,
              }}
            >
              <Link href={link.href}>
                <a
                  onClick={onToggleNav}
                  className="text-2xl font-bold tracking-widest text-text"
                >
                  {link.title}
                </a>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

function Footer() {
  return (
    <footer className="mt-10">
      <div className="flex flex-col-reverse gap-3 md:flex-row  justify-between py-5 text-sm border-t-[1px] border-t-muted">
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
