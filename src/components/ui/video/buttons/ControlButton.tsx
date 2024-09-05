import { tv } from 'tailwind-variants';
import GoogleIcon from '../../../GoogleIcon';

interface Props {
    type: string;
    className?: string;
    onClick?: React.DOMAttributes<HTMLButtonElement>['onClick'];
}

const control = tv({
    base: 'text-2xl hover:cursor-pointer hover:opacity-70',
});

function VideoControlButton({ type, className, onClick }: Props) {
    return (
        <button onClick={onClick}>
            <GoogleIcon className={control({ className })} icon={type} />
        </button>
    );
}
export default VideoControlButton;
