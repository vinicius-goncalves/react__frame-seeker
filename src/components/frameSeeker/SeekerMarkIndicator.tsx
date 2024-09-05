import { SeekerDetails } from './FrameSeeker';

type Props = {
    seekerDetails: SeekerDetails;
};

function SeekerMarkIndicator({ seekerDetails }: Props): JSX.Element {
    const { posX, posY, currFramePos } = seekerDetails;

    const style = {
        left: `${posX}px`,
        top: `${posY}px`,
    };

    return (
        <div className="absolute rounded-md border border-gray-300 bg-white px-2 shadow-2xl" style={style}>
            <span>{currFramePos}</span>
        </div>
    );
}

export default SeekerMarkIndicator;
