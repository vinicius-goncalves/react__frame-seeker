import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

function HomePage(): JSX.Element {
    const navigate = useNavigate();

    const navigateToLoadPage = () => navigate('load');

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold lowercase">Frame Seeker</h1>
            <p className="lowercase text-gray-900">
                Seek and extract frames from your video. Load now and try it out.
            </p>
            <div>
                <Button title="Go to load page" className="my-2 p-2" onClick={navigateToLoadPage} />
            </div>
        </div>
    );
}

export default HomePage;
