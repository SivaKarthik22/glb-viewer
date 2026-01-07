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
            {enableCanvas ? <div style={{display:"flex", gap:"0.5em"}}>
                <UploadButton icon="fi fi-rr-upload" buttonType="abs-btn" />
                <button onClick={handleFocusBtnClick} className="abs-btn"><i class="fi fi-rr-arrows-to-eye"></i></button>
            </div> : ""}
        </div>
    );
}

export default AbsoluteButtons;