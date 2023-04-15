import { render, screen } from '@/utils/test-utilts';
import VideoPlayer from './VideoPlayer';

describe('Video Player', () => {
  const src = 'https://www.dofactory.com/media/movie.mp4';

  it('should render a video player', () => {
    render(<VideoPlayer src={src} />);
    expect(
      screen.getByRole('button', {
        name: /play/i,
      }),
    ).toBeInTheDocument();
  });
});
