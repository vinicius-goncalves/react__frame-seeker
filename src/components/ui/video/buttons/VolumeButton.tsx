import { useVideoManager } from '../../../../hooks';
import VideoControlButton from './ControlButton';

function VolumeButton(): JSX.Element {
    const { details, mute } = useVideoManager();
    return <VideoControlButton type={details.isMuted ? 'volume_off' : 'volume_up'} onClick={mute} />;
}

export default VolumeButton;
