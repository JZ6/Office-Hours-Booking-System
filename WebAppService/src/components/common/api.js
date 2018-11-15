import storage from "../storage";

const APIFunctions = {

    config: {
        host: null,
        port: null,
        creditials: { userName: null, passWord: null },
        token: null
    },

    waitingOnAPICallResolve: false,

    currentCall: {},

    // getAPI: () => {
    // 	return api;
    // },

    makeAPICall: (call, parameters) => {
        return new Promise((resolve, reject) => {
            //TODO
        })
    },

    login: creditials => {
        // return APIFunctions.makeAPICall("Get", creditials);
    },

    getSchedule: token => {

        // return APIFunctions.makeAPICall("Get", parameters);
    },

    multiCall: () => {

        // let apiPromises = [APIFunctions.makeAPICall("Get", creditials)];

        // return Promise.all(apiPromises);

    },

    resetAPIFunctions: () => {
        this.waitingOnAPICallResolve = false;
        this.config = {
            host: null,
            port: null,
            creditials: { userName: null, passWord: null },
            token: null
        }
    }
}

export default APIFunctions;