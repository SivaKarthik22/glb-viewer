import {Engine, Scene, HemisphericLight, Vector3, ArcRotateCamera, AppendSceneAsync} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"

class MyScene{
    constructor(canvas){
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true, {}, true);
        this.scene = new Scene(this.engine, {});
    }

    async onSceneReady(file){
        this.camera = new ArcRotateCamera("camera1", 0, 0, 10, new Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        // const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        // light.intensity = 0.7;

        const env = this.scene.createDefaultEnvironment({
            environmentTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createSkybox: true, 
            skyboxTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createGround: false,
        });

        await AppendSceneAsync(file, this.scene);
        console.log(this.scene);
    };

    onRender(){
    };
}

export default MyScene;