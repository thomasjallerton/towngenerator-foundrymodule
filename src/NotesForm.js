import {notifyFTG} from "./notifier.js";

export const notifyNotes = (id, title, noteType, notes, publicNotes, publicCanWriteNotes) => {
    new NotesForm({notes, publicNotes}, {
        id: noteType + id,
        title: title + " Notes",
        data: {noteType, id, publicCanWriteNotes}
    }).render(true);
}

export class NotesForm extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = "ftg-importer";
        options.template = "modules/fantasy-town-generator-import/handlebars/notes.hbs";
        options.width = 500;
        return options;
    }

    get title() {
        return this.options.title;
    }

    getData(options) {
        return {
            publicNotes: this.object.publicNotes,
            notes: this.object.notes,
            publicCanWriteNotes: this.options.data.publicCanWriteNotes
        }
    }

    async _updateObject(_, formData) {
        if (this.options.data.noteType === 'BUILDING') {
            notifyFTG('BUILDING_NOTE', {buildingId: this.options.data.id, ...formData});
        } else if (this.options.data.noteType === 'PERSON') {
            notifyFTG('PERSON_NOTE', {personId: this.options.data.id, ...formData});
        }

        await this.close();
    }

}
