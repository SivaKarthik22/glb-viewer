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
                ><i class="fi fi-sr-angle-double-right"></i></button>
                <div id="panel-head">
                    <button
                        id="Mesh"
                        className= {`${currentSection === "Mesh" ? "selected " : ""}section-heading`}
                        onClick={sectionBtnClick}
                    ><i class="fi fi-sr-cube gap-right"></i>Scene</button>
                    <button
                        id="Scene"
                        className= {`${currentSection === "Scene" ? "selected " : ""}section-heading`}
                        onClick={sectionBtnClick}
                    ><i class="fi fi-sr-settings gap-right"></i>Settings</button>
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