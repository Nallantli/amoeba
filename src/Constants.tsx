import buttonSoundFile from "./audio/button.wav";
import loseSoundFile from "./audio/lose.wav";
import startSoundFile from "./audio/start.ogg";
import winSoundFile from "./audio/win.wav";

export const serverUrl = "wss://amoeba.nallant.li:443";

export const startAudio = new Audio(startSoundFile);
export const buttonAudio = new Audio(buttonSoundFile);
export const winSoundAudio = new Audio(winSoundFile);
export const loseSoundAudio = new Audio(loseSoundFile);
