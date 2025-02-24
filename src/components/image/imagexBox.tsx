import Image from "next/image";
import { Spinner } from "../common/Spinner";

export const ImageBox = ({ image, label, noImage, loading }: any) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col justify-center items-center w-full bg-white">
      <div className="text-[#1c1c1c] text-lg font-semibold mb-2">
        {label}
      </div>
      {image && !loading && (
        <Image
          src={image}
          alt="original"
          priority={false}
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: "100%", height: "auto", maxWidth: "512px" }}
        />
      )}

      {loading && <Spinner color="border-blue-500" />}

      {!image && noImage && !loading && (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
          {noImage}
        </div>
      )}
    </div>
  );
};
