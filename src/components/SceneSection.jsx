import { useContext } from "react";
import MyScene from "../classes/MyScene";
import {colorNames, environmentNames} from "../utils/environmentNames";
import { Context } from "../context API/ContextProvider";

export default function SceneSection() {
    const mySceneObj = MyScene.getInstanceOfMyScene();
    const {setCurrentEnvironment, currentEnvironment, currentColor, setCurrentColor, wireframe, setWireframe, textureMode, setTextureMode} = useContext(Context);

    const handleViewModeChange = event => {
        setTextureMode(event.target.value);
        mySceneObj.enableDisableSolidMode(event.target.value);
    };

    const handleWireframeViewChange = event => {
        setWireframe(event.target.checked);
        mySceneObj.enableDisableWireframeView(event.target.checked);
    };

    return (
        <div>
            <h4>Enironment</h4>
            <div className="flex">
                {
                    Object.keys(environmentNames).map((envName, index) => (
                        <button
                            className={`env-btn ${envName == currentEnvironment ? "selected" : ""}`}
                            key={index}
                            onClick={()=>{
                                mySceneObj.setSkyBox(envName, currentColor);
                                setCurrentEnvironment(envName);
                            }}
                        >{envName}</button>
                    ))
                }
            </div>

            <h4>Scene Color</h4>
            <div className="flex">
                {
                    Object.keys(colorNames).map((colorName, index) => (
                        <button
                            className={`env-btn ${colorName == currentColor ? "selected" : ""}`}
                            key={index}
                            onClick={()=>{
                                mySceneObj.setSceneColor(colorName);
                                setCurrentColor(colorName);
                            }}
                        >{colorName}</button>
                    ))
                }
            </div>

            <h4>View mode</h4>
            <div>
                <label>
                    <input 
                    type="radio"
                    value="textured" 
                    checked={textureMode === "textured"} 
                    onChange={handleViewModeChange}
                    /> Textured View
                </label>
                <br />
                <label>
                    <input 
                    type="radio"
                    value="solid" 
                    checked={textureMode === "solid"} 
                    onChange={handleViewModeChange}
                    /> Solid View
                </label>
            </div>

            <h4>Wireframe view</h4>
            <div>
                <input 
                type="checkbox"
                checked={wireframe} 
                onChange={handleWireframeViewChange}
                />
            </div>
            
            <h4>Stats</h4>
            <div>
                <ul>
                    <li>Total meshes</li>
                    <li>Total triangles</li>
                    <li>Total vertices</li>
                    <li>Total Materials</li>
                    <li>Total Textures</li>
                </ul>
            </div>
        </div>
    );
}