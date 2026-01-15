import { useContext } from "react";
import MyScene from "../classes/MyScene";
import { colorNames, environmentNames } from "../utils/environmentNames";
import { Context } from "../contextApi/ContextProvider";

export default function SceneSection() {
    const mySceneObj = MyScene.getInstanceOfMyScene();
    const { setCurrentEnvironment, currentEnvironment, currentColor, setCurrentColor, wireframe, setWireframe, textureMode, setTextureMode, statsData, loading } = useContext(Context);

    const handleViewModeChange = event => {
        setTextureMode(event.target.value);
        mySceneObj.enableDisableSolidMode(event.target.value);
    };

    const handleWireframeViewChange = event => {
        setWireframe(event.target.checked);
        mySceneObj.enableDisableWireframeView(event.target.checked);
    };

    function formatNumberString(num) {
        if (num == 0) return num;

        let arr = [], count = 0;
        while (num > 0) {
            if (count > 0 && count % 3 === 0)
                arr.push(',');
            let digit = num % 10;
            arr.push(digit);
            count++;
            num = Math.floor(num / 10);
        }
        return arr.reverse().join('');
    }

    return (
        <div id="scene-section">
            <h4>Enironment</h4>
            <div className="flex">
                {
                    Object.keys(environmentNames).map((envName, index) => (
                        <button
                            className={`env-btn ${envName == currentEnvironment ? "selected" : ""}`}
                            key={index}
                            onClick={() => {
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
                            onClick={() => {
                                mySceneObj.setSceneColor(colorName);
                                setCurrentColor(colorName);
                            }}
                        >{colorName}</button>
                    ))
                }
            </div>

            <h4>View mode</h4>
            <div>
                <div className="radio-label medium">
                    <input
                        type="radio"
                        value="textured"
                        checked={textureMode === "textured"}
                        onChange={handleViewModeChange}
                        className="checkbox-input"
                    />
                    Textured View
                </div>
                <div className="radio-label medium">
                    <input
                        type="radio"
                        value="solid"
                        checked={textureMode === "solid"}
                        onChange={handleViewModeChange}
                        className="checkbox-input"
                    />
                    Solid View
                </div>
            </div>

            <div className="flex">
                <h4>Wireframe view:</h4>
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={wireframe}
                    onChange={handleWireframeViewChange}
                    style={{ marginBottom: 0 }}
                />
            </div>

            <h4>Scene Stats</h4>

            {loading ? <p>Loading...</p> :
                <div className="stats-grid medium">
                    <span>Total meshes:</span><span>{formatNumberString(statsData.meshCount)}</span>
                    <span>Total triangles:</span><span>{formatNumberString(statsData.trisCount)}</span>
                    <span>Total vertices:</span><span>{formatNumberString(statsData.vertsCount)}</span>
                    <span>Total Materials:</span><span>{formatNumberString(statsData.matCount)}</span>
                    <span>Total Textures:</span><span>{formatNumberString(statsData.texsCount)}</span>
                </div>
            }

        </div>
    );
}