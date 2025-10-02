import UploadButton from "./UploadButton";
import { Context } from "../context API/ContextProvider";
import { useContext } from "react";

export default function HomePage(){
    const {enableCanvas} = useContext(Context);

    if(!enableCanvas){
        return(
            <div id="pre-canvas">
              <UploadButton buttonText="Upload GLB/GLTF file" />
            </div>
        );
    }
    return "";
}