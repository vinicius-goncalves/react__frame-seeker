import { useCallback, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useBarsManager } from '../../hooks/useBarsManager';
import SeekerMarkIndicator from './SeekerMarkIndicator';

const initialSeekerDetails = {
    posX: 0,
    posY: 0,
    currWidth: 0,
    currFramePos: 0,
    lastClickFramePos: 0,
    showSeeker: false,
};

export type SeekerDetails = typeof initialSeekerDetails;

const frameSeeker = tv({
    slots: {
        container:
            'mx-3 h-1.5 w-full max-w-sm overflow-hidden rounded-md bg-gray-600/15 shadow-2xl transition-all *:transition-all hover:h-3 *:hover:h-3',
    },
});

const { container } = frameSeeker();

function clearMarkedFrame(prevFrame: Element) {
    setTimeout(() => prevFrame.classList.remove('animate-pulse'), 2000);
}

function goToDOMFrame(framePos: number) {
    const frame = document.querySelector(`[data-pos="${framePos}"]`);
    if (!frame) return;

    frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
    frame.classList.add('animate-pulse');
    clearMarkedFrame(frame);
}

function FrameSeeker(): JSX.Element {
    const { frames } = useAppSelector(({ framesSlice }) => framesSlice);
    const [seekerDetails, setSeekerDetails] = useState(initialSeekerDetails);

    const seekerBarRef = useRef<HTMLDivElement | null>(null);
    const seekerRef = useRef<HTMLDivElement | null>(null);

    const { getClickDiffRatioX, updateBar } = useBarsManager(seekerBarRef, seekerRef);

    const updateSeekerDetails = (details: Partial<typeof initialSeekerDetails>) => {
        setSeekerDetails((prevState) => ({ ...prevState, ...details }));
    };

    const calculeFrameIndex = useCallback(
        (ev: React.MouseEvent | MouseEvent) => Math.floor(getClickDiffRatioX(ev) * frames.length),
        [getClickDiffRatioX, frames],
    );

    const handleSeekerPosition = (clickRatioX: number, barContext: HTMLElement) => {
        const posX = clickRatioX * barContext.clientWidth;
        const posY = 22;
        return { posX, posY };
    };

    const updateSeeker = useCallback(
        (ev: React.MouseEvent | MouseEvent) => {
            return updateBar(ev, (clickRatioX, { barContext }) => {
                const { posX, posY } = handleSeekerPosition(clickRatioX, barContext);
                const frameIndex = calculeFrameIndex(ev);
                const currWidth = (frameIndex / frames.length) * 100;

                updateSeekerDetails({ posX: posX + 15, posY, currFramePos: frameIndex, currWidth });
                goToDOMFrame(frameIndex);
            });
        },
        [calculeFrameIndex, updateBar, frames],
    );

    const updateSeekerMarker = (ev: React.MouseEvent | MouseEvent) => {
        return updateBar(ev, (clickRatioX, { barContext }) => {
            const { posX, posY } = handleSeekerPosition(clickRatioX, barContext);
            const frameIndex = calculeFrameIndex(ev);
            updateSeekerDetails({ posX: posX + 15, posY, currFramePos: frameIndex });
        });
    };

    return (
        <div className="relative flex w-full items-center gap-3">
            <div
                className={container()}
                onMouseLeave={() => updateSeekerDetails({ showSeeker: false })}
                onMouseEnter={() => updateSeekerDetails({ showSeeker: true })}
                onMouseMove={updateSeekerMarker}
                onClick={updateSeeker}
                ref={seekerBarRef}
            >
                <div
                    className="h-1.5 w-3 bg-gray-800"
                    style={{ width: `${seekerDetails.currWidth}%` }}
                    ref={seekerRef}
                />
            </div>
            <small>
                {seekerDetails.lastClickFramePos}/{frames.length - 1}
            </small>
            {seekerDetails.showSeeker && <SeekerMarkIndicator seekerDetails={seekerDetails} />}
        </div>
    );
}

export default FrameSeeker;
