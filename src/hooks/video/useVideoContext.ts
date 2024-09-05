import { useContext } from 'react';
import { VideoContext, VideoContextType } from '../../contexts/VideoContext';

export function useVideoContext() {
    return useContext(VideoContext) as VideoContextType;
}
