function AnimPlayer(){
    return(
        <div id="anim-player">
            <button>Play</button>
            <div class="slidecontainer">
                <input type="range" min="1" max="100" value="50" class="slider" id="myRange"/>
            </div>
        </div>
    );
}

export default AnimPlayer;