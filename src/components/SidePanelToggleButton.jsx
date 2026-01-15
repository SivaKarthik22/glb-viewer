import { useContext } from "react";
import { Context } from "../contextApi/ContextProvider";

export default function SidePanelToggleButton() {
    const { enableCanvas, showSidePanel, toggleSidePanelVisibility } = useContext(Context);

    if (enableCanvas && !showSidePanel) {
        return(
            <button className="side-panel-toggle" id="enable-side-panel" onClick={toggleSidePanelVisibility}><i className="fi fi-sr-angle-double-left"></i></button>
        );
    }
    return "";
}