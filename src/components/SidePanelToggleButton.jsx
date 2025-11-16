import { useContext } from "react";
import { Context } from "../context API/ContextProvider";

export default function SidePanelToggleButton() {
    const { enableCanvas, showSidePanel, toggleSidePanelVisibility } = useContext(Context);

    if (enableCanvas && !showSidePanel) {
        return(
            <button className="side-panel-toggle" id="enable-side-panel" onClick={toggleSidePanelVisibility}>{"<<"}</button>
        );
    }
    return "";
}