import {notifyFaction} from "./FactionDialog.js";

export const notifyFactions = factions => {
    new FactionsDialog({id: 'factions', data: factions}).render(true);
}

$(document).on('click', '#fantasy-town-generator-factions-faction', function () {
    notifyFaction($(this).data('faction'));
})

class FactionsDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/factions.hbs";
        options.width = 500;
        return options;
    }

    getData(options) {
        return {
            data: options.data
        };
    }

    get title() {
        return "All Factions";
    }
}
