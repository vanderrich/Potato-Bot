import { Client, Event } from "../Util/types";
import error from "../Util/error";

module.exports = {
    name: 'error',
    execute: error
} as Event;