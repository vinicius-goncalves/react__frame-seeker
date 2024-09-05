import { forwardRef } from 'react';
import { tv } from 'tailwind-variants';

interface Props {
    isHovering?: boolean;
    onClick?: React.HTMLAttributes<HTMLDivElement>['onClick'];
}

const container = tv({
    base: 'group my-2 grid h-64 w-full max-w-xl cursor-pointer select-none place-content-center rounded-md border border-black text-center shadow-lg',
    variants: {
        isHovering: {
            true: 'bg-black transition-colors *:text-white [&_p]:text-gray-300',
            false: 'bg-white text-black transition-colors',
        },
    },
});

const LoadVideoContainer = forwardRef<HTMLInputElement, Props>(({ onClick, isHovering, ...props }, ref) => {
    return (
        <div className={container({ isHovering })} onClick={onClick} {...props}>
            <span className="material-symbols-outlined text-6xl">description</span>
            <h2 className="text-2xl font-bold">Load a video</h2>
            <p className="text-gray-500">Or just drag and drop it here</p>
            <input type="file" className="hidden" ref={ref} />
        </div>
    );
});

export default LoadVideoContainer;
