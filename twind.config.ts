export default {
    darkMode: "class",
    mode: "silent",
    preflight: {
        '@import': "url('https://fonts.googleapis.com/css2?family=Lato&display=swap');"
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
            "code-text-color": "#A0A2A5"
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
            "5.5": "1.375rem",
            "5": "1.25rem",
            "0": "0"
        },
        rotate: {
            "-45": "-45deg",
            "45": "45deg"
        },
        translate: {
            "-2.5": "-15px",
            "2.5": "15px"
        },
        fontFamily: {
            'sans': ["Lato", "sans-serif"],
            'code': ["Roboto Mono", 'monospace']
        },
        extend: {}
    }
}