function SidePanel(){
    return(
        <div id="side-panel">
            <div id="panel-head">
                <button className="section-heading">Mesh</button>
                <button className="section-heading">Material</button>
                <button className="section-heading">Scene</button>
            </div>
            <div id="panel-body"></div>
        </div>
    );
}

export default SidePanel;