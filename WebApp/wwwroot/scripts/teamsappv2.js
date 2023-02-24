//import { app, pages } from 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

(function () {

    window.alert('function!');
    await app.initialize();
    window.alert('import!');
    /*


    let saveConfig = () => {
        pages.config.registerOnSaveHandler((saveEvent) => {
            const configPromise = pages.config.setConfig({
                websiteUrl: setTabUrl(),
                contentUrl: setTabUrl(),
                entityId: "entityId",
                suggestedDisplayName: "suggestedDisplayName"
            });
            configPromise.
                then((result) => { saveEvent.notifySuccess() }).
                catch((error) => { saveEvent.notifyFailure("failure message") });
        });
    }

    let setTabUrl = () => {
        return window.location.protocol + '//' + window.location.host + '/labresults';
    }

    pages.config.setValidityState(true);
    saveConfig();
    */

})();