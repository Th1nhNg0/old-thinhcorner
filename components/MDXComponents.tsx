import Link from "next/link";
import React, { useState, useRef, Fragment, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";

const CustomLink = (props: any) => {
  const href = props.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <Link href={href}>
        <a {...props}>{props.children}</a>
      </Link>
    );
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const CustomImage = ({
  src,
  width,
  height,
  alt,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [renderWidth, setrenderWidth] = useState(0);
  const [renderHeight, setrenderHeight] = useState(0);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (ref.current) {
      setrenderWidth(ref.current.clientWidth);
      setrenderHeight(ref.current.clientHeight);
    }
  }, [ref]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "auto";
    } else {
      // Prevent scrolling
      document.body.style.overflow = "hidden";
    }
  }, [isOpen]);

  return (
    <div
      style={{
        width: isOpen ? renderWidth : "auto",
        height: isOpen ? renderHeight : "auto",
      }}
    >
      {!isOpen ? (
        <motion.div ref={ref} layoutId={src} className="flex justify-center">
          <Image
            className="cursor-zoom-in"
            onClick={() => setIsOpen(true)}
            src={src}
            width={width}
            height={height}
            alt={alt}
          />
        </motion.div>
      ) : (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed w-full h-full bg-overlay bg-opacity-70 "
          />
          <motion.div
            className="flex justify-center max-w-screen-lg p-10"
            layoutId={src}
          >
            <Image
              className="cursor-zoom-out"
              src={src}
              width={width}
              height={height}
              alt={alt}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

const Pre = (props: any) => {
  const textInput = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const onEnter = () => {
    setHovered(true);
  };
  const onExit = () => {
    setHovered(false);
    setCopied(false);
  };
  const onCopy = () => {
    if (!textInput.current) return;
    setCopied(true);
    navigator.clipboard.writeText(textInput.current.textContent);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      ref={textInput}
      onMouseEnter={onEnter}
      onMouseLeave={onExit}
      className="relative"
    >
      {hovered && (
        <button
          aria-label="Copy code"
          type="button"
          className={`absolute right-2 top-2 h-8 w-8 rounded border-2 p-1 ${
            copied
              ? "border-foam focus:border-foam focus:outline-none"
              : "border-subtle"
          }`}
          onClick={onCopy}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            className={copied ? "text-foam" : "text-subtle"}
          >
            {copied ? (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </>
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </>
            )}
          </svg>
        </button>
      )}

      <pre>{props.children}</pre>
    </div>
  );
};

const MDXComponents = {
  a: CustomLink,
  Image: CustomImage,
  pre: Pre,
};

export default MDXComponents;
