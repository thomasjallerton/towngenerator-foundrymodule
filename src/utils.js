export function documentExistsAndUserHasPermission(document) {
    if (document == null) {
        return false;
    }
    const userLevel = document.getUserLevel(game.user)
    return userLevel === foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
        || userLevel === foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
}
