import {Engine, Scene, Vector3, ArcRotateCamera, AppendSceneAsync, LoadAssetContainerAsync, BoundingInfo, MeshBuilder} from "@babylonjs/core";
import "@babylonjs/loaders/glTF"

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

    createEnvironment(environmentName){
        //1. calculate overall bounding info
        this.calculateBoundingInfo();

        if(this.sceneBoundingInfo){
            //4. focus the bounding info center
            this.camera.setTarget(this.sceneBoundingInfo.boundingBox.centerWorld);
            //6. set camera position
            this.camera.radius = this.sceneBoundingInfo.boundingSphere.radius * 2.5;
            //2. set min and max zoom based on bb
            this.camera.upperRadiusLimit = this.sceneBoundingInfo.boundingSphere.radius * 25;
            this.camera.lowerRadiusLimit = this.sceneBoundingInfo.boundingSphere.radius;
            //5. set scroll speed based on bb
            //this.camera.wheelPrecision = this.sceneBoundingInfo.boundingSphere.radius * 50;
        }
        //3. create environment with dimensions based on bounding info

        const env = this.scene.createDefaultEnvironment({
            environmentTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createSkybox: true, 
            skyboxTexture: "./assets/Studio_Softbox_2Umbrellas_cube_specular.env",
            createGround: false,
        });
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