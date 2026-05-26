import type { WorldState, WorldAction } from "../registry";

const initialState: WorldState = {
  teaReady: false,
  fanOn: true,
  radioStatic: 0.3,
};

function applyAction(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case "MAKE_TEA":
      return { ...state, teaReady: !state.teaReady };
    case "TOGGLE_FAN":
      return { ...state, fanOn: !state.fanOn };
    case "SET_RADIO_STATIC":
      return { ...state, radioStatic: Math.max(0, Math.min(1, action.level)) };
    default:
      return state;
  }
}

export const cozyCafeInteractions = { initialState, applyAction };
