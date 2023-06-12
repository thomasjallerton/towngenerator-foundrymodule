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

    activateListeners(html) {
        super.activateListeners(html);
        listenForUpdates(FtgEvent.BUILDINGS_UPDATE, 'buildings', ({ data }) => {
            notifyBuildings(data)
        })
    }

    close(options) {
        stopListening(FtgEvent.BUILDINGS_UPDATE, 'buildings');
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
