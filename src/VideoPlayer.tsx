import { ChangeEvent, TrackHTMLAttributes, useRef, useState } from 'react';

interface Props {
  autoPlay?: boolean;
  subtitles?: TrackHTMLAttributes<HTMLTrackElement>[];
  src: string;
}

interface VideoProps {
  isPlaying: boolean;
  elapsedTime: number;
  loading: boolean;
  volume: number;
  isMuted: boolean;
  isFullScreen: boolean;
}

export default function VideoPlayer({ autoPlay = false, subtitles, src }: Props) {
  const playerRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<VideoProps>({
    isPlaying: autoPlay ? true : false,
    elapsedTime: 0,
    loading: false,
    volume: 0,
    isMuted: autoPlay ? true : false,
    isFullScreen: false,
  });
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

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

  return (
    <div>
      <video
        ref={playerRef}
        controls={video.isFullScreen ? true : false}
        onLoadStart={() => setVideo((prev) => ({ ...prev, loading: true }))}
        autoPlay={autoPlay}
        onEnded={handleOnEnded}
        onTimeUpdate={handleOnTimeUpdate}
        onLoadedData={() => {
          setVideo((prev) => ({ ...prev, isPlaying: autoPlay }));
          setVideo((prev) => ({ ...prev, loading: false }));
          setVideo((prev) => ({ ...prev, volume: 50 }));
        }}
        muted={video.isMuted}
      >
        <source src={src} />
        {subtitles && subtitles.length > 0 ? (
          subtitles.map(({ src, srcLang, ...props }, i) => (
            <track key={i} kind='captions' src={src} srcLang={srcLang} {...props} />
          ))
        ) : (
          <track kind='captions' />
        )}
        <track kind='captions' />
      </video>

      {video.loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <button onClick={handlePlayPause}>{video.isPlaying ? 'Pause' : 'Play'}</button>
          <select defaultValue={1} name='' id='' onChange={handlePlaybackRate}>
            {playbackRates.map((playbackRate) => (
              <option key={playbackRate} value={playbackRate}>
                {playbackRate}
              </option>
            ))}
          </select>

          <div>
            <label htmlFor='seek'>Seek</label>
            <input
              type='range'
              min={0}
              max={100}
              value={video.elapsedTime}
              onChange={handlePlayerSeek}
            />
          </div>
          <div>
            <label htmlFor='volume'>Volume</label>
            <input
              type='range'
              min={0}
              max={100}
              value={video.volume}
              onChange={handlePlayerVolume}
            />
          </div>
          <button onClick={handleMuteOnClick}>{video.isMuted ? 'UnMute' : 'Mute'}</button>
          <button onClick={handleFullScreen}>fullScreen</button>
        </>
      )}
    </div>
  );
}
