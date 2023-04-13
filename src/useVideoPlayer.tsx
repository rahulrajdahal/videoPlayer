import { ChangeEvent, useRef, useState } from 'react';
import { VideoProps, Props } from './VideoPlayer';

interface IProps {
  options: Props;
}
export default function useVideoPlayer({ options: { autoPlay = false } }: IProps) {
  const playerRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<VideoProps>({
    isPlaying: autoPlay ? true : false,
    elapsedTime: 0,
    loading: false,
    volume: 0,
    isMuted: autoPlay ? true : false,
    isFullScreen: false,
  });

  const player = playerRef.current;
  const handlePause = () => {
    if (player) {
      player.pause();
      setVideo((prev) => ({ ...prev, isPlaying: false }));
    }
  };
  const handlePlay = () => {
    if (player) {
      player.play();
      setVideo((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const handlePlayPause = () => {
    if (video.isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handlePlaybackRate = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    if (player) {
      player.playbackRate = Number(value);
    }
  };

  const handleOnEnded = () => setVideo((prev) => ({ ...prev, isPlaying: false }));

  const handlePlayerSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (player) {
      const updatedTime = (parseInt(value) / 100) * player.duration;
      player.currentTime = updatedTime;
    }
  };

  const handleOnTimeUpdate = () => {
    if (player) {
      const elapsedTime = (player.currentTime / player.duration) * 100;
      setVideo((prev) => ({ ...prev, elapsedTime }));
    }
  };

  const handlePlayerVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (player) {
      const updatedVolume = parseInt(value);
      player.volume = updatedVolume / 100;
      setVideo((prev) => ({ ...prev, volume: updatedVolume }));
    }
  };

  const handleMuteOnClick = () => {
    if (video.isMuted) {
      setVideo((prev) => ({ ...prev, isMuted: false }));
    } else {
      setVideo((prev) => ({ ...prev, isMuted: true }));
    }
  };

  const handleFullScreen = () => {
    if (player) {
      player.requestFullscreen();
      setVideo((prev) => ({ ...prev, isFullScreen: true }));
    }
  };
  const handleOnLoadedData = () => {
    setVideo((prev) => ({ ...prev, isPlaying: autoPlay }));
    setVideo((prev) => ({ ...prev, loading: false }));
    setVideo((prev) => ({ ...prev, volume: 50 }));
  };

  return {
    playerRef,
    video,
    setVideo,
    player,
    handleFullScreen,
    handlePause,
    handleOnLoadedData,
    handlePlay,
    handlePlayPause,
    handlePlaybackRate,
    handleMuteOnClick,
    handlePlayerVolume,
    handleOnTimeUpdate,
    handlePlayerSeek,
    handleOnEnded,
  };
}
