/**
 * Función utilitaria que trae todos los elementos de texto al frente del canvas
 * @param fabricCanvas - Referencia al canvas de Fabric.js
 */
export const sendTextToFront = (fabricCanvas: any): void => {
  if (!fabricCanvas) return;

  // Busca todos los objetos de tipo textbox y los trae al frente
  fabricCanvas.getObjects().forEach((obj: any) => {
    if (obj.type === "textbox") {
      fabricCanvas.bringToFront(obj);
    }
  });

  // Renderiza el canvas para aplicar los cambios
  fabricCanvas.renderAll();
};
