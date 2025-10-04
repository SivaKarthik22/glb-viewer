import {Engine, Scene, Vector3, ArcRotateCamera, AppendSceneAsync} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"

class MyScene{
    static instance;

    constructor(canvas){
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true, {}, true);
        this.scene = new Scene(this.engine, {});
    }

    async onSceneReady(file){
        this.camera = new ArcRotateCamera("camera1", 0, 0, 10, new Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);

        const env = this.scene.createDefaultEnvironment({
            environmentTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createSkybox: true, 
            skyboxTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createGround: false,
        });

        await AppendSceneAsync(file, this.scene);
        console.log(this.scene);
    };

    static getInstanceOfMyScene(canvas){
        if(!this.instance && canvas){
            this.instance = new MyScene(canvas);
        }
        return this.instance;
    }

    onRender(){
    };
}

export default MyScene;