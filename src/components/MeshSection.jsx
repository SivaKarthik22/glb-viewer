import { Mesh, TransformNode } from "@babylonjs/core";
import MyScene from "../classes/MyScene";
import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";

export default function MeshSection(){
    const {loading, enableHighlight, setEnableHighlight} = useContext(Context);
    const mySceneObj = MyScene.getInstanceOfMyScene();
    
    function displaySceneHeirarchy(rootMeshName){
        const rootMesh = mySceneObj.scene.getNodeByName(rootMeshName);
        return <div id="heirarchy-container">
            {rootMesh ? getHeirarchy(rootMesh) : "no meshes found!"}
        </div>;
    }
    function getHeirarchy(parentObj){
        const childObjs = parentObj.getChildren((node) => (node instanceof Mesh || node instanceof TransformNode), true);
        return(<>
            <p>{parentObj.name}</p>
            <ul>
                {childObjs.map((childObj, idx) => <li key={idx}>{getHeirarchy(childObj)}</li> )}
            </ul>
        </>);
    }

    const enableOrDisableHighlight = (event)=>{
        setEnableHighlight(event.target.checked);
    }

    return(
        <div id="mesh-section">
            <div>
                <label>Highlight selection: </label>
                <input 
                type="checkbox"
                checked={enableHighlight}
                onChange={enableOrDisableHighlight}
                />
            </div>
            {loading ? <p>Loading...</p> : displaySceneHeirarchy("__root__")}
        </div>
    );
}