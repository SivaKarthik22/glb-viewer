import { useContext } from "react";
import { Context } from "../context API/ContextProvider";

function SidePanel() {
    const { variableWidth, enableCanvas } = useContext(Context);

    if (enableCanvas) {
        return (
            <div id="side-panel" style={{ width: `${variableWidth}%` }}>
                <div id="panel-head">
                    <button className="section-heading">Mesh</button>
                    <button className="section-heading">Material</button>
                    <button className="section-heading">Scene</button>
                </div>
                <div id="panel-body"></div>
            </div>
        );
    }
    return "";
}

export default SidePanel;