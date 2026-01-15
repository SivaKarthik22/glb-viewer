import { useContext } from "react";
import { Context } from "../contextApi/ContextProvider";

export default function LoadingComp(){
    const {loading} = useContext(Context);

    if(loading){
        return(
            <div id="loading-bg">
                <div id="loading-container">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return "";
}