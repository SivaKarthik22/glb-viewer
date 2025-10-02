import { useContext } from "react";
import { Context } from "../context API/ContextProvider";

export default function LoadingComp(){
    const {loading} = useContext(Context);

    if(loading){
        return(
            <div id="loading">
                Loading...
            </div>
        );
    }

    return "";
}