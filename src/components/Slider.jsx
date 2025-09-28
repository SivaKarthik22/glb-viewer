import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";

function Slider(){
    const [changeColor, setChangeColor] = useState(false);
    const {setVariableWidth} = useContext(Context);
    const [enableSliding, setEnableSliding] = useState(false);

    const resize = event => {
        if(!enableSliding)
            return;
        
        let widthPercent = (window.innerWidth - event.clientX)/window.innerWidth * 100;
        if(widthPercent <= 15)
            widthPercent = 15;
        else if(widthPercent >= 50)
            widthPercent = 50;
        setVariableWidth(widthPercent);
    }

    return(
        <div
            id="slider"
            className={changeColor ? "hover" : "no-hover"}
            onMouseDown={()=> setEnableSliding(true)}
            onMouseUp={()=> setEnableSliding(false)}
            onMouseMove={resize}
            onMouseEnter={()=> setChangeColor(true)}
            onMouseLeave={()=> setChangeColor(false)}
        ></div>
    );
}

export default Slider;