import { Material, Mesh, TransformNode } from "@babylonjs/core";
import MyScene from "../classes/MyScene";
import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";

export default function MeshSection() {
    const { loading, enableHighlight, setEnableHighlight, selectedMesh } = useContext(Context);
    const mySceneObj = MyScene.getInstanceOfMyScene();

    function displaySceneHeirarchy() {
        const rootMesh = mySceneObj.scene.getNodeByName("__root__");
        return <div id="heirarchy-container">
            {rootMesh ? <HeirarchyComp parentObj={rootMesh} showUnit={false} /> : "no meshes found!"}
        </div>;
    }

    const enableOrDisableHighlight = (event) => {
        const checked = event.target.checked;
        setEnableHighlight(checked);
        mySceneObj.setupEffectLayer(checked);
        mySceneObj.updateMeshHighlight(selectedMesh);
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
            <h4 style={{ margin: 0 }}>Scene Meshes</h4>
            {loading ? <p>Loading...</p> : displaySceneHeirarchy()}
        </div>
    );
}

function HeirarchyComp({ parentObj, showUnit = true }) {
    const { selectedMesh, setSelectedMesh } = useContext(Context);
    const childObjs = parentObj.getChildren((node) => (node instanceof Mesh || node instanceof TransformNode), true);
    const mySceneObj = MyScene.getInstanceOfMyScene();
    const [unfolded, setUnfolded] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    const handleUnitNameClick = event => {
        const uniqueId = parseInt(event.target.id);
        if (selectedMesh == uniqueId) {
            setSelectedMesh(null);
            mySceneObj.updateMeshHighlight();
        }
        else {
            setSelectedMesh(uniqueId);
            mySceneObj.updateMeshHighlight(uniqueId);
        }
    }

    return (<>
        {showUnit ?
            <div className="unit">
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
                    <HeirarchyComp parentObj={childObj} />
                </li>)}
            </ul>
            : <></>
        }
    </>);
}
