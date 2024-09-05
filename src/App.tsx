import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import FrameSeeker from './components/frameSeeker/FrameSeeker';
import Navbar from './components/ui/Navbar';
import { useVideoManager } from './hooks';

const header = tv({
    base: 'fixed top-0 z-50 flex w-full items-center justify-end bg-white shadow-xl',
    variants: {
        showFrameSeeker: {
            true: 'justify-between',
        },
    },
});

function App(): JSX.Element {
    const { details, updateDetails } = useVideoManager();
    const location = useLocation();
    const [showFrameSeeker, setShowFrameSeeker] = useState<boolean>(false);

    useEffect(() => {
        setShowFrameSeeker(details.loaded && location.pathname.includes('frames'));
    }, [details, location, updateDetails]);

    return (
        <>
            <header className={header({ showFrameSeeker })}>
                {showFrameSeeker && <FrameSeeker />}
                <Navbar />
            </header>
            <main className="mx-2 flex min-h-[calc(100vh-40px)] flex-col items-center justify-center">
                <Outlet />
            </main>
            <footer className="h-10 w-full text-center">
                <small className="lowercase">
                    Created by{' '}
                    <a href="https://vinicius-goncalves.com" className="font-bold">
                        vinicius-goncalves.com
                    </a>
                    .
                </small>
            </footer>
        </>
    );
}

export default App;
