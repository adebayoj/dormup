var selectedGuestId = [];
var selectedTab = "Residents";

function getNextGuestId() {
    var maxId = -1;
    for (var g in mapOfGuests) {
        if (!mapOfGuests.hasOwnProperty(g)) { // Ensure we're only using fields we added.
            continue;
        }
        if(g > maxId) {
            maxId = g;
        }
    }
    return ++maxId;
}

function setupRightSidebar(residentId) {
    displayResidentProfile(residentId);
    clearGuestDetailsForm();
    selectedGuestId = [];
    $("#tableList").empty();
    var arrayOfGuestIds = mapOfResidentsToGuests[residentId];
    if(arrayOfGuestIds) {
        for(var i = 0; i < arrayOfGuestIds.length; i++) {
            guestId = arrayOfGuestIds[i];
            addGuestDetailsToList(guestId, false);
        }    
    }
    showOrHideListOptions(selectedGuestId.length);
    showRightSidebar();
}

function displayResidentProfile(residentId) {
    var resident = mapOfResidents[residentId];
    if(!resident) {
        alert("Could not find profile for resident ID: " + residentId);
    }
    $("#residentName").val(resident[0] + " " + resident[1]).prop('disabled', true);
    $("#room").val(resident[2]).prop('disabled', true);
}

function isSelected(guestId) {
    for(var i = 0; i < selectedGuestId.length; i++) {
        if(selectedGuestId[i] == guestId) {
            return true;
        }
    }
    return false;
}

function deleteAllSelectedGuests(arrayOfGuestIds) {
    //TODO: Also remove guest from data model before removing from table.
    for(var i = 0; i < arrayOfGuestIds.length; i++){
        var guestId = arrayOfGuestIds[i];
        var rowId = "guest-" + guestId;
        deleteRowFromDisplay(rowId);
        console.log(arrayOfGuestIds);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedGuestId.length);
}

function checkInAllSelectedGuests(arrayOfGuestIds) {
    var checkedInString = "Checked in";
    for(var i = 0; i < arrayOfGuestIds.length; i++){
        var guestId = arrayOfGuestIds[i];
        mapOfGuests[guestId][2] = checkedInString;
    }

    for(var i = 0; i < arrayOfGuestIds.length; i++){
        var guestId = arrayOfGuestIds[i];
        var rowId = "guest-" + guestId;
        var textSelector = "#" + rowId + " .status";
        $(textSelector).html(checkedInString);
        temporarilyHighlightText(textSelector);
        // temporarilyHighlightRow(rowId);
    }
}

function checkOutAllSelectedGuests(arrayOfGuestIds) {
    var checkedOutString = "Checked out";
    for(var i = 0; i < arrayOfGuestIds.length; i++){
        var guestId = arrayOfGuestIds[i];
        mapOfGuests[guestId][2] = checkedOutString;
    }
    for(var i = 0; i < arrayOfGuestIds.length; i++){
        var guestId = arrayOfGuestIds[i];
        var rowId = "guest-" + guestId;
        var textSelector = "#" + rowId + " .status";
        $(textSelector).html(checkedOutString);
        temporarilyHighlightText(textSelector);
        deleteRowFromDisplay(rowId);
    }
    console.log(arrayOfGuestIds.length);
    clearAllTableSelections();
    showOrHideListOptions(selectedGuestId.length);
}

function clearAllTableSelections() {
    selectedGuestId = [];
}

function clearGuestDetailsForm() {
    $("#top-panel input").not("#residentName").not("#room").val("");
    $("#top-panel textarea").val("");
    setDropdown("Not Arrived");
}

function showFormForNewGuest() {
    $("#clearForm").show();
    $("#saveNewGuest").show();
    clearGuestDetailsForm();
}

function saveNewGuestFromForm() {
    if(isEditing) {
        deleteAllSelectedGuests(selectedGuestId);
    }
    var guestId = getGuestDetailsFromForm();
    if(guestId == -1) {
        // Todo: implement more specific error message
        alert("please enter all required details in the right format.");
        return;
    }
    isEditing = false;
    addGuestDetailsToList(guestId, true);
    clearGuestDetailsForm();
    showOrHideListOptions(selectedGuestId.length);
}

