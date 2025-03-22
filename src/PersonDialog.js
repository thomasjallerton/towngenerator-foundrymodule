import {notifyFTG} from "./notifier.js";
import {FtgEvent, listenForUpdates, stopListening} from "./listener.js";
import {notifyNotes} from "./NotesForm.js";
import {getPersonJournalSettings, JOURNAL_TYPE, journalButtons, openJournalAutomatically} from "./journalSettings.js";

export const notifyPerson = async (person, time) => {
    const settings = await getPersonJournalSettings(person.id)
    new PersonDialog({id: 'person-' + person.id, data: {...person, time}, settings}).render(true);
    await openJournalAutomatically(settings)
}

$(document).on('click', '#fantasy-town-generator-person-favourite', function () {
    const id = $(this).data('id');
    const currentlyFavourite = $(this).data('favourite');
    notifyFTG('FAVOURITE_PERSON', { personId: id, favourite: !currentlyFavourite });
})

$(document).on('click', '#fantasy-town-generator-person-notes', function () {
    notifyNotes(
        $(this).data('id'),
        $(this).data('name'),
        "PERSON",
        $(this).data('notes'),
        $(this).data('public-notes'),
        $(this).data('public-can-write-notes')
    );
})


Handlebars.registerHelper('towngenIsBald', function (value) {
    return value === 'BALD';
});

Handlebars.registerHelper('towngenSkinTone', function (value) {
    const { vlsNumber } = value;
    if (vlsNumber >= 0 && vlsNumber <= 6) {
        return 'pale';
    } if (vlsNumber < 13) {
        return 'light';
    } if (vlsNumber < 20) {
        return 'light tan';
    } if (vlsNumber < 27) {
        return 'dark tan';
    } if (vlsNumber < 34) {
        return 'brown';
    } if (vlsNumber < 36) {
        return 'dark brown';
    }
    return '';
});

Handlebars.registerHelper('towngenFeet', function (cm) {
    const realFeet = ((cm * 0.393700) / 12);
    const feet = Math.floor(realFeet);
    const inches = Math.round((realFeet - feet) * 12);
    return `${feet}′ ${inches}″`;
});

class PersonDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/person.hbs";
        options.width = 500;
        return options;
    }

    activateListeners(html) {
        super.activateListeners(html);
        listenForUpdates(FtgEvent.PERSON_UPDATE, this.options.data.id, ({ data }) => {
            if (data.id === this.options.data.id) {
                notifyPerson(data, this.options.data.time);
            }
        });
    }

    close(options) {
        stopListening(FtgEvent.PERSON_UPDATE, this.options.data.id);
        return super.close(options);
    }

    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();
        journalButtons(buttons, JOURNAL_TYPE.PEOPLE, this)
        return buttons;
    }

    getData(options) {
        return {
            data: options.data
        };
    }

    get title() {
        return this.options.data.firstName + ' ' + this.options.data.lastName + ' - (' + this.options.data.time + ')';
    }
}
