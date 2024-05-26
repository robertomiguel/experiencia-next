import { MiddlewareAPI } from "@reduxjs/toolkit";

export const localStoreMiddleware = (store: MiddlewareAPI) => (next: any) => (action: any) => {
    const result = next(action);
    if (action.type === "wiki/addWikiItem" || action.type === "wiki/deleteWikiItem") {
        const { itemsSelected } = store.getState().wikipedia;
        localStorage.setItem("wikiItems", JSON.stringify(itemsSelected));
    }
    // images/updateSettings
    if (action.type === "images/updateSettings") {
        const { settings } = store.getState().images;
        localStorage.setItem("settings", JSON.stringify(settings));
    }
    return result;
}
