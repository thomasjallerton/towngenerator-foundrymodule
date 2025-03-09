import {FANTASY_TOWN_GENERATOR_ORIGIN} from "./constants.js";

// Events triggered by the fantasy town generator iframe
export const FtgEvent = {
    /**
     * A building was clicked.
     * Contains the full building details and the people who are currently there.
     */
    BUILDING: 'BUILDING',
    /**
     * The factions button was clicked.
     * Contains full details of factions, including leaders and members.
     */
    FACTIONS: 'FACTIONS',
    /**
     * The buildings button was clicked.
     * Contains full details of favourite buildings.
     */
    BUILDINGS: 'BUILDINGS',
    /**
     * The people button was clicked.
     * Contains full details of favourite people.
     */
    PEOPLE: 'PEOPLE',
    /**
     * New player location was confirmed.
     * Contains the state id and location building id (nullable).
     */
    NEW_PLAYER_CURRENT_LOCATION: 'NEW_PLAYER_CURRENT_LOCATION',
    /**
     * New settlement time was confirmed.
     * Contains the state id and new time.
     */
    NEW_SETTLEMENT_TIME: 'NEW_SETTLEMENT_TIME',
    /**
     * New building details were confirmed.
     * Contains the state id and updated building details.
     */
    BUILDING_UPDATE: 'BUILDING_UPDATE',
    /**
     * New person details were confirmed.
     * Contains the state id and updated person details.
     */
    PERSON_UPDATE: 'PERSON_UPDATE',
    /**
     * Triggered whenever the mouse is moved on the iframe.
     * Contains the mouse co-ordinates.
     */
    MOUSE_MOVE: 'MOUSE_MOVE',
    /**
     * New people details confirmed (favourites updated).
     * Contains the stateId and the updated people details.
     */
    PEOPLE_UPDATE: 'PEOPLE_UPDATE',
    /**
     * New buildings details confirmed (favourites updated).
     * Contains the stateId and the updated building details.
     */
    BUILDINGS_UPDATE: 'BUILDINGS_UPDATE',
    /**
     * A district was clicked.
     * Contains the full district details.
     */
    DISTRICT: 'DISTRICT',
    /**
     * A pin was clicked.
     * Contains the full pin details.
     */
    PIN: 'PIN',
    /**
     * A public pin was updated.
     * Contains the full pin details.
     */
    PIN_UPDATED: 'PIN_UPDATED',
    /**
     * A public pin was deleted.
     * Contains the pin id.
     */
    PIN_DELETED: 'PIN_DELETED',
}

/** Tracks all active listeners, to ensure that a listener for a dialog is only created once */
const allListeners = {};

const createListenerId = (type, id) => `${type}-${id}`;

export const listenForUpdates = (type, id, callback) => {
    stopListening(type, id);

    const listener = event => {
        if (event.origin === FANTASY_TOWN_GENERATOR_ORIGIN) {
            const parsedData = JSON.parse(event.data)
            if (parsedData.type === type) {
                callback(parsedData.data);
            }
        }
    }

    allListeners[createListenerId(type, id)] = listener;
    window.addEventListener("message", listener);
}

export const stopListening = (type, id) => {
    const listener = allListeners[createListenerId(type, id)];
    if (listener) {
        window.removeEventListener("message", listener);
    }
}
