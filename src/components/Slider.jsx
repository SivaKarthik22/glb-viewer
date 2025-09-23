import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";

function Slider(){
    const[changeColor, setChangeColor] = useState(false);
    const {setVariableWidth} = useContext(Context);

    const resize = event => {
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
            onDrag={resize}
            onDragEnd={resize}
            className={changeColor ? "hover" : "no-hover"}
            onMouseEnter={()=> setChangeColor(true)}
            onMouseLeave={()=> setChangeColor(false)}
        ></div>
    );
}

export default Slider;