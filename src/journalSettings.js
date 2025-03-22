import {MODULE_ID, MONKS_JOURNAL_MODULE_ID} from "./constants.js";
import {currentSettlement} from "./canvas.js";
import {openJournalForm} from "./JournalForm.js";
import {documentExistsAndUserHasPermission} from "./utils.js";

const JOURNAL_SETTING = 'journal';

// Maps an FTG id to a journal uuid
// interface JournalSettings {
//     [uuid: string]: SettlementJournalSettings;
// }
//
// interface SettlementJournalSettings {
//     people: { [id]: string: EntityJournalSettings };
//     buildings: { [id]: string: EntityJournalSettings };
//     factions: { [id]: string: EntityJournalSettings };
// }
//
// interface EntityJournalSettings {
//     documentUuid: string;
//     pageUuid: string|undefined;
//     openAutomatically: boolean|undefined;
// }

Hooks.on("init", () => {
    game.settings.register(MODULE_ID, JOURNAL_SETTING, {
        name: 'Journal Entries',
        hint: 'Mapping from FTG entities to Foundry Journal entries',
        scope: 'world',
        config: false,
        // JournalSettings
        type: Object,
        filePicker: false,
        requiresReload: false,
    });
});

function defaultSettlementSettings() {
    return {
        people: {},
        buildings: {},
        factions: {},
    }
}

export const JOURNAL_TYPE = {
    PEOPLE: 'people',
    BUILDINGS: 'buildings',
    FACTIONS: 'factions',
}

export async function openJournalAutomatically(journalSettings) {
    if (journalSettings && journalSettings.openAutomatically) {
        await openJournal(journalSettings)
    }
}

export async function openJournal(journalSettings) {
    if (!journalSettings || !journalSettings.documentUuid) return

    const journal = game.journal.get(journalSettings.documentUuid);
    if (journal === undefined) return;

    if (game.modules.get(MONKS_JOURNAL_MODULE_ID)?.active) {
        const opened = game.MonksEnhancedJournal.openJournalEntry(journal)
        if (opened) return;
    }

    const sheet = new JournalSheet(journal);
    await sheet._render(true)
    if (journalSettings.pageUuid) {
        sheet.goToPage(journalSettings.pageUuid);
    }
}

async function getSettlementJournalSettings() {
    const fullSettings = await game.settings.get(MODULE_ID, JOURNAL_SETTING) ?? defaultSettlementSettings();
    return fullSettings[currentSettlement] ?? defaultSettlementSettings();
}

async function updateJournalSettings(path /*string[]*/, value) {
    const root = await game.settings.get(MODULE_ID, JOURNAL_SETTING) ?? {}
    let current = root;
    for (const segment of path.slice(0, -1)) {
        if (current[segment] === undefined) {
            current[segment] = {}
        }
        current = current[segment];
    }
    current[path[path.length - 1]] = value

    await game.settings.set(MODULE_ID, JOURNAL_SETTING, root)
}

export async function getEntityJournalSettings(personId, type) {
    return (await getSettlementJournalSettings())[type]?.[personId];
}

export async function getPersonJournalSettings(personId) {
    return (await getSettlementJournalSettings()).people?.[personId];
}

export async function getBuildingJournalSettings(buildingId) {
    return (await getSettlementJournalSettings()).buildings?.[buildingId];
}

export async function getFactionJournalSettings(factionId) {
    return (await getSettlementJournalSettings()).factions?.[factionId];
}

export async function getPinJournalSettings(settlementId, pinId) {
    return (await getSettlementJournalSettings()).pins?.[pinId];
}

export async function setJournalSettings(type, id, entitySettings) {
    await updateJournalSettings([currentSettlement, type, id], entitySettings);
}

export function journalButtons(buttons, entityType, dialog) {
    if (game.user.isGM) {
        buttons.unshift({
            label: "Settings",
            icon: 'fa-solid fa-cog',
            class: 'settings',
            onclick: () => openJournalForm(
                dialog.options.data.name + ' settings',
                entityType,
                dialog.options.data.id,
                async (newSettings) => {
                    dialog.options.settings = newSettings;
                    if (dialog.rendered) {
                        await dialog.close()
                        await dialog.render(true)
                    }
                }
            )
        })
    }
    const settings = dialog.options.settings
    if (settings?.documentUuid) {
        const journal = game.journal.get(settings.documentUuid);
        if (documentExistsAndUserHasPermission(journal)) {
            buttons.unshift({
                label: "Journal",
                icon: 'fa-solid fa-book-open',
                class: 'journal',
                onclick: () => openJournal(dialog.options.settings)
            })
        }
    }
}
