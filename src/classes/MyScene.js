import {Engine, Scene, MeshBuilder, HemisphericLight, FreeCamera, Vector3, ArcRotateCamera} from "@babylonjs/core";

class MyScene{
    constructor(canvas){
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true, {}, true);
        this.scene = new Scene(this.engine, {});
    }

    onSceneReady(){
        this.camera = new ArcRotateCamera("camera1", 0, 0, 10, new Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
        const box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
        box.position.y = 1;
        MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, this.scene);
    };

    onRender(){
    };
}

export default MyScene;