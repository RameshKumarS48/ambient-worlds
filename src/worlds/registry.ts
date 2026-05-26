import type { ComponentType } from "react";
import { RainyBedroomScene } from "./rainy-bedroom/Scene";
import { NightTrainScene } from "./night-train/Scene";
import { CozyCafeScene } from "./cozy-cafe/Scene";
import { rainyBedroomAudio } from "./rainy-bedroom/audio";
import { nightTrainAudio } from "./night-train/audio";
import { cozyCafeAudio } from "./cozy-cafe/audio";
import { rainyBedroomInteractions } from "./rainy-bedroom/interactions";
import { nightTrainInteractions } from "./night-train/interactions";
import { cozyCafeInteractions } from "./cozy-cafe/interactions";

export type WorldId = "rainy-bedroom" | "night-train" | "cozy-cafe";

export interface WorldState {
  lampDim?: boolean;
  rainIntensity?: number;
  windowOpen?: boolean;
  lightsFlicker?: boolean;
  trainSpeed?: number;
  frostedGlass?: boolean;
  teaReady?: boolean;
  fanOn?: boolean;
  radioStatic?: number;
}

export type WorldAction =
  | { type: "TOGGLE_LAMP" }
  | { type: "SET_RAIN"; intensity: number }
  | { type: "TOGGLE_WINDOW" }
  | { type: "TOGGLE_LIGHTS_FLICKER" }
  | { type: "SET_TRAIN_SPEED"; speed: number }
  | { type: "TOGGLE_FROSTED_GLASS" }
  | { type: "MAKE_TEA" }
  | { type: "TOGGLE_FAN" }
  | { type: "SET_RADIO_STATIC"; level: number };

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
  "rainy-bedroom": {
    id: "rainy-bedroom",
    title: "Rainy Bedroom",
    subtitle: "Tokyo, 3am",
    bg: "#0d1117",
    accent: "#d4823a",
    Scene: RainyBedroomScene,
    getAudio: rainyBedroomAudio,
    initialState: rainyBedroomInteractions.initialState,
    applyAction: rainyBedroomInteractions.applyAction,
  },
  "night-train": {
    id: "night-train",
    title: "Night Train",
    subtitle: "Somewhere in the snow",
    bg: "#0e0e14",
    accent: "#7ab3d4",
    Scene: NightTrainScene,
    getAudio: nightTrainAudio,
    initialState: nightTrainInteractions.initialState,
    applyAction: nightTrainInteractions.applyAction,
  },
  "cozy-cafe": {
    id: "cozy-cafe",
    title: "Cozy Café",
    subtitle: "Mumbai, monsoon season",
    bg: "#150e06",
    accent: "#d4943a",
    Scene: CozyCafeScene,
    getAudio: cozyCafeAudio,
    initialState: cozyCafeInteractions.initialState,
    applyAction: cozyCafeInteractions.applyAction,
  },
};

export const WORLD_IDS = Object.keys(WORLDS) as WorldId[];
