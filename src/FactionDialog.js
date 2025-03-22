import {notifyPerson} from "./PersonDialog.js";
import {
    getFactionJournalSettings,
    JOURNAL_TYPE,
    journalButtons, openJournalAutomatically
} from "./journalSettings.js";

export const notifyFaction = async faction => {
    const settings = await getFactionJournalSettings(faction.id)
    new FactionDialog({id: 'faction-' + faction.id, data: faction}).render(true);
    await openJournalAutomatically(settings)
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

    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();
        journalButtons(buttons, JOURNAL_TYPE.FACTIONS, this)
        return buttons;
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
