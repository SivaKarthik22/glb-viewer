import {Engine, Scene, Vector3, ArcRotateCamera, LoadAssetContainerAsync, BoundingInfo, CubeTexture, Color3, MeshDebugPluginMaterial, MeshDebugMode, PointerEventTypes} from "@babylonjs/core";
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
        this.camera.minZ = 0.01;
        this.camera.lowerRadiusLimit = 0.01;
        this.camera.panningInertia = 0.2;
    };

    static getInstanceOfMyScene(canvas){
        if((!MyScene.instance || MyScene.instance == null) && canvas){
            MyScene.instance = new MyScene(canvas);
        }
        return MyScene.instance;
    }

    async importMeshFromFile(glbFile){
        this.container = await LoadAssetContainerAsync(glbFile, this.scene);
        this.container.addAllToScene();
    }

    prepareMeshesForDebugMode(){
        if(!this.container)
            return;
        const sceneMeshes = this.container.meshes;
        for (const mesh of sceneMeshes) {
            MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);
        }
        const sceneMaterials = this.container.materials;
        for (const material of sceneMaterials) {
            new MeshDebugPluginMaterial(material, {
                wireframeVerticesColor: Color3.Black(), //param for wireframe
                wireframeThickness: 0.6, //param for wireframe
                vertexColor: Color3.Black(), //param for wireframe
                vertexRadius: 1, //param for wireframe
                shadedDiffuseColor: Color3.White(), //param for solid view
                shadedSpecularColor: Color3.White(), //param for solid view
                shadedSpecularPower: 1, //param for solid view
            });   
        }
    }

    enableDisableWireframeView(enable){
        if(!this.container)
            return;
        const sceneMaterials = this.container.materials;
        for (const material of sceneMaterials) {
            const plugin = material.pluginManager?.getPlugin("MeshDebug");
            if(enable)
                plugin.mode = MeshDebugMode.TRIANGLES_VERTICES;
            else
                plugin.mode = MeshDebugMode.NONE;
        }
    }

    enableDisableSolidMode(mode){
        if(!this.container)
            return;
        const sceneMaterials = this.container.materials;
        for (const material of sceneMaterials) {
            const plugin = material.pluginManager?.getPlugin("MeshDebug");
            if(mode == "solid")
                plugin.multiply = false;
            else
                plugin.multiply = true;
        }
    }

    async clearSceneMeshes(){
        if(!this.container)
            return;
        this.container.removeAllFromScene();
        this.container = null;
        console.log(this.scene.meshes);
    }

    static disposeInstanceOfMyScene(){
        if(MyScene.instance)
            MyScene.instance = null;
    }

    createEnvironment(envName, colorName = "NONE"){
        this.calculateBoundingInfo();
        this.configureCamera();
        this.setSkyBox(envName, colorName);
        this.setSceneColor(colorName);
    }

    setSkyBox(envName, colorName = "NONE"){
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

    setSceneColor(colorName){
        if(colorName == "NONE"){
            this.skbox.setEnabled(true);
            return;
        }
        this.skbox.setEnabled(false);
        const color = Color3.FromHexString(colorName in colorNames ? colorNames[colorName] : colorNames["GREY"]);
        this.scene.clearColor = color;
    }

    calculateBoundingInfo(){
        if(!this.container)
            return;

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
        console.log(this.sceneBoundingInfo);
    }

    configureCamera(){
        if(!this.sceneBoundingInfo || !this.camera)
            return;
        //focus the bounding info center
        this.camera.setTarget(this.sceneBoundingInfo.boundingBox.centerWorld);
        //set camera position
        this.camera.radius = this.sceneBoundingInfo.boundingSphere.radius * 2.5;
        //set min and max zoom based on bb
        this.camera.upperRadiusLimit = this.sceneBoundingInfo.boundingSphere.radius * 25;
        //set scroll speed based on bb
        this.camera.wheelPrecision = 100 / this.sceneBoundingInfo.boundingSphere.radius;
    }

    focus(meshUId){
        if(!meshUId){
            this.camera.setTarget(this.sceneBoundingInfo.boundingSphere.centerWorld.clone());
            this.camera.radius = this.sceneBoundingInfo.boundingSphere.radius * 2.5;
        }
        else{
            const mesh = this.scene.getMeshByUniqueId(meshUId);
            this.camera.setTarget(mesh.getBoundingInfo().boundingBox.centerWorld.clone());
            this.camera.radius = mesh.getBoundingInfo().boundingSphere.radius * 2.5;
        }
    }

    calculateStats(){
        if(!this.container)
            return;
        
        let meshCount=0, matCount=0, trisCount=0, vertsCount=0, texsCount=0;
        meshCount = this.container.meshes.length;
        matCount = this.container.materials.length;
        texsCount = this.container.textures.length;
        
        this.container.meshes.forEach(mesh => {
            vertsCount += mesh.getTotalVertices();
            trisCount += mesh.getTotalIndices()/3;
        });

        return {meshCount, matCount, trisCount, vertsCount, texsCount};
    }

    onRender(){
    };
}

export default MyScene;