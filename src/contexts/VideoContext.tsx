import { createContext, PropsWithChildren, useRef, useState } from 'react';

export interface VideoDetailsProps {
    loaded: boolean;
    isPlaying: boolean;
    isMuted: boolean;
    currTime: number;
    duration: number;

    url: string;
}

export interface VideoContextType {
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    _details: VideoDetailsProps;

    _updateDetails: (details: VideoDetailsProps | ((details: VideoDetailsProps) => VideoDetailsProps)) => void;
}

export const VideoContext = createContext<VideoContextType>({} as VideoContextType);

export function VideoContextProvider({ children }: PropsWithChildren) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [_details, _setDetails] = useState<VideoDetailsProps>({
        currTime: 0,
        loaded: false,
    } as VideoDetailsProps);

    const _updateDetails = ((details: VideoDetailsProps) => {
        _setDetails(details);
    }) as typeof _setDetails;

    return (
        <VideoContext.Provider value={{ videoRef, _details, _updateDetails }}>{children}</VideoContext.Provider>
    );
}
