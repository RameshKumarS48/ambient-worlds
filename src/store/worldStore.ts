import { create } from "zustand";
import type { WorldState, WorldAction } from "@/worlds/registry";

interface WorldStoreState {
  worldState: WorldState;
  applyLocalAction: (action: WorldAction, reducer: (s: WorldState, a: WorldAction) => WorldState) => void;
  receiveServerState: (state: WorldState) => void;
  resetState: (initial: WorldState) => void;
}

export const useWorldStore = create<WorldStoreState>((set) => ({
  worldState: {},
  applyLocalAction: (action, reducer) =>
    set((s) => ({ worldState: reducer(s.worldState, action) })),
  receiveServerState: (state) => set({ worldState: state }),
  resetState: (initial) => set({ worldState: initial }),
}));
