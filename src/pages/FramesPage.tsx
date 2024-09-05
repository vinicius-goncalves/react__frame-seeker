import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { IFrame } from '../common/classes/FrameManager';
import Frame from '../components/ui/Frame';
import { useFramesManager, useVideoManager } from '../hooks';
import { useAppSelector } from '../hooks/useAppSelector';

const framesContainer = tv(
    {
        base: 'm-3 flex flex-wrap justify-center gap-3 [&>*]:w-[400px]',
        defaultVariants: {
            size: 'small',
        },
    },
    { responsiveVariants: true },
);

function FramesPages(): JSX.Element {
    const { getVideo, details } = useVideoManager();
    const { frames } = useAppSelector(({ framesSlice }) => framesSlice);
    const navigate = useNavigate();
    useFramesManager();

    useEffect(() => {
        if (!details.loaded) {
            navigate('/load');
        }
    }, [frames, navigate, details, getVideo]);

    return (
        <div className="my-16 overflow-hidden">
            <div className={framesContainer()}>
                {frames.map((frame: IFrame, index: number) => (
                    <Frame
                        frameSrc={frame?.blobUrl as string}
                        frameTime={frame?.currTime}
                        framePos={index}
                        key={frame?.frameId}
                    />
                ))}
            </div>
        </div>
    );
}

export default FramesPages;
