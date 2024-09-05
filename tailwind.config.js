/** @type {import('tailwindcss').Config} */

import { defaultConfig } from 'tailwind-variants';
import { withTV } from 'tailwind-variants/dist/transformer.js';

defaultConfig.twMerge = true;

export default withTV({
    content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
    theme: {
        extend: {},
    },
    plugins: [],
});
