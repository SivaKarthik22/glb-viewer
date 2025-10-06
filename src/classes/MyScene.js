import {Engine, Scene, Vector3, ArcRotateCamera, AppendSceneAsync, LoadAssetContainerAsync} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"

class MyScene{
    static instance;

    constructor(canvas){
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true, {}, true);
        this.scene = new Scene(this.engine, {});
    }

    async onSceneReady(){
        this.camera = new ArcRotateCamera("camera1", 0, 0, 10, new Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);

        const env = this.scene.createDefaultEnvironment({
            environmentTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createSkybox: true, 
            skyboxTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createGround: false,
        });
    };

    static getInstanceOfMyScene(canvas){
        if(!this.instance && canvas){
            this.instance = new MyScene(canvas);
        }
        return this.instance;
    }

    async importMeshFromFile(glbFile){
        //await AppendSceneAsync(glbFile, this.scene);
        this.container = await LoadAssetContainerAsync(glbFile, this.scene);
        this.container.addAllToScene();
        console.log(this.scene.meshes);
    }

    async clearSceneMeshes(){
        if(!this.container)
            return;
        this.container.removeAllFromScene();
        this.container = null;
        console.log(this.scene.meshes);
    }

    onRender(){
    };
}

export default MyScene;