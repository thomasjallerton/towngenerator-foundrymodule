import {FANTASY_TOWN_GENERATOR_ORIGIN, MODULE_ID, SETTLEMENT_ID_FLAG} from "./constants.js";

export function canvasInit(canvas) {

    const settlementId = canvas.scene.getFlag(MODULE_ID, SETTLEMENT_ID_FLAG);
    if (settlementId) {
        const src = game?.user?.isGM
            ? (FANTASY_TOWN_GENERATOR_ORIGIN + "/user/settlements/" + settlementId + "?context=foundryvtt")
            : (FANTASY_TOWN_GENERATOR_ORIGIN + "/public-settlements/" + settlementId + "?context=foundryvtt")

        const iframe = $(`<iframe class='fantasy-town-generator-iframe' src='${src}' title='fantasy town generator'></iframe>`);

        $("#ui-left").addClass("fantasy-town-generator-ui-hide");
        iframe.insertAfter("#board")
    }
}

export function canvasTearDown(canvas) {
    const settlementId = canvas.scene.getFlag(MODULE_ID, SETTLEMENT_ID_FLAG);
    if (settlementId) {
        $(".fantasy-town-generator-iframe").remove();
        $("#ui-left").removeClass("fantasy-town-generator-ui-hide");
    }
}

