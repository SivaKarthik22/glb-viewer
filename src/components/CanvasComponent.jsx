import { useContext, useEffect, useRef } from "react";
import { PointerEventTypes } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import MyScene from "../classes/MyScene";
import { Context } from "../context API/ContextProvider";
import LoadingComp from "./Loading";
import "babylonjs-inspector";

function CanvasComponent() {
  const reactCanvas = useRef(null);
  const { enableCanvas, glbFile, setLoading, enableToast, disableCanvas, refreshSceneAnimationNames, currentEnvironment, currentColor, wireframe, textureMode, setStatsData, setSelectedMesh } = useContext(Context);

  useEffect(() => {
    if (!enableCanvas)
      return;

    const { current: canvas } = reactCanvas;
    if (!canvas)
      return;

    const mySceneObj = MyScene.getInstanceOfMyScene(canvas);
    const scene = mySceneObj.scene;

    async function onSceneReadyTasks() {
      try {
        setLoading(true);
        await mySceneObj.importMeshFromFile(glbFile);
        mySceneObj.prepareMeshesForDebugMode();
        mySceneObj.createEnvironment(currentEnvironment, currentColor);
        mySceneObj.enableDisableWireframeView(wireframe);
        mySceneObj.enableDisableSolidMode(textureMode);
        setStatsData(mySceneObj.calculateStats());
        refreshSceneAnimationNames();
        setSceneClickObservable();
        setLoading(false);
      }
      catch (err) {
        enableToast("Error occurred", "error");
        disableCanvas();
        console.error(err);
      }
    }

    function setSceneClickObservable() {
      scene.onPointerObservable.add(pointerInfo => {
        if (pointerInfo.type !== PointerEventTypes.POINTERTAP)
          return;
        console.log(pointerInfo);
        const pickResult = pointerInfo.pickInfo;
        if (pickResult?.hit && pickResult.pickedMesh){
          const pickedMesh = pickResult.pickedMesh;
          for (const mesh of mySceneObj.container.meshes) {
            if (pickedMesh.uniqueId == mesh.uniqueId) {
              setSelectedMesh(mesh.uniqueId);
              return;
            }
          }
        }
        setSelectedMesh(null);
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

    //----------for debugging
    document.addEventListener("keydown", (e) => {
      if (e.shiftKey && e.ctrlKey) {
        scene.debugLayer.isVisible()
          ? scene.debugLayer.hide()
          : scene.debugLayer.show();
      }
    })
    //----------

    return () => {
      mySceneObj.engine.dispose();
      MyScene.disposeInstanceOfMyScene();
      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [enableCanvas, glbFile]);

  if (enableCanvas) {
    return (
      <>
        <canvas ref={reactCanvas} id="canvas" />
        <LoadingComp />
      </>
    );
  }

  return "";
}

export default CanvasComponent;