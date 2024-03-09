import { DEV } from "../model/constants.js";
import { attachAuthStateChangeObserver, currentUser } from "../controller/firebase_auth.js";
import { updateWindow } from "../view/playrecord_page.js";
import { protectedView } from "../view/proetected_view.js";


export async function onClickClearHistory(e) {
    e.preventDefault();

    if (!confirm("Are you sure to delete all game history?")) return;
    try {
        await deleteAllHistory(currentUser.email);

    } catch (e) {
        if (DEV) console.log('Failed to delete: ', e);
        alert('Failed to delete reply: ' + JSON.stringify(e));
    }
    await updateWindow();
} 