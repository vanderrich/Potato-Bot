/** @jsx h */
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
/** @type {Configuration} */
export * from "twind";

export const config: Configuration = {
    darkMode: "class",
    mode: "silent",
    preflight: {
        '@import': "url('https://fonts.googleapis.com/css2?family=Lato&display=swap');"
    },
    theme: {
        colors: {
            "main-color": '#020122',
            "secondary-color": '#dddddd',
            "sweet-brown": '#AC3931',
            "macaroni-and-cheese": '#FFB17A',
            "features-bg": '#ae5a4b',
            "background": '#7F534B',

            "code-bg": '#2F3136',
            "code-text-color": "#A0A2A5"
        },
        fontFamily: {
            'sans': ["Lato", "sans-serif"],
            'code': ["Roboto Mono", 'monospace']
        },
        extend: {}
    }
};
if (IS_BROWSER) setup(config);
