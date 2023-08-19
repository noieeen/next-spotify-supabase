"use client";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import useVolume from "@/hooks/useVolume";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const volume = useVolume();
  // const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekerValue, setSeekerValue] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [playingId, setPlayingId] = useState(0);

  // icons
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume.volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  // next song
  const onPlayNext = () => {
    if (sound) sound.unload();

    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  // previous
  const onPlayPrevious = () => {
    if (sound) sound.unload();
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  // play sound

  const [play, { duration, pause, sound }] = useSound(songUrl, {
    volume: volume.volume,
    onplay: (id: number) => {
      setIsPlaying(true);
      setPlayingId(id);
    },
    onplaying: () => {},
    onpause: () => {
      setIsPlaying(false);
    },
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onseek: () => {},
    format: ["mp3"],
  });

  // play function
  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  // mute control

  const toggleMute = () => {
    if (volume.volume === 0) {
      volume.setVolume(1);
    } else {
      volume.setVolume(0);
    }
  };

  // Seek the audio to the desired position when the user changes the seeker
  const handleSeekerChange = (seekTime: number) => {
    if (!duration) return;
    const seekPosition = (duration * seekTime) / 1000;
    sound.seek(seekPosition);
  };

  const formatTime = (timeInSeconds: number) => {
    const inputSecond = timeInSeconds / 1000;
    const minutes = Math.floor(inputSecond / 60);
    const seconds = Math.floor(inputSecond % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const updateSeekerAndTime = () => {
    let currentTime = 0;
    if (sound && isPlaying && duration) {
      currentTime = sound.seek(playingId);
      setCurrentTime(formatTime(currentTime * 1000));
      setSeekerValue((currentTime / duration) * 1000);
    }
  };

  // Play sound when sound already playing
  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  // Update the audio seeker and time display as the audio plays
  useEffect(() => {
    const interval = setInterval(updateSeekerAndTime, 100);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>
      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
          onClick={handlePlay}
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>
      <div className="hidden md:block h-full text-center w-full max-w-[722px]">
        <div className="w-100 flex justify-center items-center gap-x-6">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>
        <div className="flex justify-center items-center gap-x-3">
          <span className="text-xs">{currentTime}</span>
          <Slider
            value={seekerValue}
            onChange={(current) => handleSeekerChange(current)}
          />
          <span className="text-xs">{formatTime(duration || 0)}</span>
        </div>
      </div>
      <div className="hidden md:flex justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={24}
          />
          <Slider
            value={volume.volume}
            onChange={(value) => volume.setVolume(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
