import { useCallback, useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";

function Slider() {
    const [changeColor, setChangeColor] = useState(false);
    const { setVariableWidth, enableCanvas, showSidePanel } = useContext(Context);

    const handleMouseMove = useCallback((event) => {
        let widthPercent = (window.innerWidth - event.clientX) / window.innerWidth * 100;
        widthPercent = Math.max(widthPercent, 15);
        widthPercent = Math.min(widthPercent, 50);
        setVariableWidth(widthPercent);
    }, []);

    const handleMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        setChangeColor(false);
    }, [handleMouseMove]);

    const handleMouseDown = useCallback((event) => {
        event.preventDefault();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        setChangeColor(true);
    }, [handleMouseMove, handleMouseUp]);

    if (enableCanvas && showSidePanel) {
        return (
            <div
                id="slider"
                className={changeColor ? "hover" : "no-hover"}
                onMouseDown={handleMouseDown}
            ></div>
        );
    }
    return "";
}

export default Slider;