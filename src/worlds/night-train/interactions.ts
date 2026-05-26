import type { WorldState, WorldAction } from "../registry";

const initialState: WorldState = {
  lightsFlicker: false,
  trainSpeed: 0.6,
  frostedGlass: false,
};

function applyAction(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case "TOGGLE_LIGHTS_FLICKER":
      return { ...state, lightsFlicker: !state.lightsFlicker };
    case "SET_TRAIN_SPEED":
      return { ...state, trainSpeed: Math.max(0.1, Math.min(1, action.speed)) };
    case "TOGGLE_FROSTED_GLASS":
      return { ...state, frostedGlass: !state.frostedGlass };
    default:
      return state;
  }
}

export const nightTrainInteractions = { initialState, applyAction };
