import type { WorldState, WorldAction } from "../registry";
export const cyberpunkRoomInteractions = {
  initialState: { lampDim: false, rainIntensity: 0.6, holoActive: true, neonOn: true } as WorldState,
  applyAction(state: WorldState, action: WorldAction): WorldState {
    switch (action.type) {
      case "TOGGLE_LAMP":   return { ...state, neonOn: !state.neonOn };
      case "SET_RAIN":      return { ...state, rainIntensity: Math.max(0, Math.min(1, action.intensity)) };
      case "TOGGLE_WINDOW": return { ...state, holoActive: !state.holoActive };
      default: return state;
    }
  },
};
