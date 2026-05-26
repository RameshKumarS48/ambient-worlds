import type { WorldState, WorldAction } from "../registry";
export const quietLibraryInteractions = {
  initialState: { lampDim: false, windowOpen: false, clockTicking: true } as WorldState,
  applyAction(state: WorldState, action: WorldAction): WorldState {
    switch (action.type) {
      case "TOGGLE_LAMP":   return { ...state, lampDim: !state.lampDim };
      case "TOGGLE_WINDOW": return { ...state, windowOpen: !state.windowOpen };
      default: return state;
    }
  },
};
