import type { WorldState, WorldAction } from "../registry";

const initialState: WorldState = {
  lampDim: false,
  rainIntensity: 0.6,
  windowOpen: false,
};

function applyAction(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case "TOGGLE_LAMP":
      return { ...state, lampDim: !state.lampDim };
    case "SET_RAIN":
      return { ...state, rainIntensity: Math.max(0, Math.min(1, action.intensity)) };
    case "TOGGLE_WINDOW":
      return { ...state, windowOpen: !state.windowOpen };
    default:
      return state;
  }
}

export const rainyBedroomInteractions = { initialState, applyAction };
