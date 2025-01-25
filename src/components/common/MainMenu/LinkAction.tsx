"use client";
import Link from "next/link";
import style from "./LinkAction.module.css";
import { usePathname } from "next/navigation";

interface LinkToProps {
  label: string;
  href: string;
}

export const LinkAction = ({ label, href }: LinkToProps) => {
  const path = usePathname();

  return (
    <Link
      scroll={false}
      className={path.includes(href) ? style.currentLink : style.link}
      href={href}
    >
      {label}
    </Link>
  );
};
