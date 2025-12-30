import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";
import SceneSection from "./SceneSection";
import MeshSection from "./MeshSection";

function SidePanel() {
    const { variableWidth, enableCanvas, showSidePanel, toggleSidePanelVisibility } = useContext(Context);
    const [currentSection, setCurrentSection] = useState("Mesh");

    const sectionBtnClick = event =>{
        setCurrentSection(event.target.id);
    }

    if (enableCanvas && showSidePanel) {
        return (
            <div id="side-panel" style={{ width: `${variableWidth}%` }}>
                <button
                    className="side-panel-toggle"
                    id="disable-side-panel"
                    onClick={toggleSidePanelVisibility}
                >{">>"}</button>
                <div id="panel-head">
                    <button
                        id="Mesh"
                        className= {`${currentSection === "Mesh" ? "selected " : ""}section-heading`}
                        onClick={sectionBtnClick}
                    >Scene</button>
                    <button
                        id="Scene"
                        className= {`${currentSection === "Scene" ? "selected " : ""}section-heading`}
                        onClick={sectionBtnClick}
                    >Settings</button>
                </div>
                <div id="panel-body">
                    {currentSection === "Mesh" && <MeshSection />}
                    {currentSection === "Scene" && <SceneSection />}
                </div>
            </div>
        );
    }
    return "";
}

export default SidePanel;