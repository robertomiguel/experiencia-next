

export const detectGPUCapabilities = async () => {
    try {
      if (typeof navigator !== "undefined" && "gpu" in navigator) {
        try {
          const adapter = await (navigator as any).gpu?.requestAdapter();
          if (adapter) {
            return "high";
          }
        } catch (e) {
          console.log("WebGPU no disponible, intentando WebGL");
        }
      }

      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (gl) {
        const debugInfo = (gl as any).getExtension("WEBGL_debug_renderer_info");
        const renderer = debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : "";

        const isHighEnd = /(nvidia|radeon\s*rx|rtx)/i.test(renderer);
        return isHighEnd ? "high" : "medium";
      }
      return "low";
    } catch (e) {
      console.error("Error detectando GPU:", e);
      return "low";
    }
  };