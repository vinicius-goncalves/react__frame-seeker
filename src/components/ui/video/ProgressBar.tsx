import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
import { useVideoManager } from '../../../hooks';
import { useBarsManager } from '../../../hooks/useBarsManager';

const { margin, container, progress } = tv({
    slots: {
        margin: 'mx-2',
        container: 'h-1 w-full bg-white/15 hover:cursor-pointer',
        progress: 'h-1 w-32 bg-white',
    },
})();

const ProgressBar = memo(() => {
    const { toPercentageDuration, setCurrTime, toSeconds } = useVideoManager();
    const [isMoving, setIsMoving] = useState(false);

    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);

    const { updateBar } = useBarsManager(progressBarRef, progressRef);

    const updateProgressBar = useCallback(
        (ev: React.MouseEvent | MouseEvent) => {
            return updateBar(ev, (clickRatioX) => {
                setCurrTime(toSeconds(clickRatioX));
            });
        },
        [setCurrTime, toSeconds, updateBar],
    );

    const handleStartEvent = () => setIsMoving(true);
    const handleCancelEvent = () => setIsMoving(false);

    useEffect(() => {
        if (!isMoving) {
            document.documentElement.style.setProperty('user-select', 'auto');
            return;
        }

        document.documentElement.style.setProperty('user-select', 'none');

        window.addEventListener('mousemove', updateProgressBar);
        window.addEventListener('mouseup', handleCancelEvent);

        return () => {
            window.removeEventListener('mousemove', updateProgressBar);
            window.removeEventListener('mouseup', handleCancelEvent);
        };
    }, [isMoving, updateProgressBar]);

    return (
        <div
            className={margin()}
            onClick={updateProgressBar}
            onMouseDown={handleStartEvent}
            onMouseUp={handleCancelEvent}
        >
            <div className={container()} ref={progressBarRef}>
                <div
                    className={progress()}
                    style={{ width: `${`${toPercentageDuration()}`}%` }}
                    ref={progressRef}
                ></div>
            </div>
        </div>
    );
});

export default ProgressBar;
