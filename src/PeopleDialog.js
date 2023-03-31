import {notifyPerson} from "./PersonDialog.js";
import {FtgEvent, listenForUpdates, stopListening} from "./listener.js";

export const notifyPeople = people => {
    new PeopleDialog({id: 'people', data: people }).render(true);
}

$(document).on('click', '#fantasy-town-generator-favourite-person', function () {
    notifyPerson($(this).data('person'), $(this).data('time'));
})

class PeopleDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/people.hbs";
        options.width = 500;
        return options;
    }

    constructor(options) {
        super(options);
        this.updateListener = listenForUpdates(FtgEvent.PEOPLE_UPDATE, ({ data }) => {
            stopListening(this.updateListener);
            notifyPeople(data);
        })
    }

    close(options) {
        stopListening(this.updateListener);
        return super.close(options);
    }

    getData(options) {
        return {
            data: options.data.people,
            time: options.data.time
        };
    }

    get title() {
        return "Favourite People";
    }
}
