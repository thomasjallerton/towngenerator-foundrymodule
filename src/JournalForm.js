import {getEntityJournalSettings, setJournalSettings} from "./journalSettings.js";

export async function openJournalForm(title, entityType, entityId, newSettingsCallback) {
    const initialSettings = await getEntityJournalSettings(entityId, entityType)
    new JournalForm(initialSettings, {title, entityType, entityId, newSettingsCallback}).render(true)
}

class JournalForm extends FormApplication {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "ftg-entity-settings",
            classes: ["form"],
            width: 500,
            height: 220,
            template: "modules/fantasy-town-generator-import/handlebars/journal_form.hbs",
            dragDrop: [
                {dragSelector: ".document.journal", dropSelector: ".fantasy-town-generator-journal-container"},
            ]
        })
    }

    documentUuid = this.object.documentUuid;

    activateListeners(html) {
        super.activateListeners(html);
        $(html).on('click', '#fantasy-town-generator-journal-unlink', () => {
            this.documentUuid = undefined;
            this.render();
        })
    }

    async _onDrop(event) {
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData('text/plain'));
        } catch (err) {
            return false;
        }
        if (data.type !== 'JournalEntry') {
            return false;
        }
        // Skip 'JournalEntry.'
        const uuid = data.uuid.substring(13, data.uuid.length);
        const journal = game.journal.get(uuid)
        if (journal === undefined) {
            return false;
        }
        this.documentUuid = uuid;
        this.render();
    }

    async _updateObject(_, formData) {
        if (!formData) return Promise.reject("Invalid form data")
        const pageUuidOptions = this._getPageOptions(this.documentUuid).map(({value}) => value);
        if (formData.pageUuid === "" || !pageUuidOptions.includes(formData.pageUuid)) {
            formData.pageUuid = undefined
        }

        const finalForm = {
            ...formData,
            openAutomatically: formData.openAutomatically != null,
            documentUuid: this.documentUuid
        }
        setJournalSettings(this.options.entityType, this.options.entityId, finalForm)
        this.options.newSettingsCallback(finalForm);
    }

    getData(options) {
        const uuid = this.documentUuid;
        const journalName = uuid ? game.journal.get(uuid).name : undefined
        return foundry.utils.mergeObject(super.getData(options), {
            journalName,
            pageOptions: this._getPageOptions(uuid),
        });
    }

    _getPageOptions(documentUuid) {
        const defaultPage = {label: 'Default', value: ""};
        if (documentUuid === undefined) {
            return [defaultPage];
        }
        const journal = game.journal.get(documentUuid)
        if (journal === undefined) {
            return [defaultPage];
        }
        return [defaultPage, ...Array.from(journal.pages.entries(), ([pageUuid, page]) => ({
            label: page.name,
            value: pageUuid,
        }))];
    }

}
