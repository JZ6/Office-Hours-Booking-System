import storage from "./storage";

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
        if(storage.loggedIn){
            return new Promise((resolve, reject) => {
                //TODO
            })
        }else{
            console.log('Not logged in!')
        }
    },

    login: creditials => {
        // save token to local or session storage
        // return APIFunctions.makeAPICall("Get", creditials);
    },

    getSchedule: token => {
        // save to storage.
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