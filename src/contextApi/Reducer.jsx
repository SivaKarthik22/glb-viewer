import { produce } from "immer";

export function outlinerReducer(state, action){
    switch (action.type){
        case "initialise_state":{
            const newState = {};
            const container = action.payload;
            container.meshes.forEach(mesh => {
                newState[mesh.uniqueId] = {
                    unfolded : true,
                    showDetails : false,
                    nodeState : mesh.isEnabled(false),
                }
            });
            container.transformNodes.forEach(node => {
                newState[node.uniqueId] = {
                    unfolded : true,
                    showDetails : false,
                    nodeState : node.isEnabled(false),
                }
            });
            return newState;
        }
        case "toggle_fold_unfold":{
            return produce(state, draft => {
                draft[action.payload].unfolded = !draft[action.payload].unfolded;
            });
        }
        case "toggle_show_hide_details":{
            return produce(state, draft => {
                draft[action.payload].showDetails = !draft[action.payload].showDetails;
            });
        }
        case "toggle_show_hide_node":{
            return produce(state, draft => {
                draft[action.payload].nodeState = !draft[action.payload].nodeState;
            });
        }
        case "show_all_nodes":{
            return produce(state, draft => {
                Object.keys(draft).forEach(key => {
                    draft[key].nodeState = true;
                });
            });
        }
        case "reset_state":{
            return {};
        }
        default:
            return state;
    }
}