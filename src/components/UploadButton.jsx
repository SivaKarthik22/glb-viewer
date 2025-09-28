import { useContext } from "react";
import { Context } from "../context API/ContextProvider";

function UploadButton({buttonText}){
    const {uploadRef} = useContext(Context);

    return(
        <>
            <button
                onClick={()=>{ 
                    if(uploadRef.current)
                        uploadRef.current.click();
                }}
            >
                {buttonText}
            </button>
        </>
    );
}

export default UploadButton;