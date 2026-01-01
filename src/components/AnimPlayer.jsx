import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";
import MyScene from "../classes/MyScene";

function AnimPlayer(){
    const [sliderValue, setSliderValue] = useState(0);
    const {hasAnimations, enableCanvas} = useContext(Context);
    const [curAnimIdx, setCurAnimIdx] = useState(0);
    const [playing, setPlaying] = useState(true);

    if(enableCanvas && hasAnimations){
        const scene = MyScene.getInstanceOfMyScene().scene;

        const handleAnimationChange = event =>{
            scene.animationGroups[curAnimIdx].stop();
            scene.animationGroups[event.target.value].play(true);
            setCurAnimIdx(event.target.value);
            setPlaying(true);
        }

        const handlePlayPause = () =>{
            if(playing)
                scene.animationGroups[curAnimIdx].pause();
            else
                scene.animationGroups[curAnimIdx].play();
            setPlaying(playing => !playing);
        }

        return(
            <div id="anim-player">
                <button id="play-btn" onClick={handlePlayPause}>{playing ? "Pause" : "Play"}</button>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={sliderValue}
                    id="anim-slider"
                    onChange={value => setSliderValue(value)}
                />
                <select value={curAnimIdx} onChange={handleAnimationChange}>
                    {scene.animationGroups.map((anim,idx) => <option key={idx} value={idx}>{anim.name}</option>)}
                </select>
            </div>
        );
    }
    return "";
}

export default AnimPlayer;