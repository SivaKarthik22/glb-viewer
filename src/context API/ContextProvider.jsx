import { createContext, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
    const [variableWidth, setVariableWidth] = useState(20);
    
    return (
        <Context.Provider value={{variableWidth, setVariableWidth}}>
            {children}
        </Context.Provider>
    );
}