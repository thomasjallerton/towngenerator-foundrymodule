import {ImporterForm} from "./ImporterForm.js";


export function renderSidebarTab(app, html) {
    if ((app.options.id === "scenes" || app instanceof SceneDirectory) && game.user.isGM) {
        let button = $("<div class='header-actions action-buttons flexrow'><button>Import from FTG</button></div>");

        button.on('click', async () => {
            new ImporterForm().render(true);
        });

        $(html).find(".directory-header").find(".header-actions")
        button.insertAfter($(html).find(".directory-header").find(".header-actions").last());
    }
}
