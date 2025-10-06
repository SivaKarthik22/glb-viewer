import { useContext, useEffect, useRef } from "react";
import { } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import MyScene from "../classes/MyScene";
import { Context } from "../context API/ContextProvider";
import LoadingComp from "./Loading";

function CanvasComponent() {
  const reactCanvas = useRef(null);
  const {enableCanvas, glbFile, setLoading, enableToast, disableLoading, refreshSceneAnimationNames, firstLoad, setFirstLoad} = useContext(Context);

  useEffect(() => {
    if(!enableCanvas)
      return;

    const { current: canvas } = reactCanvas;
    if (!canvas) return;

    const mySceneObj = MyScene.getInstanceOfMyScene(canvas);
    const scene = mySceneObj.scene;

    async function onSceneReadyTasks(){
      mySceneObj.onSceneReady()
      .then(()=>{
        if(firstLoad){
          setLoading(true);
          MyScene.getInstanceOfMyScene().importMeshFromFile(glbFile)
          .then(()=>{
            setLoading(false);
            setFirstLoad(false);
            refreshSceneAnimationNames();
          })
          .catch(err => {
            enableToast("Error occurred", "error");
            disableLoading();
            setFirstLoad(false);
            refreshSceneAnimationNames();
            console.error(err);
          });
        }
      });
    }

    if (scene.isReady()) {
      onSceneReadyTasks();
    } else {
      scene.onReadyObservable.addOnce(() => {
        onSceneReadyTasks();
      });
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

  if(enableCanvas){
    return (
      <>
        <canvas ref={reactCanvas} id="canvas"/> 
        <LoadingComp/>
      </>
    );
  }

  return "";
}

export default CanvasComponent;