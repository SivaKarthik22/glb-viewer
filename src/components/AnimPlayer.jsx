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
    const [maxRange, setMaxRange] = useState(0);
    const [minRange, setMinRange] = useState(0);

    useEffect(()=>{
        if(enableCanvas && !loading){
            setCurAnimIdx(0);
            setPlaying(true);
        }
    }, [loading]);

    /* const playSlider2 = (animation)=>{
        console.log(animation);
        const fps = animation.targetedAnimations[0].animation.framePerSecond;
        const totalSecs = (animation.to - animation.from + 1) / fps;
        if(intervalId.current) clearInterval(intervalId.current);
        intervalId.current = setInterval(()=>{
            setSliderValue(sliderValue => (sliderValue+1)%maxRange);
        }, totalSecs*1000/maxRange);
    } */

    const playSlider = (animation)=>{
        if(intervalId.current) clearInterval(intervalId.current);
        intervalId.current = setInterval(()=>{
            const currentFrame = animation.getCurrentFrame();
            setSliderValue(currentFrame);
        }, 10);
    }

    useEffect(()=>{
        if(!hasAnimations) return;
        const mySceneObj = MyScene.getInstanceOfMyScene();
        if(!mySceneObj) return;
        const animation = mySceneObj.scene.animationGroups[curAnimIdx]; 
        setMaxRange(animation.to);
        setMinRange(animation.from);
        playSlider(animation);
    }, [hasAnimations]);

    if(enableCanvas && hasAnimations){
        const scene = MyScene.getInstanceOfMyScene().scene;

        const handleAnimationChange = event =>{
            scene.animationGroups[curAnimIdx].stop();
            scene.animationGroups[event.target.value].play(true);
            setCurAnimIdx(event.target.value);
            setPlaying(true);
            const animation = scene.animationGroups[event.target.value]; 
            setMaxRange(animation.to);
            setMinRange(animation.from);
            setSliderValue(animation.from);
            playSlider(animation);
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
            const newFrame = event.target.value;
            setSliderValue(newFrame);
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
                            min={minRange}
                            max={maxRange}
                            step="0.01"
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