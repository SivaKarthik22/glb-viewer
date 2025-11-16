import {Engine, Scene, Vector3, ArcRotateCamera, AppendSceneAsync, LoadAssetContainerAsync, BoundingInfo, MeshBuilder, CubeTexture, Color3} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"
import { colorNames, environmentNames } from "../utils/environmentNames";

class MyScene{
    static instance = null;

    constructor(canvas){
        this.canvas = canvas;
        this.engine = new Engine(this.canvas, true, {}, true);
        this.scene = new Scene(this.engine, {});
    }

    async onSceneReady(){
        this.camera = new ArcRotateCamera("camera1", 0, 0, 10, new Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        this.camera.minZ = 0;
        this.camera.lowerRadiusLimit = 0;
    };

    static getInstanceOfMyScene(canvas){
        if((!this.instance || this.instance == null) && canvas){
            this.instance = new MyScene(canvas);
        }
        return this.instance;
    }

    async importMeshFromFile(glbFile){
        //await AppendSceneAsync(glbFile, this.scene);
        this.container = await LoadAssetContainerAsync(glbFile, this.scene);
        this.container.addAllToScene();
    }

    async clearSceneMeshes(){
        if(!this.container)
            return;
        this.container.removeAllFromScene();
        this.container = null;
        console.log(this.scene.meshes);
    }

    static disposeInstanceOfMyScene(){
        if(this.instance)
            this.instance = null;
    }

    createEnvironment(envName, colorName = "NONE"){
        //calculate overall bounding info
        this.calculateBoundingInfo();

        if(this.sceneBoundingInfo){
            //focus the bounding info center
            this.camera.setTarget(this.sceneBoundingInfo.boundingBox.centerWorld);
            //set camera position
            this.camera.radius = this.sceneBoundingInfo.boundingSphere.radius * 2.5;
            //set min and max zoom based on bb
            this.camera.upperRadiusLimit = this.sceneBoundingInfo.boundingSphere.radius * 25;
            //set scroll speed based on bb
            this.camera.wheelPrecision = 100 / this.sceneBoundingInfo.boundingSphere.radius;
        }

        const envPath = envName in environmentNames ? environmentNames[envName] : environmentNames["STUDIO"];
        const skyboxSize = this.sceneBoundingInfo ? this.sceneBoundingInfo.boundingSphere.radius * 5000 : 5000;

        //create environment with dimensions based on bounding info

        this.hdrTexture = new CubeTexture(envPath, this.scene);
        this.skbox = this.scene.createDefaultSkybox(this.hdrTexture, true, skyboxSize, 0.4);

        const color = Color3.FromHexString(colorName in colorNames ? colorNames[colorName] : colorNames["GREY"]);
        this.scene.clearColor = color;

        if(colorName in colorNames && colorName != "NONE")
            this.skbox.setEnabled(false);

        // const env = this.scene.createDefaultEnvironment({
        //     environmentTexture: envPath,
        //     createSkybox: true, 
        //     skyboxTexture: envPath,
        //     createGround: false,
        //     skyboxSize: skyboxSize,
        // });
    }

    changeEnvironment(envName, colorName = "NONE"){
        if(this.hdrTexture)
            this.hdrTexture.dispose();
        if(this.skbox)
            this.skbox.dispose();

        const envPath = envName in environmentNames ? environmentNames[envName] : environmentNames["STUDIO"];
        const skyboxSize = this.sceneBoundingInfo ? this.sceneBoundingInfo.boundingSphere.radius * 5000 : 5000;

        this.hdrTexture = new CubeTexture(envPath, this.scene);
        this.skbox = this.scene.createDefaultSkybox(this.hdrTexture, true, skyboxSize, 0.4);

        if(colorName in colorNames && colorName != "NONE")
            this.skbox.setEnabled(false);
    }

    changeSceneColor(colorName){
        if(colorName == "NONE"){
            this.skbox.setEnabled(true);
            return;
        }
        this.skbox.setEnabled(false);
        const color = Color3.FromHexString(colorName in colorNames ? colorNames[colorName] : colorNames["GREY"]);
        this.scene.clearColor = color;
    }

    calculateBoundingInfo(){
        this.sceneBoundingInfo = null;

        const sceneMeshes = this.container.meshes.filter(mesh => {
            const meshMin = mesh.getBoundingInfo().boundingBox.minimumWorld;
            const meshMax = mesh.getBoundingInfo().boundingBox.maximumWorld;
            return !(meshMin.equals(meshMax));
        });

        if(sceneMeshes.length == 0)
            return;
        
        let spaceMin = sceneMeshes[0].getBoundingInfo().boundingBox.minimumWorld;
        let spaceMax = sceneMeshes[0].getBoundingInfo().boundingBox.maximumWorld;
        sceneMeshes.forEach(mesh => {
            const meshMin = mesh.getBoundingInfo().boundingBox.minimumWorld;
            const meshMax = mesh.getBoundingInfo().boundingBox.maximumWorld;
            spaceMin = Vector3.Minimize(spaceMin, meshMin);
            spaceMax = Vector3.Maximize(spaceMax, meshMax);
        });

        if(spaceMin.equals(spaceMax))
            return;
        
        this.sceneBoundingInfo = new BoundingInfo(spaceMin, spaceMax);

        // const boundingMesh = MeshBuilder.CreateBox("sceneBoundingBox", {
        //     width: tempBoundingInfo.boundingBox.maximumWorld.x - tempBoundingInfo.boundingBox.minimumWorld.x,
        //     height: tempBoundingInfo.boundingBox.maximumWorld.y - tempBoundingInfo.boundingBox.minimumWorld.y,
        //     depth: tempBoundingInfo.boundingBox.maximumWorld.z - tempBoundingInfo.boundingBox.minimumWorld.z,
        // }, this.scene);

        // boundingMesh.position.copyFrom(tempBoundingInfo.boundingBox.centerWorld)
        // boundingMesh.visibility = 0;
        // boundingMesh.isPickable = false;
        // //boundingMesh.showBoundingBox = true;
        // this.sceneBoundingBox = boundingMesh;

        console.log(this.sceneBoundingInfo);
    }

    onRender(){
    };
}

export default MyScene;