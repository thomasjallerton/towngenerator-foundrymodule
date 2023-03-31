import {notifyPerson} from "./PersonDialog.js";

export const notifyFaction = faction => {
    new FactionDialog({id: 'faction-' + faction.id, data: faction}).render(true);
}

$(document).on('click', '#fantasy-town-generator-faction-person', function () {
    notifyPerson($(this).data('person'), $(this).data('time'));
})

class FactionDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/faction.hbs";
        options.width = 500;
        return options;
    }

    getData(options) {
        return {
            data: options.data
        };
    }

    get title() {
        return this.options.data.name + ' - (' + this.options.data.time + ')';
    }
}
