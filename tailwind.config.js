module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}', // Inclua todos os arquivos na pasta src
        './public/**/*.html',         // Inclua arquivos HTML na pasta public
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1D4ED8', // Azul principal
                    light: '#3B82F6',
                    dark: '#1E40AF',
                },
                secondary: {
                    DEFAULT: '#64748B', // Cinza neutro
                    light: '#94A3B8',
                    dark: '#475569',
                },
                danger: {
                    DEFAULT: '#DC2626', // Vermelho para erros
                    light: '#F87171',
                    dark: '#991B1B',
                },
                gray: {
                    50: '#F9FAFB', // Certifique-se de que gray-50 está definido
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Arial', 'sans-serif'], // Adicione fontes personalizadas
            },
            borderRadius: {
                DEFAULT: '0.5rem', // Raio padrão para bordas
            },
            boxShadow: {
                card: '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra padrão para cartões
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'), // Adicione o plugin para formulários
    ],
};