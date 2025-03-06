'use client'
import Link from "next/link";
import style from "./style.module.css";
import { Suspense } from "react";

const list = [
  "Javascript",
  "HTML",
  "CSS",
  "Node.Js",
  "SSR",
  "App components",
  "Tailwind css",
  "Typescript",
  "React.js",
  "Next.js",
  "Responsive design",
  "Zustand",
  "Fabric.js",
  "Web Audio Api",
];

export const NextjsXP = ({ routes }: { routes: string[] }) => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="flex flex-col gap-10 justify-center items-center">
        <div className="bg-blue-200 text-blue-700 font-bold p-2 flex flex-row gap-4 flex-wrap rounded-lg capitalize">
          {routes.map((route) => (
            <Link key={route} href={`/${route}`}>
              {route}
            </Link>
          ))}
        </div>
        <div className={style.container}>
          <h4>Experiencia Next.js</h4>
          <div className={style.listContainer}>
            {list.map((item) => (
              <div key={item} className={style.item}>
                {item}
              </div>
            ))}
          </div>
          <a
            className={style.gitHub}
            href="https://github.com/robertomiguel/experiencia-next"
            target="_blank"
          >
            View code on GitHub
          </a>
        </div>
      </div>
    </Suspense>
  );
};
