import { tv } from 'tailwind-variants';

interface Props {
    frameTime: string;
    frameSrc: string;
    framePos: number;
}

const frame = tv({
    slots: {
        container: 'overflow-hidden text-center hover:scale-[1.03] hover:cursor-pointer hover:transition',
        img: 'rounded-md shadow-xl',
    },
});

const { container, img } = frame();

function Frame({ frameTime, frameSrc, framePos }: Props): JSX.Element {
    return (
        <figure className={container()} data-pos={framePos}>
            <img src={frameSrc} className={img()} width={400} />
            <figcaption>
                {frameTime} / #{framePos}
            </figcaption>
        </figure>
    );
}

export default Frame;
