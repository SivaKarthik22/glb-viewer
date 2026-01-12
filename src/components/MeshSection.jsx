import { Mesh, TransformNode } from "@babylonjs/core";
import MyScene from "../classes/MyScene";
import { memo, useContext, useMemo } from "react";
import { Context } from "../context API/ContextProvider";

export default function MeshSection() {
    const { loading, enableHighlight, setEnableHighlight, selectedMesh, autoFocus, setAutoFocus, heirarchyCompRef, isolationMode, setIsolationMode, dispatchOutlinerActions } = useContext(Context);
    const mySceneObj = MyScene.getInstanceOfMyScene();

    function displaySceneHeirarchy() {
        const rootMesh = mySceneObj?.scene.getNodeByName("__root__") ?? null;
        return <div id="heirarchy-container">
            {rootMesh ? <HeirarchyComp parentObj={rootMesh} showUnit={false}/> : "no meshes found!"}
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

    const handleShowAll = ()=>{
        mySceneObj.enableAllNodes();
        dispatchOutlinerActions({type: "show_all_nodes"});
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
                <button onClick={focusFunctionality}>Focus in outliner</button>
                <label>Auto-focus</label>
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
            <div className="flex" style={{alignItems:"center", justifyContent:"space-between"}}>
                <h4 style={{ margin: 0 }}>Scene Meshes</h4>
                {loading ? <></> : <button onClick={handleShowAll}>Unhide All</button>}
            </div>
            {loading ? <p>Loading...</p> : displaySceneHeirarchy()}
        </div>
    );
}

const HeirarchyComp = memo( ({ parentObj, showUnit = true, enableEyeBtn = true }) => {
    const { selectedMesh, heirarchyCompRef, updateSelection, outlinerStates, dispatchOutlinerActions } = useContext(Context);
    const childObjs = useMemo(()=> parentObj.getChildren((node) => (node instanceof Mesh || node instanceof TransformNode), true), [parentObj] ) ;
    const {nodeState, showDetails, unfolded} = outlinerStates[parentObj.uniqueId];

    const handleUnitNameClick = event => {
        const uniqueId = parseInt(event.target.id);
        if (selectedMesh == uniqueId)
            updateSelection(null);
        else
            updateSelection(uniqueId)
    }


    const handleMeshStateChange = ()=>{
        parentObj.setEnabled(!nodeState);
        dispatchOutlinerActions({type:"toggle_show_hide_node", payload: parentObj.uniqueId})
    }

    return (<>
        {showUnit ?
            <div className="unit" ref={selectedMesh == parentObj.uniqueId ? heirarchyCompRef : null}>
                {childObjs.length != 0 ?
                    <button className="unfold-btn" onClick={() => dispatchOutlinerActions({type:"toggle_fold_unfold", payload: parentObj.uniqueId}) }>
                        {unfolded ? <i class="fi fi-rr-minus"></i> : <i class="fi fi-rr-plus"></i>}
                    </button>
                    : <></>
                }
                <div
                    id={parentObj.uniqueId}
                    className={`${selectedMesh == parentObj.uniqueId ? "selected " : ""}unit-name no-break`}
                    onClick={handleUnitNameClick}
                >
                    {parentObj instanceof Mesh ? <i className="fi fi-rr-cube"></i> : <i className="fi fi-rr-code-branch"></i>}
                    <span className="gap-left">{parentObj.name}</span>
                </div>
                {parentObj instanceof Mesh ?
                    <button className="details-btn" onClick={() => dispatchOutlinerActions({type:"toggle_show_hide_details", payload: parentObj.uniqueId}) }>
                        {showDetails ? <i class="fi fi-rr-angle-small-up"></i> : <i class="fi fi-rr-angle-small-down"></i>}
                    </button>
                    : <></>
                }
                <button disabled={!enableEyeBtn} onClick={handleMeshStateChange} className="eye-btn">{nodeState ? <i className="fi fi-rs-eye"></i> : <i className="fi fi-rs-crossed-eye"></i>}</button>
            </div> :
            <></>
        }
        {(showDetails && parentObj instanceof Mesh) ?
            <ul className="details-list">
                {parentObj.material ? <>
                    <li className="no-break"><i class="fi fi-rr-palette"></i>{parentObj.material.name}</li>
                    {parentObj.material.getActiveTextures().map((tex, idx) => <li className="no-break" key={idx}><i class="fi fi-rr-picture"></i>{tex.name}</li>)}
                </> : <li>@ no material</li>}
            </ul>
            : <></>
        }
        {unfolded ?
            <ul className="unit-list">
                {childObjs.map((childObj, idx) => <li key={idx}>
                    <HeirarchyComp parentObj={childObj} enableEyeBtn={nodeState && enableEyeBtn}/>
                </li>)}
            </ul>
            : <></>
        }
    </>);
})
