import { useState } from 'react';

const initialState = {
    isHovering: false,
};

type TUpdateHoverState = (isHovering: boolean, event: React.SyntheticEvent) => void;

function createHoverProps(fnUpdateHoverState: TUpdateHoverState, isHovering: boolean, props: string[]) {
    const newProps = props.reduce((acc: Record<string, (ev: React.SyntheticEvent) => void>, propKey: string) => {
        acc[propKey] = (ev: React.SyntheticEvent) => fnUpdateHoverState(isHovering, ev);
        return acc;
    }, {});

    return newProps;
}

export function useHover() {
    const [hoverState, setHoverState] = useState<typeof initialState>(initialState);

    const updateHoverState = (isHovering: boolean, event: React.SyntheticEvent | Event) => {
        event.preventDefault();
        setHoverState({ isHovering });
    };

    const createProps = (isHovering: boolean, props: string[]) =>
        createHoverProps(updateHoverState, isHovering, props);

    return { isHovering: hoverState.isHovering, updateHoverState, createProps };
}
