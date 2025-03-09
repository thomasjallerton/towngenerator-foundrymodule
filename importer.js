import {renderSidebarTab} from "./src/renderSidebarTab.js";
import {canvasInit, canvasTearDown} from "./src/canvas.js";
import {notifyBuilding} from "./src/BuildingDialog.js";
import {notifyFactions} from "./src/FactionsDialog.js";
import {notifyBuildings} from "./src/BuildingsDialog.js";
import {notifyPeople} from "./src/PeopleDialog.js";
import {FANTASY_TOWN_GENERATOR_ORIGIN, SOCKET_EVENT} from "./src/constants.js";
import {ClientNotifications, notifyFTG, notifyOtherClients} from "./src/notifier.js";
import {FtgEvent} from "./src/listener.js";
import {notifyDistrict} from "./src/DistrictDialog.js";

Hooks.on("renderSidebarTab", renderSidebarTab);
Hooks.on("canvasInit", canvasInit);
Hooks.on("canvasTearDown", canvasTearDown);

Hooks.on("init", () => {
    game.socket.on(SOCKET_EVENT, ({ type, data }) => {
        if (type === ClientNotifications.NEW_PLAYER_LOCATION) {
            // buildingId = data
            notifyFTG("NEW_PLAYER_CURRENT_LOCATION", data)
        } else if (type === ClientNotifications.NEW_SETTLEMENT_TIME) {
            // { newTime, stateId } = data
            notifyFTG("NEW_SETTLEMENT_TIME", data)
        } else if (type === ClientNotifications.BUILDING_UPDATE) {
            // { buildingId, stateId } = data
            notifyFTG("UPDATE_BUILDING", data)
        } else if (type === ClientNotifications.PERSON_UPDATE) {
            // { personId, stateId } = data
            notifyFTG("UPDATE_PERSON", data)
        } else if (type === ClientNotifications.PEOPLE_UPDATE) {
            // { stateId } = data
            notifyFTG("UPDATE_PEOPLE", data)
        } else if (type === ClientNotifications.BUILDINGS_UPDATE) {
            // { stateId } = data
            notifyFTG("UPDATE_BUILDINGS", data)
        } else if (type === ClientNotifications.PIN_UPDATED) {
            // data = FTG Pin
            notifyFTG("PIN_UPDATED", data)
        } else if (type === ClientNotifications.PIN_DELETED) {
            // data = pinId (number)
            notifyFTG("PIN_DELETED", data)
        }
    });
});

window.addEventListener(
    "message",
    (event) => {
        if (event.origin === FANTASY_TOWN_GENERATOR_ORIGIN) {
            const parsedData = JSON.parse(event.data)
            if (parsedData.type === FtgEvent.BUILDING) {
                notifyBuilding(parsedData.data);
            } else if (parsedData.type === FtgEvent.FACTIONS) {
                notifyFactions(parsedData.data);
            } else if (parsedData.type === FtgEvent.BUILDINGS) {
                notifyBuildings(parsedData.data);
            } else if (parsedData.type === FtgEvent.PEOPLE) {
                notifyPeople(parsedData.data);
            } else if (parsedData.type === FtgEvent.NEW_PLAYER_CURRENT_LOCATION) {
                notifyOtherClients(ClientNotifications.NEW_PLAYER_LOCATION, parsedData.data);
            } else if (parsedData.type === FtgEvent.NEW_SETTLEMENT_TIME) {
                notifyOtherClients(ClientNotifications.NEW_SETTLEMENT_TIME, parsedData.data);
            } else if (parsedData.type === FtgEvent.BUILDING_UPDATE) {
                const { data, stateId } = parsedData.data;
                notifyOtherClients(ClientNotifications.BUILDING_UPDATE, { buildingId: data.id, stateId });
            } else if (parsedData.type === FtgEvent.PERSON_UPDATE) {
                const { data, stateId } = parsedData.data;
                notifyOtherClients(ClientNotifications.PERSON_UPDATE,{ personId: data.id, stateId });
            } else if (parsedData.type === FtgEvent.PEOPLE_UPDATE) {
                const { stateId } = parsedData.data;
                notifyOtherClients(ClientNotifications.PEOPLE_UPDATE,{ stateId });
            } else if (parsedData.type === FtgEvent.BUILDINGS_UPDATE) {
                const { stateId } = parsedData.data;
                notifyOtherClients(ClientNotifications.BUILDINGS_UPDATE,{ stateId });
            } else if (parsedData.type === FtgEvent.DISTRICT) {
                notifyDistrict(parsedData.data);
            } else if (parsedData.type === FtgEvent.PIN_UPDATED) {
                // parsedData.data is a pin
                notifyOtherClients(ClientNotifications.PIN_UPDATED, parsedData.data);
            } else if (parsedData.type === FtgEvent.PIN_DELETED) {
                // parsedData.data is a pin id
                notifyOtherClients(ClientNotifications.PIN_DELETED, parsedData.data);
            }

            // Capture mouse move events from the fantasy-town-generator iframe so that drag controls still work
            // properly
            if (parsedData.type === FtgEvent.MOUSE_MOVE) {
                window.dispatchEvent(new MouseEvent('mousemove', parsedData.data));
                window.dispatchEvent(new PointerEvent('pointermove', parsedData.data));
            }
        }
    }
);

Handlebars.registerHelper('towngenHasOpenStatus', function (value) {
    return value !== 'NOT_APPLICABLE';
});

Handlebars.registerHelper('towngenNotEmpty', function (value) {
    return value !== null && value !== undefined && value !== '' && value.length !== 0;
});

Handlebars.registerHelper('towngenJson', function (value) {
    return JSON.stringify(value)
});

Handlebars.registerHelper('towngenPrice', function (price) {
    let result = '';
    if (price.pp > 0) {
        result += `${price.pp} pp `;
    }
    if (price.gp > 0) {
        result += `${price.gp} gp `;
    }
    if (price.ep > 0) {
        result += `${price.ep} ep `;
    }
    if (price.sp > 0) {
        result += `${price.sp} sp `;
    }
    if (price.cp > 0) {
        result += `${price.cp} cp `;
    }
    return result;
});

Handlebars.registerHelper('towngenFormatPeople', function (value) {
    if (value === 0) {
        return 'No-one';
    }
    if (value === 1) {
        return 'One person';
    }
    return value + ' people';
});

Handlebars.registerHelper('towngenCapitalizeEnum', function (value) {
    if (!value) {
        return '';
    }
    const removedUnderscores = value.replace(/_/g, ' ');
    return removedUnderscores.charAt(0) + removedUnderscores.slice(1).toLowerCase();
});

Handlebars.registerHelper('towngenLowercaseEnum', function (value) {
    if (!value) {
        return '';
    }
    return value.replace(/_/g, ' ').toLowerCase();
});

Handlebars.registerHelper('towngenAOrAn', function (value) {
    const firstChar = value.toLowerCase().charAt(0);
    if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
        return 'an';
    }
    return 'a';
});

const formatList = items => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    return `${items.slice(0, items.length - 1).join(', ')} and ${items[items.length - 1]}`;
}

Handlebars.registerHelper('towngenFormatList', function (items) {
    return formatList(items);
});

Handlebars.registerHelper('towngenFormatEnumList', function (items) {
    return formatList(items.map(item => item.replace(/_/g, ' ').toLowerCase()));
});

Handlebars.registerHelper('towngenIsGm', function () {
    return game?.user?.isGM;
});
