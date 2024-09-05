import { MutableRefObject, useCallback } from 'react';

type RefElement = MutableRefObject<HTMLElement | null>;
type MouseEvt = React.MouseEvent | MouseEvent;

export function useBarsManager(barContainer: RefElement, barContent: RefElement) {
    const handleBars = useCallback(
        (callback: (barContainer: HTMLElement) => unknown) => {
            if (barContainer && barContent) return callback(barContainer.current!);
        },
        [barContainer, barContent],
    );

    const getClickPosX = useCallback(
        (ev: MouseEvt) => {
            return handleBars((barContainer) => {
                const rect = barContainer.getBoundingClientRect();
                const posX = ev.pageX - rect.left;
                return posX;
            }) as number;
        },
        [handleBars],
    );

    const getBar = useCallback(() => {
        return handleBars((barContainer: HTMLElement) => barContainer) as HTMLElement;
    }, [handleBars]);

    const getClickDiffRatioX = useCallback(
        (ev: MouseEvt) => {
            const bar = getBar();
            const posX = getClickPosX(ev);
            return posX / bar.clientWidth;
        },
        [getBar, getClickPosX],
    );

    const updateBar = (
        ev: MouseEvt,
        updateFunc: (clickRatioX: number, { barContext }: { barContext: HTMLElement }) => unknown,
    ) => {
        const clickRatioX = getClickDiffRatioX(ev);
        updateFunc(clickRatioX, { barContext: barContainer.current as HTMLElement });
    };

    return { getClickPosX, getClickDiffRatioX, updateBar, getBar };
}
