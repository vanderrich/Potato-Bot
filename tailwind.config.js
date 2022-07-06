/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            "macaroni-and-cheese": '#FFB17A',
            "black-russian": '#020122',
            "sweet-brown": '#AC3931',
            "alto": '#dddddd',
            "code-bg": '#2F3136',
            "features-bg": '#ae5a4b',
            "home-bg": '#020122',
        },
        extend: {
            spacing: {
            }
        },
    },
    plugins: [],
}
