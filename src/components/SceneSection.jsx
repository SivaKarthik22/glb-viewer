import { useContext } from "react";
import MyScene from "../classes/MyScene";
import {colorNames, environmentNames} from "../utils/environmentNames";
import { Context } from "../context API/ContextProvider";

export default function SceneSection() {
    const mySceneObj = MyScene.getInstanceOfMyScene(canvas);
    const {setCurrentEnvironment, currentEnvironment, currentColor, setCurrentColor} = useContext(Context);

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
                                mySceneObj.changeEnvironment(envName, currentColor);
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
                                mySceneObj.changeSceneColor(colorName);
                                setCurrentColor(colorName);
                            }}
                        >{colorName}</button>
                    ))
                }
            </div>

            <h4>View mode</h4>
            <h4>Wireframe view</h4>
            <h4>XRay view </h4>
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