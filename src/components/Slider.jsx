import { useState } from "react";

function Slider(){
    const[changeColor, setChangeColor] = useState(false);

    const resize = event => {
        const widthPercent = (window.innerWidth - event.clientX)/window.innerWidth * 100;
        console.log("X", widthPercent);
    }

    return(
        <div
            id="slider"
            onDrag={resize}
            className={changeColor ? "hover" : "no-hover"}
            onMouseEnter={()=> setChangeColor(true)}
            onMouseLeave={()=> setChangeColor(false)}
        ></div>
    );
}

export default Slider;