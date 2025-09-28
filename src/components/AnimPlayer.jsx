import { useState } from "react";

function AnimPlayer(){
    const [sliderValue, setSliderValue] = useState(1);
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

export default AnimPlayer;