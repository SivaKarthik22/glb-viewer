import { useContext, useEffect } from "react";
import { Context } from "../context API/ContextProvider";

export default function Toaster(){
    const {showToast, toastMessage, toastType, forceDisableToast} = useContext(Context);
    
    useEffect(()=>{
        if(!showToast)
            return;
        const timeoutId = setTimeout(()=>{
            forceDisableToast();
        }, 3000);

        return ()=>{
            clearTimeout(timeoutId);
        }
    }, [showToast]);

    if(showToast){
        return(
            <div id="toaster" className={toastType}>
                {toastMessage}
            </div>
        );
    }

    return "";
}