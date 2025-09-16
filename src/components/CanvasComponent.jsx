import { useEffect, useRef, useState } from "react";
import { } from "@babylonjs/core";
import MyScene from "../classes/MyScene";

function CanvasComponent() {
  const reactCanvas = useRef(null);
  const [enableCanvas, setEnableCanvas] = useState(false);

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
    <div className="container">
      {enableCanvas ? 
        <canvas ref={reactCanvas} id="canvas"/> :
        <div id="pre-canvas">
          <button onClick={()=>{setEnableCanvas(true)}}>Upload GLB/GLTF file</button>
        </div>
      }
    </div>
  );
}

export default CanvasComponent;