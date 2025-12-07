import { useContext, useState } from "react";
import { Context } from "../context API/ContextProvider";
import SceneSection from "./SceneSection";
import MeshSection from "./MeshSection";

function SidePanel() {
    const { variableWidth, enableCanvas, showSidePanel, toggleSidePanelVisibility } = useContext(Context);
    const [currentSection, setCurrentSection] = useState("Scene");

    const sectionBtnClick = event =>{
        setCurrentSection(event.target.innerText);
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
                        className= {`${currentSection === "Mesh" ? "selected " : ""}section-heading`}
                        onClick={sectionBtnClick}
                    >Mesh</button>
                    {/* <button
                        className="section-heading"
                        onClick={sectionBtnClick}
                    >Material</button> */}
                    <button 
                        className= {`${currentSection === "Scene" ? "selected " : ""}section-heading`}
                        onClick={sectionBtnClick}
                    >Scene</button>
                </div>
                <div id="panel-body">
                    {currentSection === "Mesh" && <MeshSection />}
                    {/*currentSection === "Material" && <MaterialSection />*/}
                    {currentSection === "Scene" && <SceneSection />}
                </div>
            </div>
        );
    }
    return "";
}

export default SidePanel;