import { createContext, useRef, useState } from "react";
import MyScene from "../classes/MyScene";
import "@babylonjs/loaders/glTF";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
    const [variableWidth, setVariableWidth] = useState(20);
    
    const uploadRef = useRef(null);
    
    const [enableCanvas, setEnableCanvas] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstLoad, setFirstLoad] = useState(false);
    const [glbFile, setGlbFile] = useState("");
    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("none");

    const [sceneAnimationNames, setSceneAnimationNames] = useState([]);

    function onFileUpload(event){        
        try{
            const file = event.target.files[0];
            if(!file)
                return;
            const reader = new FileReader();
            reader.onload = function(e) {
                setGlbFile(reader.result); 
                if(!enableCanvas){
                    setEnableCanvas(true);
                    setFirstLoad(true);
                }
                else{
                    setLoading(true);
                    const mySceneObj = MyScene.getInstanceOfMyScene();
                    mySceneObj.clearSceneMeshes()
                    .then(()=>{
                        mySceneObj.importMeshFromFile(glbFile)
                    })
                    .then(()=>{
                        setLoading(false);
                    });
                }
            };
            reader.readAsDataURL(file);
        }catch(err){
            disableLoading();
            enableToast("Error loading file", "error")
            console.error(err);
        }
    }

    function enableToast(toastMessage, toastType){
        setShowToast(true);
        setToastMessage(toastMessage);
        setToastType(toastType);
    }

    function forceDisableToast(){
        setShowToast(false);
        setToastMessage("");
        setToastType("none");
    }

    function disableLoading(){
        setLoading(false);
        setGlbFile("");
    }

    function refreshSceneAnimationNames(){
        const animNames = []
        MyScene.getInstanceOfMyScene().scene.animationGroups.forEach(anim => {
          animNames.push(anim.name);
        });
        setSceneAnimationNames(animNames);
    }

    return (
        <Context.Provider value={{
            variableWidth,
            setVariableWidth,
            uploadRef,
            enableCanvas,
            onFileUpload,
            glbFile,
            loading,
            setLoading,
            showToast,
            enableToast,
            forceDisableToast,
            toastMessage,
            toastType,
            disableLoading,
            sceneAnimationNames,
            setSceneAnimationNames,
            firstLoad,
            setFirstLoad,
            refreshSceneAnimationNames,
        }}>
            {children}
        </Context.Provider>
    );
}