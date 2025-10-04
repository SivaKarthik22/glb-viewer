import UploadButton from "./UploadButton";
import { useContext } from "react";
import { Context } from "../context API/ContextProvider";

function AbsoluteButtons(){
    const {uploadRef, onFileUpload, enableCanvas} = useContext(Context);

    return(
        <div id="abs-buttons">
            <input
                type="file"
                accept=".glb,.gltf"
                className="upload-input"
                ref={uploadRef}
                onChange={onFileUpload}
            />
            {enableCanvas ? <>
                <UploadButton buttonText="Upload"/>
                <button>Focus</button>
            </> : ""}
        </div>
    );
}

export default AbsoluteButtons;