import { useContext, useEffect, useRef } from "react";
import { PointerEventTypes } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import MyScene from "../classes/MyScene";
import { Context } from "../contextApi/ContextProvider";
import LoadingComp from "./Loading";
import "babylonjs-inspector";

function CanvasComponent() {
  const reactCanvas = useRef(null);
  const { enableCanvas, glbFile, setLoading, enableToast, disableCanvas, checkForAnimations, currentEnvironment, currentColor, wireframe, textureMode, setStatsData, enableHighlight, setIsolationMode, updateSelection, dispatchOutlinerActions } = useContext(Context);

  function setSceneClickObservable(mySceneObj) {
    mySceneObj.scene.onPointerObservable.add(pointerInfo => {
      if (pointerInfo.type !== PointerEventTypes.POINTERTAP)
        return;
      let curSelection = null
      const pickResult = pointerInfo.pickInfo;
      if (pickResult?.hit && pickResult.pickedMesh) {
        const pickedMesh = pickResult.pickedMesh;
        for (const mesh of mySceneObj.container.meshes) {
          if (pickedMesh.uniqueId == mesh.uniqueId)
            curSelection = mesh.uniqueId;
        }
      }
      updateSelection(curSelection);
    });
  }

  async function onSceneReadyTasks(mySceneObj) {
    try {
      setLoading(true);
      await mySceneObj.importMeshFromFile(glbFile);
      dispatchOutlinerActions({type:"initialise_state", payload: mySceneObj.container});
      mySceneObj.prepareMeshesForDebugMode();
      mySceneObj.createEnvironment(currentEnvironment, currentColor);
      mySceneObj.setBoundingInfoForAllTransformNodes();
      mySceneObj.enableDisableWireframeView(wireframe);
      mySceneObj.enableDisableSolidMode(textureMode);
      mySceneObj.setupEffectLayer(enableHighlight);
      mySceneObj.resetSceneAnimations();
      setIsolationMode(false);
      setStatsData(mySceneObj.calculateStats());
      checkForAnimations();
      setSceneClickObservable(mySceneObj);
      setLoading(false);
    }
    catch (err) {
      enableToast("Error occurred", "error");
      disableCanvas();
      console.error(err);
    }
  }

  useEffect(() => {
    if (!enableCanvas)
      return;

    const { current: canvas } = reactCanvas;
    if (!canvas)
      return;

    const mySceneObj = MyScene.getInstanceOfMyScene(canvas);
    const scene = mySceneObj.scene;

    if (scene.isReady()) {
      onSceneReadyTasks(mySceneObj);
    } else {
      scene.onReadyObservable.addOnce(() => {
        onSceneReadyTasks(mySceneObj);
      });
    }

    mySceneObj.engine.runRenderLoop(() => {
      mySceneObj.onRender();
      scene.render();
    });

    let timeoutId = null;
    const resize = () => {
      if(timeoutId)
        clearTimeout(timeoutId);
      timeoutId = setTimeout(()=>{
        mySceneObj.engine.resize();
      }, 50);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(reactCanvas.current);

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
      mySceneObj?.engine.dispose();
      MyScene.disposeInstanceOfMyScene();
      if(reactCanvas.current)
        resizeObserver.unobserve(reactCanvas.current);
      dispatchOutlinerActions({type:"reset_state"});
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