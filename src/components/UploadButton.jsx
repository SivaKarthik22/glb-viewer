import { useContext } from "react";
import { Context } from "../contextApi/ContextProvider";

function UploadButton({buttonText = null, icon = null, buttonType = ""}){
    const {uploadRef} = useContext(Context);

    return(
        <>
            <button
                className={"upload-btn " + buttonType}
                onClick={()=>{ 
                    if(uploadRef.current)
                        uploadRef.current.click();
                }}
            >
                <span>{icon ? <i className={icon}></i> : ""}</span>
                <span style={icon && buttonText ? {marginLeft:"0.5em"} : {}}>{buttonText ?? ""}</span>
            </button>
        </>
    );
}

export default UploadButton;