import type { ComponentType } from "react";
import { RainyTokyoScene } from "./rainy-tokyo/Scene";
import { NightTrainScene } from "./night-train/Scene";
import { QuietLibraryScene } from "./quiet-library/Scene";
import { CyberpunkRoomScene } from "./cyberpunk-room/Scene";
import { CampfireScene } from "./campfire/Scene";
import { SpaceshipScene } from "./spaceship/Scene";
import { rainyTokyoAudio } from "./rainy-tokyo/audio";
import { nightTrainAudio } from "./night-train/audio";
import { quietLibraryAudio } from "./quiet-library/audio";
import { cyberpunkRoomAudio } from "./cyberpunk-room/audio";
import { campfireAudio } from "./campfire/audio";
import { spaceshipAudio } from "./spaceship/audio";
import { rainyTokyoInteractions } from "./rainy-tokyo/interactions";
import { nightTrainInteractions } from "./night-train/interactions";
import { quietLibraryInteractions } from "./quiet-library/interactions";
import { cyberpunkRoomInteractions } from "./cyberpunk-room/interactions";
import { campfireInteractions } from "./campfire/interactions";
import { spaceshipInteractions } from "./spaceship/interactions";

export type WorldId =
  | "rainy-tokyo"
  | "night-train"
  | "quiet-library"
  | "cyberpunk-room"
  | "campfire"
  | "spaceship";

export interface WorldState {
  // rainy-tokyo
  lampDim?: boolean;
  rainIntensity?: number;
  windowOpen?: boolean;
  // night-train
  lightsFlicker?: boolean;
  trainSpeed?: number;
  frostedGlass?: boolean;
  // quiet-library
  clockTicking?: boolean;
  // cyberpunk-room
  holoActive?: boolean;
  neonOn?: boolean;
  // campfire
  fireIntensity?: number;
  fanOn?: boolean;
}

export type WorldAction =
  | { type: "TOGGLE_LAMP" }
  | { type: "SET_RAIN"; intensity: number }
  | { type: "TOGGLE_WINDOW" }
  | { type: "TOGGLE_LIGHTS_FLICKER" }
  | { type: "SET_TRAIN_SPEED"; speed: number }
  | { type: "TOGGLE_FROSTED_GLASS" }
  | { type: "TOGGLE_FAN" };

export interface SceneProps {
  state: WorldState;
  onInteract: (action: WorldAction) => void;
}

export interface WorldAudioEngine {
  start(ctx: AudioContext): void;
  stop(): void;
  setParam(key: string, value: number | boolean): void;
}

export interface WorldMeta {
  id: WorldId;
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
  Scene: ComponentType<SceneProps>;
  getAudio: () => WorldAudioEngine;
  initialState: WorldState;
  applyAction: (state: WorldState, action: WorldAction) => WorldState;
}

export const WORLDS: Record<WorldId, WorldMeta> = {
  "rainy-tokyo": {
    id: "rainy-tokyo",
    title: "Rainy Tokyo",
    subtitle: "3am, tatami room",
    bg: "#0d1117",
    accent: "#d4823a",
    Scene: RainyTokyoScene,
    getAudio: rainyTokyoAudio,
    initialState: rainyTokyoInteractions.initialState,
    applyAction: rainyTokyoInteractions.applyAction,
  },
  "night-train": {
    id: "night-train",
    title: "Night Train",
    subtitle: "somewhere in the snow",
    bg: "#0e0e14",
    accent: "#7ab3d4",
    Scene: NightTrainScene,
    getAudio: nightTrainAudio,
    initialState: nightTrainInteractions.initialState,
    applyAction: nightTrainInteractions.applyAction,
  },
  "quiet-library": {
    id: "quiet-library",
    title: "Quiet Library",
    subtitle: "late afternoon, gothic reading room",
    bg: "#0f0b07",
    accent: "#c8a96a",
    Scene: QuietLibraryScene,
    getAudio: quietLibraryAudio,
    initialState: quietLibraryInteractions.initialState,
    applyAction: quietLibraryInteractions.applyAction,
  },
  "cyberpunk-room": {
    id: "cyberpunk-room",
    title: "Cyberpunk Room",
    subtitle: "neon-drenched desk, rain outside",
    bg: "#060810",
    accent: "#00c8ff",
    Scene: CyberpunkRoomScene,
    getAudio: cyberpunkRoomAudio,
    initialState: cyberpunkRoomInteractions.initialState,
    applyAction: cyberpunkRoomInteractions.applyAction,
  },
  "campfire": {
    id: "campfire",
    title: "Campfire",
    subtitle: "deep forest, midnight",
    bg: "#0a0500",
    accent: "#e8823a",
    Scene: CampfireScene,
    getAudio: campfireAudio,
    initialState: campfireInteractions.initialState,
    applyAction: campfireInteractions.applyAction,
  },
  "spaceship": {
    id: "spaceship",
    title: "Spaceship",
    subtitle: "deep space, quiet drift",
    bg: "#030509",
    accent: "#00c8b4",
    Scene: SpaceshipScene,
    getAudio: spaceshipAudio,
    initialState: spaceshipInteractions.initialState,
    applyAction: spaceshipInteractions.applyAction,
  },
};

export const WORLD_IDS = Object.keys(WORLDS) as WorldId[];
