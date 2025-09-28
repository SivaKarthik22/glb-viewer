import { createContext, useRef, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
    const [variableWidth, setVariableWidth] = useState(20);
    const uploadRef = useRef(null);
    const [enableCanvas, setEnableCanvas] = useState(false);

    function onFileUpload(event){
        setEnableCanvas(true);
    }

    return (
        <Context.Provider value={{
            variableWidth,
            setVariableWidth,
            uploadRef,
            enableCanvas,
            onFileUpload
        }}>
            {children}
        </Context.Provider>
    );
}