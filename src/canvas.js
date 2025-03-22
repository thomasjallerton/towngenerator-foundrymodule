import {FANTASY_TOWN_GENERATOR_ORIGIN, MODULE_ID, SETTLEMENT_ID_FLAG, SIMPLE_CALENDAR_MODULE_ID} from "./constants.js";

export let currentSettlement = undefined

export function canvasInit(canvas) {

    const settlementId = canvas.scene.getFlag(MODULE_ID, SETTLEMENT_ID_FLAG);
    currentSettlement = settlementId;
    if (settlementId) {
        let src = game?.user?.isGM
            ? (FANTASY_TOWN_GENERATOR_ORIGIN + "/user/settlements/" + settlementId + "?context=foundryvtt")
            : (FANTASY_TOWN_GENERATOR_ORIGIN + "/public-settlements/" + settlementId + "?context=foundryvtt")

        if (game.modules.get(SIMPLE_CALENDAR_MODULE_ID)?.active) {
            const date = SimpleCalendar.api.timestampToDate(SimpleCalendar.api.timestamp());
            src += '&external_calendar=' + date.hour + "-" + date.dayOfTheWeek + '-' + date.weekdays[date.dayOfTheWeek]
        }

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

