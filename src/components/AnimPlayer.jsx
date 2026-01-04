import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context API/ContextProvider";
import MyScene from "../classes/MyScene";

function AnimPlayer(){
    const { hasAnimations, enableCanvas, loading } = useContext(Context);
    const [playing, setPlaying] = useState(true);
    const [curAnimIdx, setCurAnimIdx] = useState(0);
    const [sliderValue, setSliderValue] = useState(0);
    const [showAnimPlayer, setShowAnimPlayer] = useState(true);
    const intervalId = useRef(null);
    const maxRange = 500;

    useEffect(()=>{
        if(enableCanvas && !loading){
            setCurAnimIdx(0);
            setPlaying(true);
        }
    }, [loading]);

    const playSlider = (animation)=>{
        const fps = animation.targetedAnimations[0].animation.framePerSecond;
        const totalSecs = animation.to / fps;
        if(intervalId.current) clearInterval(intervalId.current);
        intervalId.current = setInterval(()=>{
            setSliderValue(sliderValue => (sliderValue+1)%maxRange);
        }, totalSecs*1000/maxRange);
    }

    useEffect(()=>{
        if(!hasAnimations) return;
        const mySceneObj = MyScene.getInstanceOfMyScene();
        if(!mySceneObj) return;
        playSlider( mySceneObj.scene.animationGroups[0] );
    }, [hasAnimations]);

    if(enableCanvas && hasAnimations){
        const scene = MyScene.getInstanceOfMyScene().scene;

        const handleAnimationChange = event =>{
            scene.animationGroups[curAnimIdx].stop();
            scene.animationGroups[event.target.value].play(true);
            setCurAnimIdx(event.target.value);
            setPlaying(true);
            setSliderValue(0);
            playSlider(scene.animationGroups[event.target.value]);
        }

        const handlePlayPause = () =>{
            if(playing){ //pause
                scene.animationGroups[curAnimIdx].pause();
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
            else{ //play
                scene.animationGroups[curAnimIdx].play();
                playSlider(scene.animationGroups[curAnimIdx]);
            }
            setPlaying(playing => !playing);
        }

        const handleSliderSliding = event =>{
            if(intervalId.current) clearInterval(intervalId.current);
            const animation = scene.animationGroups[curAnimIdx];
            setSliderValue(event.target.value);
            const newFrame = event.target.value / maxRange * animation.to;
            animation.goToFrame(newFrame);
            if(playing) playSlider(scene.animationGroups[curAnimIdx]);
        }

        return(
            <>
                {showAnimPlayer ?
                    <div id="anim-player">
                        <button id="play-btn" onClick={handlePlayPause}>{playing ? "Pause" : "Play"}</button>
                        <input
                            type="range"
                            min="0"
                            max={maxRange}
                            value={sliderValue}
                            id="anim-slider"
                            onChange={event => setSliderValue(event.target.value)}
                            onInput={handleSliderSliding}
                        />
                        <select value={curAnimIdx} onChange={handleAnimationChange}>
                            {scene.animationGroups.map((anim,idx) => <option key={idx} value={idx}>{anim.name}</option>)}
                        </select>
                    </div> :
                <></>}
                <ToggleButton toggleState={showAnimPlayer} setToggleState={setShowAnimPlayer} />
            </>
        );
    }
    return "";
}

export default AnimPlayer;

const ToggleButton = ({toggleState, setToggleState}) => {
    return (
        <button
            className={`toggle-btn ${toggleState ? "close-btn" : "open-btn"}`}
            onClick={()=> setToggleState(toggleState => !toggleState)}
        >
            {toggleState ? ">>" : "<<"}
        </button>
    );
}