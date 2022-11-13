/** @jsx h */
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
import tconfig from "tailwind-config"
/** @type {Configuration} */
export * from "twind";

export const config = tconfig as Configuration;
if (IS_BROWSER) setup(config);