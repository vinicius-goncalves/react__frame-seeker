import { useEffect, useRef } from 'react';
import LoadVideoContainer from '../components/LoadVideoContainer';
import Video from '../components/ui/video/Video';
import { useAppDispatch, useVideoManager } from '../hooks';
import { useHover } from '../hooks/useHover';
import { framesActions } from '../services/slices/framesSlice';

function PreloadPage(): JSX.Element {
    const { togglePlay, details, updateDetails } = useVideoManager();
    const { isHovering, createProps } = useHover();
    const dispatch = useAppDispatch();

    const fileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!details.loaded) return;

        const handleTogglePlay = (ev: KeyboardEvent) => {
            if (ev.code === 'Space') {
                togglePlay();
                ev.preventDefault();
            }
        };

        window.addEventListener('keydown', handleTogglePlay);

        return () => {
            window.removeEventListener('keydown', handleTogglePlay);
        };
    }, [togglePlay, details]);

    useEffect(() => {
        const file = fileRef.current;

        if (!file) return;

        const handleFileSelect = (event: Event) => {
            const inputTarget = event.target as HTMLInputElement;

            if (!(inputTarget.files instanceof FileList)) {
                return;
            }

            const video = inputTarget.files.item(0) as File;

            updateDetails((prevDetails) => ({
                ...prevDetails,
                loaded: true,
                url: URL.createObjectURL(video),
            }));
        };

        dispatch(framesActions.setStatus({ isVideoLoaded: true }));

        file.addEventListener('change', handleFileSelect);

        return () => {
            file.removeEventListener('change', handleFileSelect);
        };
    }, [updateDetails, details, dispatch]);

    const openFileSelection = () => {
        if (fileRef.current) fileRef.current.click();
    };

    const props = {
        ...createProps(false, ['onDrop', 'onMouseLeave']),
        ...createProps(true, ['onDragEnter', 'onMouseEnter', 'onMouseMove', 'onDragOver']),
        ref: fileRef,
        isHovering,
    };

    return (
        <>
            {!details.loaded && <LoadVideoContainer onClick={openFileSelection} {...props} />}
            {details.loaded && <Video src={details.url} />}
        </>
    );
}

export default PreloadPage;
