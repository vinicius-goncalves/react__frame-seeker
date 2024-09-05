import { tv } from 'tailwind-variants';

interface Props {
    icon: string;
    className?: string;
}
const googleIcon = tv({
    base: 'material-symbols-outlined',
});

function GoogleIcon({ icon, className }: Props) {
    return <span className={googleIcon({ className })}>{icon}</span>;
}

export default GoogleIcon;
