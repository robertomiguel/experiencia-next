import AddImage from "./menuComponents/addImage";
import AddShape from "./menuComponents/addShape";
import AddText from "./menuComponents/addText";
import ResetCanvas from "./menuComponents/resetCanvas";
import SwitchBackground from "./menuComponents/switchBackground";

export const CanvasMenu = ({
  fabricCanvasRef,
  isMobile,
}: {
  fabricCanvasRef: any;
  isMobile: boolean;
}) => {
  return (
    <div className="w-full flex flex-wrap justify-center items-center flex-row md:gap-4">
      <AddShape fabricCanvasRef={fabricCanvasRef} isMobile={isMobile} />
      <AddText fabricCanvasRef={fabricCanvasRef} isMobile={isMobile} />
      <AddImage fabricCanvasRef={fabricCanvasRef} isMobile={isMobile} />
      <SwitchBackground fabricCanvasRef={fabricCanvasRef} />
      <ResetCanvas fabricCanvasRef={fabricCanvasRef} />
    </div>
  );
};
