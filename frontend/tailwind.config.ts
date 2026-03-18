import type { Config } from 'tailwindcss'

export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Fira Code"', '"Roboto Mono"', '"monospace"'],
            },
            colors: {
                terminal: {
                    bg: '#0a0a0a',
                    surface: '#111111',
                    border: '#1f1f1f',
                    green: '#00ff88',
                    red: '#ff3b3b',
                    amber: '#ffb800',
                    text: '#e2e2e2',
                    muted: '#666666',
                }
            }
        },
    },
    plugins: [],
} satisfies Config