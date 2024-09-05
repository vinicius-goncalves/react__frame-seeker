import { useVideoManager } from '../../../hooks';

function toFixed2(value: string | number) {
    return Number(value).toFixed(2);
}

function Details(): JSX.Element {
    const { details, toPercentageDuration } = useVideoManager();

    return (
        <div className="-my-2 flex gap-1 bg-transparent text-[.75rem] text-gray-500/80">
            <p>volume: {details.isMuted ? <span className="text-red-500">muted</span> : <span>100</span>};</p>
            <p>total duration: {toFixed2(details.duration)}s; </p>
            <p>curr time: {toFixed2(details.currTime)}s;</p>
            <p>watched percentage: {toPercentageDuration()}/100;</p>
        </div>
    );
}

export default Details;
