// fabricHelpers.ts
export const sendTextToFront = (fabricCanvas: any) => {
  if (!fabricCanvas) return;

  fabricCanvas.getObjects().forEach((obj: any) => {
    if (obj.type === "textbox") {
      fabricCanvas.bringToFront(obj);
    }
  });
  fabricCanvas.renderAll();
};