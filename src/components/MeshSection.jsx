import { Mesh, TransformNode } from "@babylonjs/core";
import MyScene from "../classes/MyScene";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context API/ContextProvider";

export default function MeshSection() {
    const { loading, enableHighlight, setEnableHighlight, selectedMesh, autoFocus, setAutoFocus, heirarchyCompRef, isolationMode, setIsolationMode } = useContext(Context);
    const mySceneObj = MyScene.getInstanceOfMyScene();

    function displaySceneHeirarchy() {
        const rootMesh = mySceneObj.scene.getNodeByName("__root__");
        return <div id="heirarchy-container">
            {rootMesh ? <HeirarchyComp parentObj={rootMesh} showUnit={false} /> : "no meshes found!"}
        </div>;
    }

    const focusFunctionality = () =>{
        if(!heirarchyCompRef.current)
            return;
        heirarchyCompRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    const enableOrDisableHighlight = (event) => {
        const checked = event.target.checked;
        setEnableHighlight(checked);
        mySceneObj.setupEffectLayer(checked);
        mySceneObj.updateMeshHighlight(selectedMesh);
    }

    const toggleAutoFocus = (event) => {
        setAutoFocus(event.target.checked);
    }

    const toggleIsolationMode = (event) => {
        const checked = event.target.checked;
        setIsolationMode(checked);
        mySceneObj.isolationMode = checked;
        mySceneObj.updateLayerMasking(checked, selectedMesh);
    }

    return (
        <div id="mesh-section">
            <div>
                <label>Highlight selection: </label>
                <input
                    type="checkbox"
                    checked={enableHighlight}
                    onChange={enableOrDisableHighlight}
                />
            </div>
            <div>
                <button onClick={focusFunctionality}>Focus here</button>
                <label>Auto-focus here: </label>
                <input
                    type="checkbox"
                    checked={autoFocus}
                    onChange={toggleAutoFocus}
                />
            </div>
            <div>
                <label>Isolation mode: </label>
                <input
                    type="checkbox"
                    checked={isolationMode}
                    onChange={toggleIsolationMode}
                />
            </div>
            <h4 style={{ margin: 0 }}>Scene Meshes</h4>
            {loading ? <p>Loading...</p> : displaySceneHeirarchy()}
        </div>
    );
}

function HeirarchyComp({ parentObj, showUnit = true, enableEyeBtn = true }) {
    const { selectedMesh, heirarchyCompRef, updateSelection } = useContext(Context);
    const childObjs = parentObj.getChildren((node) => (node instanceof Mesh || node instanceof TransformNode), true);
    const [unfolded, setUnfolded] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [meshState, setMeshState] = useState(true);

    const handleUnitNameClick = event => {
        const uniqueId = parseInt(event.target.id);
        if (selectedMesh == uniqueId)
            updateSelection(null);
        else
            updateSelection(uniqueId)
    }

    useEffect(()=>{
        setMeshState(parentObj.isEnabled(false));
    }, []);

    const handleMeshStateChange = ()=>{
        parentObj.setEnabled(!meshState);
        setMeshState(!meshState);
    }

    return (<>
        {showUnit ?
            <div className="unit" ref={selectedMesh == parentObj.uniqueId ? heirarchyCompRef : null}>
                {childObjs.length != 0 ?
                    <button className="unfold-btn" onClick={() => setUnfolded(curState => !curState)}>
                        {unfolded ? "-" : "+"}
                    </button>
                    : <></>
                }
                {parentObj instanceof Mesh ?
                    <button className="details-btn" onClick={() => setShowDetails(curState => !curState)}>
                        {showDetails ? "^" : "v"}
                    </button>
                    : <></>
                }
                <div
                    id={parentObj.uniqueId}
                    className={`${selectedMesh == parentObj.uniqueId ? "selected " : ""}unit-name no-break`}
                    onClick={handleUnitNameClick}
                >
                    {(parentObj instanceof Mesh ? "[] " : "} ") + parentObj.name}
                </div>
                <button disabled={!enableEyeBtn} onClick={handleMeshStateChange} className="eye-btn">{meshState ? "(o)" : "( )"}</button>
            </div> :
            <></>
        }
        {(showDetails && parentObj instanceof Mesh) ?
            <ul className="details-list">
                {parentObj.material ? <>
                    <li className="no-break">{"@ " + parentObj.material.name}</li>
                    {parentObj.material.getActiveTextures().map((tex, idx) => <li className="no-break" key={idx}>{"* " + tex.name}</li>)}
                </> : <li>@ no material</li>}
            </ul>
            : <></>
        }
        {unfolded ?
            <ul className="unit-list">
                {childObjs.map((childObj, idx) => <li key={idx}>
                    <HeirarchyComp parentObj={childObj} enableEyeBtn={meshState && enableEyeBtn}/>
                </li>)}
            </ul>
            : <></>
        }
    </>);
}
