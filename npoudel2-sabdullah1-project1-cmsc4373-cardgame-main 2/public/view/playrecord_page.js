import { currentUser } from "../controller/firebase_auth.js";
import { getPlayHistory } from "../controller/firestore_controller.js";
import { protectedView } from "./proetected_view.js";
import { root } from "./elements.js";
import { onClickClearHistory } from "../controller/playrecord_controller.js";
import { DEV } from "../model/constants.js";
// 


// Function to display the play record view
export async function DisplayPlayRecords() {
    // Redirect to protected view if no user is logged in
    if (!currentUser) {
        root.innerHTML = await protectedView();
        return;
    }

    // Fetch and display the play record template
    const response = await fetch('/view/templates/playrecord_page_template.html', { cache: 'no-store' });
    const wrapperDiv = document.createElement('div');
    wrapperDiv.innerHTML = await response.text();
    wrapperDiv.classList.add('m-4', 'p-4')
    root.innerHTML = '';  // Clear the current content
    root.appendChild(wrapperDiv);  // Add new content

    let playHistoryRecords;

    // Attempt to fetch play history for the current user
    try {
        playHistoryRecords = await getPlayHistory(currentUser.email);
    } catch (error) {
        if (DEV) console.log('Failed to retrieve play records', error);
        alert(`Unable to retrieve play records: ${JSON.stringify(error)}`);
        return;
    }

    const tableBody = wrapperDiv.querySelector('tbody');
    if (playHistoryRecords.length == 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center font-size-3">No history found!</td></tr>`;
    } else {
        let recordIndex = 1;
        playHistoryRecords.forEach(record => tableBody.appendChild(createPlayRecordRow(recordIndex++, record)));
    }
}

// Function to create a table row for a single play history record
function createPlayRecordRow(index, record) {
    const tableRow = document.createElement('tr');
    let betDisplay, winDisplay;
    if (record.restart) {
        betDisplay = "Restarted";
        winDisplay = ""; // No win/lose if restarted
    } else {
        betDisplay = record.bet;
        winDisplay = record.won;
    }
    tableRow.innerHTML = `
        <td>${index}</td>
        <td>${betDisplay}</td>
        <td>${winDisplay}</td>
        <td>${record.balance}</td>
        <td>${new Date(record.timestamp).toLocaleString()}</td>
    `;
    return tableRow;
}

// Function similar to updateWindow for refreshing play history
export async function RefreshPlayHistory() {
    let playHistory = [];
    // Attempt to fetch play history for the current user
    try {
        playHistory = await getPlayHistory(currentUser.email);
    } catch (error) {
        if (DEV) console.log('Error fetching play history', error);
        console.log(`Error retrieving play records: ${JSON.stringify(error)}`);
        return;
    }

    // Clear and update the history display
    let tableBody = document.querySelector('tbody');
    tableBody.querySelectorAll('tr').forEach(tr => tr.remove()); // Clear existing rows
    if (playHistory.length == 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center font-size-3">No history found!</td></tr>`;
    } else {
        let recordNumber = 1;
        playHistory.forEach(record => tableBody.appendChild(createPlayRecordRow(recordNumber++, record)));
    }
}
