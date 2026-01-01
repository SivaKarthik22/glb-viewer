import { createContext, useReducer, useRef, useState } from "react";
import MyScene from "../classes/MyScene";
import "@babylonjs/loaders/glTF";
import { outlinerReducer } from "./Reducer";

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

    const [hasAnimations, setHasAnimations] = useState(false);

    const [showSidePanel, setShowSidePanel] = useState(true);

    const heirarchyCompRef = useRef(null)
    const [selectedMesh, setSelectedMesh] = useState(null);
    const [enableHighlight, setEnableHighlight] = useState(false);
    const [autoFocus, setAutoFocus] = useState(true);
    const [isolationMode, setIsolationMode] = useState(false);
    const [outlinerStates, dispatchOutlinerActions] = useReducer(outlinerReducer, {});

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
        checkForAnimations();
    }

    function checkForAnimations() {
        const mySceneObj = MyScene.getInstanceOfMyScene();
        if(mySceneObj?.scene?.animationGroups.length ?? 0 > 0)
            setHasAnimations(true);
        else
            setHasAnimations(false);
    }

    const toggleSidePanelVisibility = () => {
        setShowSidePanel(showSidePanel => !showSidePanel);
    }

    function updateSelection(curSelection){
        const mySceneObj = MyScene.getInstanceOfMyScene();
        mySceneObj.updateLayerMasking(mySceneObj.isolationMode, curSelection, mySceneObj.selectedMesh ?? null)
        setSelectedMesh(curSelection);
        mySceneObj.selectedMesh = curSelection;
        mySceneObj.updateMeshHighlight(curSelection);
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
            hasAnimations,
            setHasAnimations,
            checkForAnimations,
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
            enableHighlight,
            setEnableHighlight,
            heirarchyCompRef,
            autoFocus,
            setAutoFocus,
            isolationMode,
            setIsolationMode,
            updateSelection,
            outlinerStates,
            dispatchOutlinerActions,
        }}>
            {children}
        </Context.Provider>
    );
}