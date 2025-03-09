import {FANTASY_TOWN_GENERATOR_ORIGIN, SOCKET_EVENT} from "./constants.js";

export const notifyFTG = (type, data) => {
    const iframeWindow =  $(".fantasy-town-generator-iframe")?.[0]?.contentWindow
    if (iframeWindow?.postMessage) {
        iframeWindow.postMessage(JSON.stringify({type, data}), FANTASY_TOWN_GENERATOR_ORIGIN);
    }
}

export const ClientNotifications = {
    NEW_PLAYER_LOCATION: 'NEW_PLAYER_LOCATION',
    NEW_SETTLEMENT_TIME: 'NEW_SETTLEMENT_TIME',
    BUILDING_UPDATE: 'BUILDING_UPDATE',
    PERSON_UPDATE: 'PERSON_UPDATE',
    PEOPLE_UPDATE: 'PERSON_UPDATE',
    BUILDINGS_UPDATE: 'BUILDINGS_UPDATE',
    PIN_UPDATED: 'PIN_UPDATED',
    PIN_DELETED: 'PIN_DELETED',
}

export const notifyOtherClients = (type, data) => {
    game.socket.emit(SOCKET_EVENT, {type, data});
}
