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
                primary: '#e8ba30',
                'primary-hover': '#d9ae2b',
                'background-light': '#f8f7f6',
                'background-dark': '#1a1a1e',
                'surface-dark': '#212126',
                'card-dark': '#2c2c33',
                'elevated-dark': '#38383f',
                'text-main': '#181611',
                'text-secondary': '#887f63',
                'input-border': '#e5e7eb',
                'input-border-dark': '#3e3e46',
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