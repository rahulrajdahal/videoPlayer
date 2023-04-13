import { TrackHTMLAttributes } from 'react';
import useVideoPlayer from './useVideoPlayer';

export interface Props {
  autoPlay?: boolean;
  subtitles?: TrackHTMLAttributes<HTMLTrackElement>[];
  src: string;
}

export interface VideoProps {
  isPlaying: boolean;
  elapsedTime: number;
  loading: boolean;
  volume: number;
  isMuted: boolean;
  isFullScreen: boolean;
}

export default function VideoPlayer({ autoPlay = false, subtitles, src }: Props) {
  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  const {
    playerRef,
    handleFullScreen,
    video,
    setVideo,
    handleMuteOnClick,
    handleOnEnded,
    handleOnTimeUpdate,
    handlePlayPause,
    handlePlaybackRate,
    handlePlayerSeek,
    handlePlayerVolume,
    handleOnLoadedData,
  } = useVideoPlayer({
    options: { autoPlay, src },
  });

  return (
    <div>
      <video
        ref={playerRef}
        controls={video.isFullScreen ? true : false}
        onLoadStart={() => setVideo((prev) => ({ ...prev, loading: true }))}
        autoPlay={autoPlay}
        onEnded={handleOnEnded}
        onTimeUpdate={handleOnTimeUpdate}
        onLoadedData={handleOnLoadedData}
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
