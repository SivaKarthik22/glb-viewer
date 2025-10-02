import { createContext, useRef, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
    const [variableWidth, setVariableWidth] = useState(20);
    
    const uploadRef = useRef(null);
    
    const [enableCanvas, setEnableCanvas] = useState(false);
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);
    
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
                setFile(reader.result);
                setEnableCanvas(true);
                setLoading(true);
            };
            reader.readAsDataURL(file);
        }catch(err){
            disableCanvas();
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

    function disableCanvas(){
        setEnableCanvas(false);
        setLoading(false);
        setFile("");
    }

    return (
        <Context.Provider value={{
            variableWidth,
            setVariableWidth,
            uploadRef,
            enableCanvas,
            onFileUpload,
            file,
            loading,
            setLoading,
            showToast,
            enableToast,
            forceDisableToast,
            toastMessage,
            toastType,
            disableCanvas,
            sceneAnimationNames,
            setSceneAnimationNames,
        }}>
            {children}
        </Context.Provider>
    );
}