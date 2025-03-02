import { useEffect, useState, useRef } from "react";

const FABRIC_JS_CDN = "/fabric_with_gestures.js";

export const useFabricScript = () => {
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const scriptId = "fabricjs-script";
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;

    if ((window as any).fabric) {
      setIsFabricLoaded(true);
      hasLoaded.current = true;
      return;
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = FABRIC_JS_CDN;
      script.async = true;
      script.onload = () => {
        setIsFabricLoaded(true);
        hasLoaded.current = true;
      };
      document.body.appendChild(script);
    } else if (!hasLoaded.current) {
      script.onload = () => {
        setIsFabricLoaded(true);
        hasLoaded.current = true;
      };
    }

    return () => {
      if (script) {
        script.onload = null;
      }
    };
  }, []);

  return isFabricLoaded;
};
