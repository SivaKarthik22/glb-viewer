import { createContext, useRef, useState } from "react";
import MyScene from "../classes/MyScene";
import "@babylonjs/loaders/glTF";

export const Context = createContext(null);

export const ContextProvider = ({ children }) => {
    const [variableWidth, setVariableWidth] = useState(20);

    const uploadRef = useRef(null);

    const [enableCanvas, setEnableCanvas] = useState(false);
    const [loading, setLoading] = useState(false);
    const [glbFile, setGlbFile] = useState("");

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("none");

    const [currentEnvironment, setCurrentEnvironment] = useState("STUDIO");
    const [currentColor, setCurrentColor] = useState("NONE");
    const [wireframe, setWireframe] = useState(false);
    const [textureMode, setTextureMode] = useState("textured");
    const [statsData, setStatsData] = useState({
        meshCount: 0,
        matCount: 0,
        trisCount: 0,
        vertsCount: 0,
        texsCount: 0,
    });

    const [sceneAnimationNames, setSceneAnimationNames] = useState([]);

    const [showSidePanel, setShowSidePanel] = useState(true);

    const [selectedMesh, setSelectedMesh] = useState(null);

    function onFileUpload(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setGlbFile(event.target.result);
            setEnableCanvas(true);
        };
        reader.onerror = (error) => {
            disableCanvas();
            enableToast("Error loading file", "error")
            console.error(error);
        }
        reader.readAsDataURL(file);
    }

    function enableToast(toastMessage, toastType) {
        setShowToast(true);
        setToastMessage(toastMessage);
        setToastType(toastType);
    }

    function forceDisableToast() {
        setShowToast(false);
        setToastMessage("");
        setToastType("none");
    }

    function disableCanvas() {
        setLoading(false);
        setGlbFile("");
        setEnableCanvas(false);
        refreshSceneAnimationNames();
    }

    function refreshSceneAnimationNames() {
        const animNames = []
        const mySceneObj = MyScene.getInstanceOfMyScene();
        if(mySceneObj){
            mySceneObj.scene.animationGroups.forEach(anim => {
                animNames.push(anim.name);
            });
        }
        setSceneAnimationNames(animNames);
    }

    const toggleSidePanelVisibility = () => {
        setShowSidePanel(showSidePanel => !showSidePanel);
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
            disableCanvas,
            sceneAnimationNames,
            setSceneAnimationNames,
            refreshSceneAnimationNames,
            currentEnvironment,
            setCurrentEnvironment,
            showSidePanel,
            toggleSidePanelVisibility,
            currentColor,
            setCurrentColor,
            wireframe,
            setWireframe,
            textureMode,
            setTextureMode,
            statsData,
            setStatsData,
            selectedMesh,
            setSelectedMesh,
        }}>
            {children}
        </Context.Provider>
    );
}