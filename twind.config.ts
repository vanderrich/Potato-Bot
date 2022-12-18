export default {
    darkMode: "class",
    mode: "silent",
    preflight: {
        '@import': "url('https://fonts.googleapis.com/css2?family=Lato&display=swap');",
    },
    theme: {
        colors: {
            "main-color": '#020122',
            "secondary-color": '#dddddd',
            "background": '#7F534B',
            "sweet-brown": '#AC3931',
            "macaroni-and-cheese": '#FFB17A',
            "features-bg": '#ae5a4b',

            "code-bg": '#2F3136',
            "code-text-color": "#A0A2A5",

            "green": "#00FF00",
            "yellow": "FFFF00",
            "red": "FF0000"
        },
        fontSize: {
            "1xl": ["1rem", "1.5"],
            "2xl": ["1.5rem", "2rem"],
            "3xl": ["1.875rem", "2.25rem"],
            "4xl": ["2.25rem", "2.5rem"],
            "5xl": ["3rem", "1"],
            "6xl": ["3.75rem", "1"],
            "7xl": ["4.5rem", "1"],
            "8xl": ["6rem", "1"],
            "9xl": ["8rem", "1"]
        },
        inset: {
            "50": "10rem",
            "12": "4rem",
            "5.5": "1.375rem",
            "5": "1.25rem",
            "4.5": "1.075rem",
            "0": "0"
        },
        fontFamily: {
            'sans': ["Lato", "sans-serif"],
            'code': ["Roboto Mono", 'monospace']
        },
        extend: {}
    }
}
