import { NavLink, NavLinkProps } from 'react-router-dom';
import { tv, VariantProps } from 'tailwind-variants';
import { useVideoManager } from '../../hooks';

const links = tv({
    base: 'z-50 m-2 flex justify-end gap-6',
});

const navlink = tv({
    base: 'lowercase',
    variants: {
        isActive: {
            true: 'font-medium',
        },
        disabled: {
            true: 'cursor-not-allowed opacity-25',
        },
    },
});

const CustomNavLink = ({ disabled, ...props }: NavLinkProps & VariantProps<typeof navlink>) => {
    return (
        <li>
            <NavLink
                {...props}
                className={({ isActive }) => navlink({ isActive, disabled })}
                onClick={(ev) => (disabled ? ev.preventDefault() : null)}
            />
        </li>
    );
};

function Navbar(): JSX.Element {
    const { details } = useVideoManager();

    return (
        <nav className="bg-white p-1">
            <ul className={links()}>
                <CustomNavLink to="/">Home</CustomNavLink>
                <CustomNavLink to="/load">Load</CustomNavLink>
                <CustomNavLink to="/frames" disabled={!details.loaded}>
                    Frames
                </CustomNavLink>
            </ul>
        </nav>
    );
}

export default Navbar;
