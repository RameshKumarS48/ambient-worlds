import type { WorldState, WorldAction } from "../registry";
export const rainyTokyoInteractions = {
  initialState: { lampDim: false, rainIntensity: 0.7, windowOpen: false } as WorldState,
  applyAction(state: WorldState, action: WorldAction): WorldState {
    switch (action.type) {
      case "TOGGLE_LAMP":    return { ...state, lampDim: !state.lampDim };
      case "SET_RAIN":       return { ...state, rainIntensity: Math.max(0, Math.min(1, action.intensity)) };
      case "TOGGLE_WINDOW":  return { ...state, windowOpen: !state.windowOpen };
      default: return state;
    }
  },
};
