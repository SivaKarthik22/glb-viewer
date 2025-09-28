import UploadButton from "./UploadButton";
import { useContext } from "react";
import { Context } from "../context API/ContextProvider";

function AbsoluteButtons(){
    const {uploadRef, onFileUpload} = useContext(Context);

    return(
        <div id="abs-buttons">
            <input
                type="file"
                accept=".glb,.gltf"
                className="upload-input"
                ref={uploadRef}
                onChange={onFileUpload}
            />
            <UploadButton buttonText="Upload"/>
            <button>Focus</button>
        </div>
    );
}

export default AbsoluteButtons;