import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";

function AnimPlayer(){
    const [sliderValue, setSliderValue] = useState(1);
    const {sceneAnimationNames, enableCanvas} = useContext(Context);

    if(enableCanvas && sceneAnimationNames.length > 0){
        return(
            <div id="anim-player">
                <button>Play</button>
                <div className="slidecontainer">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={sliderValue}
                        className="slider"
                        id="myRange"
                        onChange={value => setSliderValue(value)}
                    />
                </div>
            </div>
        );
    }
    return "";
}

export default AnimPlayer;