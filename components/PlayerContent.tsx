"use client";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [seekerValue, setSeekerValue] = useState(0);
  // const [currentTime, setCurrentTime] = useState('00:00');
  // icons
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  // next song
  const onPlayNext = () => {
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

  const [play, { duration, pause, sound, ['seek']}] = useSound(songUrl, {
    volume: volume,
    onplay: () => {
      setIsPlaying(true);
      console.log('onplaying duration', sound._duration,);


    }, onplaying: () => {

    },
    onpause: () => {
      setIsPlaying(false);
    },
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onseek: () => {
      console.log("seekkkkkkkkkkk");
    },
    format: ["mp3"],
  });

  // play function
  const handlePlay = () => {
    if (!isPlaying) {
      play();
      console.log(sound._sounds[0]._seek);
    } else {
      pause();
    }
  };

  // mute control

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  // seek
  const handleSeekerChange = (seekTime: number) => {
    // Seek the audio to the desired position when the user changes the seeker
    const seekPosition = sound.duration() * (seekTime / 100);
    sound.seek(seekPosition);
    // setCurrentTime(formatTime(seekPosition));
  };

  const updateSeekerAndTime = () => {
    // Update the seeker position and time display as the audio plays
    console.log('seek realtime', sound._sounds[0]._seek);

    // const currentTimeInSeconds = sound._sounds[0]._seek || 0;
    // setSeekerValue((currentTimeInSeconds / sound.duration()) * 100);
    // setCurrentTime(formatTime(currentTimeInSeconds));
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // useEffect(() => {
  //   // Update the audio seeker and time display as the audio plays
  //   const interval = setInterval(updateSeekerAndTime, 100);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

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
          {/* <span className="text-xs">{currentTime}</span> */}
          {/* <Slider value={seekerValue} onChange={(current) => handleSeekerChange(current)} /> */}
          <span className="text-xs">{'99:99' /*formatTime(sound.duration())*/}</span>
        </div>
      </div>
      <div className="hidden md:flex justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={24}
          />
          <Slider value={volume} onChange={(volume) => setVolume(volume)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
