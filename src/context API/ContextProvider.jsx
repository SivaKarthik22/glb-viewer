import { createContext, useRef, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
    const [variableWidth, setVariableWidth] = useState(20);
    const uploadRef = useRef(null);
    const [enableCanvas, setEnableCanvas] = useState(false);
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);

    function onFileUpload(event){        
        try{
            const file = event.target.files[0];
            if(!file)
                return;
            const reader = new FileReader();
            reader.onload = function(e) {
                setFile(reader.result);
            };
            reader.readAsDataURL(file);
        }catch(err){
            setEnableCanvas(false);
            setLoading(false);
            setFile("");
        }

        setEnableCanvas(true);
        setLoading(true);
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
            setLoading
        }}>
            {children}
        </Context.Provider>
    );
}