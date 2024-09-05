import { tv } from 'tailwind-variants';

interface Props {
    title: string;
    className?: string;
    onClick?: React.HTMLAttributes<HTMLButtonElement>['onClick'];
}

const button = tv({
    base: 'borer-black border bg-black text-white outline-none hover:border hover:border-black hover:bg-white hover:text-black hover:transition-colors',
});

function Button({ title, className, ...props }: Props): JSX.Element {
    return (
        <button className={button({ className })} {...props}>
            {title}
        </button>
    );
}

export default Button;
