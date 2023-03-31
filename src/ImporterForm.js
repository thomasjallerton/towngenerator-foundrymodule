import {
    MODULE_ID,
    SETTLEMENT_ID_FLAG
} from "./constants.js";

export class ImporterForm extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = "ftg-importer";
        options.template = "modules/fantasy-town-generator-import/handlebars/importer.hbs";
        options.width = 500;
        return options;
    }

    get title() {
        return "Fantasy Town Generator Importer";
    }

    async _updateObject(_, formData) {
        if (!formData) return Promise.reject("Invalid form data")
        if (formData.exportData) {
            try {
                const parsedData = JSON.parse(formData.exportData)
                if (!parsedData.name || !parsedData.id) {
                    return Promise.reject("Invalid form data")
                }
                const scene = await Scene.create({
                    name: parsedData.name,
                    type: 'Scene',
                    width: 5000,
                    height: 5000,
                    tokenVision: false,
                    fogExploration: false,
                    globalLight: true,
                    active: false,
                    gridType: 0,
                    padding: 0
                });
                scene.setFlag(MODULE_ID, SETTLEMENT_ID_FLAG, parsedData.id);
                return Promise.resolve();
            } catch (e) {
                return Promise.reject("Invalid form data")
            }
        }
        return Promise.reject("Invalid form data")
    }

}
