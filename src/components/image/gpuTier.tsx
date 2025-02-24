
export const GpuTier = ({ gpuTier }: any) => {
    if (!gpuTier) {
        return <div className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-800">Detectando GPU...</div>;
    }
  return (
    <div
      className={`text-sm px-3 py-1 rounded ${
        gpuTier === "high"
          ? "bg-green-100 text-green-800"
          : gpuTier === "medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
      }`}
    >
      Modo:{" "}
      {gpuTier === "high"
        ? "GPU (Alto Rendimiento)"
        : gpuTier === "medium"
          ? "GPU (Rendimiento Medio)"
          : "CPU (Rendimiento Básico)"}
    </div>
  );
};