function addGuestDetailsToList(guestId, highlightRow){
    var guest = mapOfGuests[guestId];
    if(guest[2] == "Checked out") {
        return;
    }
    var rowId = "guest-" + guestId;
    $("#tableList").prepend(
        '<div class="row" id="' + rowId + '" style="display:none">' +
            '<div class="col-sm-3 col-sm-offset-1"><p>' + guest[0] + '</p></div>' +
            '<div class="col-sm-3"><p class="status">' + guest[2] + '</p></div>' +
            '<div class="col-sm-3"><p>' + guest[1] + '</p></div>' +
            '<div class="col-sm-2"><p>' + guest[3] + '</p></div>' +
        '</div>');
    $("#" + rowId).slideDown();
    if(highlightRow) {
        temporarilyHighlightRow(rowId);
    }
}

function setDropdown(value) {
    $("#guestStatusDropdownLabel").html(value + ' <span class="caret"></span>');
    $("#guestStatusDropdownLabel").val(value);
}

function getGuestDetailsFromForm() {
    var guestName = $("#guestName").val();
    var checkIn  = $("#checkIn").val();
    var status = $("#guestStatusDropdownLabel").val();
    var duration = $("#duration").val();
    var daysLeft = $("#daysLeft").val();
    var guestNote = $("#guestNote").val();
    if(!duration && daysLeft) {
        duration = daysLeft;
    }
    if(!daysLeft && duration) {
        daysLeft = duration;
    }

    if(!guestName || !checkIn || !status || !duration || !daysLeft) {
        return -1;
    }
    var guestId = getNextGuestId();
    var guestDetails = [guestName, checkIn, status, duration, daysLeft, guestNote, guestId];
    mapOfGuests[guestId] = guestDetails;
    var residentToGuestMapEntry = mapOfResidentsToGuests[selectedResidentId];
    if(residentToGuestMapEntry) {
        residentToGuestMapEntry.push(guestId);
    } else {
        mapOfResidentsToGuests[selectedResidentId] = [guestId];
    }
    return guestId;
}

function hideDaysLeft() {
    $("#daysLeftFormField").hide();
}

function showGuestDetailsForEditing(guestId) {
    isEditing = true;
    var guest = mapOfGuests[guestId];
    $("#top-panel #guestName").val(guest[0]);
    $("#top-panel #checkIn").val(guest[1]);
    setDropdown(guest[2]);
    $("#top-panel #duration").val(guest[3]);
    $("#top-panel #daysLeft").val(guest[4]);
    $("#top-panel #guestNote").val(guest[5]);
    $("#clearForm").show();
    $("#saveNewGuest").show();
}

function getGuestId(rowId) {
    return rowId.split("guest-")[1];
}

function getGuestRowId(residentId) {
    return "guest-" + residentId;
}

$(document).ready(function(){
    $("#table-menu #newFormBtn").click(function(){
        showFormForNewGuest();
        $("#top-panel").slideDown();      
    });

    $("#table-menu #guestListEdit").click(function(){
        showGuestDetailsForEditing(selectedGuestId[0]); 
    });

    $("#table-menu #guestListCheckIn").click(function(){
        checkInAllSelectedGuests(selectedGuestId); 
    });

    $("#table-menu #guestListCheckOut").click(function(){
        checkOutAllSelectedGuests(selectedGuestId); 
    });

    $("#table-menu #guestListDelete").click(function(){
        deleteAllSelectedGuests(selectedGuestId); 
    });

    $('#guestStatusDropdown li a').click(function(){
        setDropdown($(this).text());
    });

    $("#guest-form-options #clearForm").click(function(){
        clearGuestDetailsForm();        
    });

    $("#guest-form-options #saveNewGuest").click(function(){
        saveNewGuestFromForm();      
    });

    $('#tableList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var guestId = getGuestId(rowId);
        var removedId = false;
        for(var i = 0; i < selectedGuestId.length; i++) {
            if(selectedGuestId[i] == guestId) {
                // This is a faster way to delete item from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedGuestId[i] = selectedGuestId[selectedGuestId.length - 1];
                selectedGuestId.pop();
                removeRowHighlight(rowId);
                console.log(rowId);
                console.log("pop")
                removedId = true;
            }
        }
        if(!removedId){
            selectedGuestId.push(guestId);    
            highlightRow(rowId);
            console.log(rowId);
                console.log("push")
        }
        showOrHideListOptions(selectedGuestId.length);
    });

});