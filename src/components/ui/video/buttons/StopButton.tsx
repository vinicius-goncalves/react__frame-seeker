import { useVideoManager } from '../../../../hooks';
import VideoControlButton from './ControlButton';

function StopButton(): JSX.Element {
    const { stop } = useVideoManager();
    return <VideoControlButton type="stop" onClick={stop} className="my-1 text-[1.9rem]" />;
}

export default StopButton;
