/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#FFB800',
                'primary-hover': '#E6A700',
                'background-light': '#f8f7f6',
                'background-dark': '#121418',
                'surface-dark': '#1C1F26',
                'card-dark': '#22262E',
                'elevated-dark': '#2A303C',
                'text-main': '#181611',
                'text-secondary': '#887f63',
                'text-body-dark': '#E2E8F0',
                'input-border': '#e5e7eb',
                'input-border-dark': '#2D3748',
                'border-subtle': '#2D3748',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
                body: ['Noto Sans', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}