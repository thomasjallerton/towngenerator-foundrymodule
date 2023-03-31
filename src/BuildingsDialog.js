import {notifyBuilding} from "./BuildingDialog.js";
import {FtgEvent, listenForUpdates, stopListening} from "./listener.js";

export const notifyBuildings = buildings => {
    new BuildingsDialog({id: 'buildings', data: buildings}).render(true);
}

$(document).on('click', '#fantasy-town-generator-favourite-building', function () {
    notifyBuilding($(this).data('building'));
})

class BuildingsDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/buildings.hbs";
        options.width = 500;
        return options;
    }

    constructor(options) {
        super(options);
        this.updateListener = listenForUpdates(FtgEvent.PEOPLE_UPDATE, ({ data }) => {
            stopListening(this.updateListener);
            notifyBuildings(data)
        })
    }

    close(options) {
        stopListening(this.updateListener);
        return super.close(options);
    }

    getData(options) {
        return {
            data: options.data
        };
    }

    get title() {
        return "Favourite Buildings";
    }
}
