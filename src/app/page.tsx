'use server'
import path from "path";
import fs from "fs";
import { NextjsXP } from "@/components/home/NextjsXP";

export default async function Home() {
  const appDir = path.join(process.cwd(), "./src/app"); // Ruta de la carpeta app
  const folders = fs.readdirSync(appDir).filter((name) => {
    const fullPath = path.join(appDir, name);
    return (
      fs.statSync(fullPath).isDirectory() &&
      !name.startsWith("(") &&
      !name.startsWith("_") &&
      !name.startsWith("api")
    ); // Excluir carpetas con paréntesis (grupos)
  });

  return (
    <div className="flex justify-center items-center mt-2 sm:mt-10">
      <NextjsXP routes={folders} />
    </div>
  );
}

