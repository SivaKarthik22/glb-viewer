import { useContext, useEffect, useRef, useState } from "react";
import { } from "@babylonjs/core";
import MyScene from "../classes/MyScene";
import UploadButton from "./UploadButton";
import { Context } from "../context API/ContextProvider";

function CanvasComponent() {
  const reactCanvas = useRef(null);
  const {enableCanvas} = useContext(Context);

  useEffect(() => {
    if(!enableCanvas)
      return;
    
    const { current: canvas } = reactCanvas;
    if (!canvas) return;

    const mySceneObj = new MyScene(canvas);
    const scene = mySceneObj.scene;

    if (scene.isReady()) {
      mySceneObj.onSceneReady();
    } else {
      scene.onReadyObservable.addOnce(() => mySceneObj.onSceneReady());
    }

    mySceneObj.engine.runRenderLoop(() => {
      mySceneObj.onRender();
      scene.render();
    });

    const resize = () => {
      mySceneObj.engine.resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      mySceneObj.engine.dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [enableCanvas]);

  return (
    <div className="canvas-container">
      {enableCanvas ? 
        <canvas ref={reactCanvas} id="canvas"/> :
        <div id="pre-canvas">
          <UploadButton buttonText="Upload GLB/GLTF file" />
        </div>
      }
    </div>
  );
}

export default CanvasComponent;