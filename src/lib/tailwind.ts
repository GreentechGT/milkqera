import { create } from 'twrnc';

const tw = create({
    theme: {
        fontFamily: {
            geist: ["Geist-Regular"],
            geistMedium: ["Geist-Medium"],
            geistBold: ["Geist-Bold"],

            // Inter
            inter: ["Inter-Regular"],
            interMedium: ["Inter-Medium"],
            interBold: ["Inter-Bold"],
            interSemiBold: ["Inter-SemiBold"],
            interLight: ["Inter-Light"]
        },
        extend: {
            colors: {
                orange: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                primary: '#0F172A',
                secondary: '#1E293B',
                accent: '#3B82F6',
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            }
        }
    },
});

export default tw;
