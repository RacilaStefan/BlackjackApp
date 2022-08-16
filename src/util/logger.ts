export default class Logger {
    locationName: string;

    constructor(locationName : string) {
        this.locationName = locationName;
    }

    error(text : string) {
        let output = `${getTime()} ${LOG_TYPES.ERROR} [%c${this.locationName}%c] ${text}`;
        console.log(output, "color:#f51e0f", "", "color:#9997fc", "");
    }

    // apiError(err) { // from axios docs
    //     if (err.response) {
    //         The request was made and the server responded with a status code
    //         that falls out of the range of 2xx
    //         let output = `${getTime()} ${LOG_TYPES.ERROR} [%c${this.locationName}%c]`;
    //         output += ` Request [${err.config.method.toString().toUpperCase()}] ${err.config.baseURL}${err.config.url}`;
    //         output += ` failed with status code ${err.response.status}`;

    //         console.log(output, "color:#f51e0f", "", "color:#9997fc", "");
    //         console.log(`Message "${err.response.data.error}"`);
    //     } else if (err.request) {
    //         The request was made but no response was received
    //         `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //         http.ClientRequest in node.js
    //         this.error(err.request);
    //     } else {
    //         Something happened in setting up the request that triggered an Error
    //         this.error(err.message);
    //     }
    // }

    info(text : string) {
        let output = `${getTime()} ${LOG_TYPES.INFO} [%c${this.locationName}%c] ${text}`;
        console.log(output, "color:#02f20a", "", "color:#9997fc", "");
    }

    debug(name : string, text : LoggerInput) {
        let output = `${getTime()} ${LOG_TYPES.DEBUG} [%c${this.locationName}%c] ${name}= `;
        console.log(output, "color:yellow", "", "color:#9997fc", "");
        console.log(text);
    }
}

export const LOG_TYPES = {
    INFO: "[%cINFO%c]",
    DEBUG: "[%cDEBUG%c]",
    ERROR: "[%cERROR%c]",
};

function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

new Logger('Logger').info('Loaded');

type LoggerInput = object | boolean | string | number | undefined | null;