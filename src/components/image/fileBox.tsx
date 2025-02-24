export const FileBox = ({ onChange }: any) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-200 mb-2">
        Cargar imagen:
        <input
          type="file"
          onChange={onChange}
          accept="image/*"
          className={`
                mt-1
                block
                w-full
                text-sm
                text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100`}
        />
      </label>
    </div>
  );
};
