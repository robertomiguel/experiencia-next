export const Spinner = ({ label }: { label?: string }) => {
  return (
    <div className="flex justify-center items-center  h-1/3">
      <div
        className={
          "animate-spin mt-10 mb-10 border-l-4 border-white rounded-full w-28 h-28"
        }
      />
      <div className="absolute">{<p>{label || "Loading..."}</p>}</div>
    </div>
  );
};
