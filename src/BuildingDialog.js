import {notifyPerson} from "./PersonDialog.js";
import {notifyFTG} from "./notifier.js";
import {FtgEvent, listenForUpdates, stopListening} from "./listener.js";
import {notifyNotes} from "./NotesForm.js";

export const notifyBuilding = building => {
    new BuildingDialog({id: 'building-' + building.id, data: building}).render(true);
}

$(document).on('click', '#fantasy-town-generator-building-person', function () {
    notifyPerson($(this).data('person'), $(this).data('time'));
})

$(document).on('click', '#fantasy-town-generator-building-notes', function () {
    notifyNotes(
        $(this).data('id'),
        $(this).data('name'),
        "BUILDING",
        $(this).data('notes'),
        $(this).data('public-notes'),
        $(this).data('public-can-write-notes')
    );
})

$(document).on('click', '#fantasy-town-generator-building-start-event', function () {
    const id = $(this).data('id');
    notifyFTG('CREATE_EVENT', id);
})

$(document).on('click', '#fantasy-town-generator-building-set-current-location', function () {
    const newLocation = $(this).data('new-location');
    notifyFTG('PLAYER_CURRENT_LOCATION', { newLocation });
})

$(document).on('click', '#fantasy-town-generator-building-favourite', function () {
    const id = $(this).data('id');
    const currentlyFavourite = $(this).data('favourite');
    notifyFTG('FAVOURITE_BUILDING', { buildingId: id, favourite: !currentlyFavourite });
})

$(document).on('click', '#fantasy-town-generator-building-items', function () {
    const id = $(this).data('id');
    const stock = $(this).data('stock');
    new ItemDialog({
        id: id + '-items',
        title: 'Items',
        data: stock.map(stock => ({item: stock.item, price: stock.price}))
    }).render(true);
})

$(document).on('click', '#fantasy-town-generator-building-services', function () {
    const id = $(this).data('id');
    const services = $(this).data('services');
    new ItemDialog({
        id: id + '-services',
        title: 'Services',
        data: services.map(service => ({item: service.service, price: service.price}))
    }).render(true);
})

Handlebars.registerHelper('towngenIconForStatus', function (status) {
    if (status === 'WORKING') {
        return 'fa-briefcase';
    }
    if (status === 'STUDYING') {
        return 'fa-book-open';
    }
    if (status === 'SLEEPING') {
        return 'fa-face-sleeping';
    }
    if (status === 'RELAXING') {
        return 'fa-mug-hot';
    }
    if (status === 'RELAXING_AT_HOME') {
        return 'fa-house';
    }
    if (status === 'AT_EVENT') {
        return 'fa-bolt';
    }
    return '';
});

class BuildingDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/building.hbs";
        options.width = 600;
        return options;
    }

    activateListeners(html) {
        super.activateListeners(html);
        listenForUpdates(FtgEvent.BUILDING_UPDATE, this.options.data.id,({data}) => {
            if (data.id === this.options.data.id) {
                notifyBuilding(data);
            }
        });
        listenForUpdates(FtgEvent.NEW_PLAYER_CURRENT_LOCATION, this.options.data.id, newBuildingLocation => {
            if (newBuildingLocation === this.options.data.id || this.options.data.isPlayerCurrentLocation) {
                notifyBuilding({
                    ...this.options.data,
                    isPlayerCurrentLocation: newBuildingLocation === this.options.data.id
                });
            }
        });
    }

    close(options) {
        stopListening(FtgEvent.BUILDING_UPDATE, this.options.data.id);
        stopListening(FtgEvent.NEW_PLAYER_CURRENT_LOCATION, this.options.data.id);
        return super.close(options);
    }

    getData(options) {
        this.options.data = options.data;
        return {
            data: options.data
        };
    }

    get title() {
        return this.options.data.name + ' - (' + this.options.data.time + ')';
    }
}

class ItemDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/items.hbs";
        options.width = 500;
        return options;
    }

    getData(options) {
        return {data: {...options.data}, title: options.title};
    }

    get title() {
        return this.options.title;
    }
}
