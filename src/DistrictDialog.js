
export const notifyDistrict = district => {
    new DistrictDialog({id: 'district-' + district.id, data: district}).render(true);
}

Handlebars.registerHelper('towngenOverallDistrictType', function (type) {
    if (type === 'SQUALID') {
        return 'squalid lifestyle';
    }
    if (type === 'POOR') {
        return 'poor lifestyle';
    }
    if (type === 'MODEST') {
        return 'modest lifestyle';
    }
    if (type === 'COMFORTABLE') {
        return 'comfortable lifestyle';
    }
    if (type === 'WEALTHY') {
        return 'wealthy lifestyle';
    }
    if (type === 'ARISTOCRATIC') {
        return 'aristocratic lifestyle';
    }
    if (type === 'INDUSTRIAL') {
        return 'industrial';
    }
    return '';
});

class DistrictDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/fantasy-town-generator-import/handlebars/district.hbs";
        options.width = 500;
        return options;
    }

    getData(options) {
        return {
            data: options.data
        };
    }

    get title() {
        return this.options.data.name;
    }
}
