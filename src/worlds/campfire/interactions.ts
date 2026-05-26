import type { WorldState, WorldAction } from "../registry";
export const campfireInteractions = {
  initialState: { fireIntensity: 0.8, fanOn: false, windowOpen: false } as WorldState,
  applyAction(state: WorldState, action: WorldAction): WorldState {
    switch (action.type) {
      case "SET_RAIN":      return { ...state, fireIntensity: Math.max(0.2, Math.min(1, action.intensity)) };
      case "TOGGLE_FAN":    return { ...state, windowOpen: !state.windowOpen }; // reuse as wind toggle
      case "TOGGLE_WINDOW": return { ...state, fanOn: !state.fanOn };
      default: return state;
    }
  },
};
