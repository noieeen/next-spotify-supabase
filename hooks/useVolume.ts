import { create } from "zustand";

interface VolumeStore {
  volume: number;
  setVolume: (volume: number) => void;
}

const useVolume = create<VolumeStore>((set) => ({
  volume: 1,
  setVolume: (value: number) => set({ volume: value }),
}));

export default useVolume;
