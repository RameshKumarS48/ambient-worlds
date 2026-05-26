import type { WorldState, WorldAction } from "../registry";
export const spaceshipInteractions = {
  initialState: { lampDim: false, holoActive: true, windowOpen: false } as WorldState,
  applyAction(state: WorldState, action: WorldAction): WorldState {
    switch (action.type) {
      case "TOGGLE_LAMP":   return { ...state, lampDim: !state.lampDim };
      case "TOGGLE_WINDOW": return { ...state, holoActive: !state.holoActive };
      case "TOGGLE_FAN":    return { ...state, windowOpen: !state.windowOpen };
      default: return state;
    }
  },
};
