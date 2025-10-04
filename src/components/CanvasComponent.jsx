import { useContext, useEffect, useRef } from "react";
import { } from "@babylonjs/core";
import MyScene from "../classes/MyScene";
import { Context } from "../context API/ContextProvider";
import LoadingComp from "./Loading";

function CanvasComponent() {
  const reactCanvas = useRef(null);
  const {enableCanvas, file, setLoading, enableToast, disableLoading, setSceneAnimationNames} = useContext(Context);

  useEffect(() => {
    if(!enableCanvas)
      return;

    const { current: canvas } = reactCanvas;
    if (!canvas) return;

    const mySceneObj = MyScene.getInstanceOfMyScene(canvas);
    const scene = mySceneObj.scene;

    async function onSceneReadyTasks(){
      mySceneObj.onSceneReady(file)
      .then(()=>{
        setLoading(false);
        
        const animNames = []
        scene.animationGroups.forEach(anim => {
          animNames.push(anim.name);
        });
        setSceneAnimationNames(animNames);
      })
      .catch(err => {
        enableToast("Error loading file", "error");
        disableLoading();
        console.error(err);
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