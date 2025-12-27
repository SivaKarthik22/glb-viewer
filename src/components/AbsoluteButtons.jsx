import UploadButton from "./UploadButton";
import { useContext } from "react";
import { Context } from "../context API/ContextProvider";
import MyScene from "../classes/MyScene";

function AbsoluteButtons() {
    const { uploadRef, onFileUpload, enableCanvas, selectedMesh, heirarchyCompRef, autoFocus } = useContext(Context);
    const mySceneObj = MyScene.getInstanceOfMyScene();

    const handleFocusBtnClick = () => {
        mySceneObj.focus(selectedMesh);
        if (autoFocus && heirarchyCompRef.current) {
            heirarchyCompRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    return (
        <div id="abs-buttons">
            <input
                type="file"
                accept=".glb"
                className="upload-input"
                ref={uploadRef}
                onChange={onFileUpload}
            />
            {enableCanvas ? <>
                <UploadButton buttonText="Upload" />
                <button onClick={handleFocusBtnClick}>Focus</button>
            </> : ""}
        </div>
    );
}

export default AbsoluteButtons;