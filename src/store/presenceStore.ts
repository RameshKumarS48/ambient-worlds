import { create } from "zustand";

export interface Peer {
  id: string;
  color: string;
}

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface PresenceState {
  peers: Peer[];
  status: ConnectionStatus;
  setPeers: (peers: Peer[]) => void;
  setStatus: (status: ConnectionStatus) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  peers: [],
  status: "disconnected",
  setPeers: (peers) => set({ peers }),
  setStatus: (status) => set({ status }),
}));
