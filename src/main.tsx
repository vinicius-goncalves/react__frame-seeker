import './assets/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { VideoContextProvider } from './contexts/VideoContext';
import FramesPages from './pages/FramesPage';
import HomePage from './pages/HomePage';
import PreloadPage from './pages/PreloadPage';
import store from './services/store';

const router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        children: [
            { element: <HomePage key={1} />, index: true },
            { path: 'load', element: <PreloadPage key={2} /> },
            { path: 'frames', element: <FramesPages key={3} /> },
        ],
    },
]);

const children = (
    <React.StrictMode>
        <Provider store={store}>
            <VideoContextProvider>
                <RouterProvider router={router} />
            </VideoContextProvider>
        </Provider>
    </React.StrictMode>
);

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(children);
