import { createContext, useRef, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
    const [variableWidth, setVariableWidth] = useState(20);
    
    const uploadRef = useRef(null);
    
    const [enableCanvas, setEnableCanvas] = useState(false);
    const [loading, setLoading] = useState(false);
    let glbFile = "";
    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("none");

    const [sceneAnimationNames, setSceneAnimationNames] = useState([]);

    function onFileUpload(event){        
        try{
            const file = event.target.files[0];
            if(!file)
                return;
            const reader = new FileReader();
            reader.onload = function(e) {
                glbFile = reader.result; 
                if(!enableCanvas){
                    setEnableCanvas(true);
                    setFirstLoad(true);
                }
                else{
                    importMeshFromFile(glbFile);
                }
                setLoading(true);
            };
            reader.readAsDataURL(file);
        }catch(err){
            disableLoading();
            enableToast("Error loading file", "error")
            console.error(err);
        }
    }

    function enableToast(toastMessage, toastType){
        setShowToast(true);
        setToastMessage(toastMessage);
        setToastType(toastType);
    }

    function forceDisableToast(){
        setShowToast(false);
        setToastMessage("");
        setToastType("none");
    }

    function disableLoading(){
        setLoading(false);
        glbFile = "";
    }

    return (
        <Context.Provider value={{
            variableWidth,
            setVariableWidth,
            uploadRef,
            enableCanvas,
            onFileUpload,
            glbFile,
            loading,
            setLoading,
            showToast,
            enableToast,
            forceDisableToast,
            toastMessage,
            toastType,
            disableLoading,
            sceneAnimationNames,
            setSceneAnimationNames,
        }}>
            {children}
        </Context.Provider>
    );
}