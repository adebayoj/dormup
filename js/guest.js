var selectedGuestId = [];
var selectedGstId = -1;
var selectedTab = "Residents";

function unselectGuest(guestId) {
    selectedGstId = -1;
    removeRowHighlight(getGstRowId(guestId));
}

function selectGuest(guestId) {
    selectedGstId = guestId;
    highlightRow(getGstRowId(guestId));
}

function getGstId(rowId) {
    return rowId.split("gst-")[1];
}

function getGstRowId(guestId) {
    return "gst-" + guestId;
}

function isInGuestInfo(guestMapID, singleString){
    var guestInfo=mapOfGuests[guestMapID];
    var stringForSearch=singleString.toLowerCase();
    if (guestInfo[0].toString().indexOf(stringForSearch)>=0 || guestInfo[2].toLowerCase().indexOf(stringForSearch)>=0){
        return true
    }
    return false;
}

function setupGuestsList(searchStr) {
    $("#firstColumn").html("Name");
    $("#secondColumn").html("Status");
    $("#residentList").empty();
    if (searchStr === undefined || searchStr.length==0){
        for (var r in mapOfGuests) {
            if (!mapOfGuests.hasOwnProperty(r)) { // Ensure we're only using fields we added.
                continue;
            }
            addGuestToList(r);
        }
    }
    else{
        var found=false;
        var inputString=searchStr;
        var inputArray=inputString.split(" ");
        if (inputArray.length == 1){
            for (var r in mapOfGuests) {
                if (!mapOfGuests.hasOwnProperty(r)) { // Ensure we're only using fields we added.
                    continue;
                }
                if (isInGuestInfo(r,inputArray[0])){
                    addGuestToList(r);
                    found=true;
                }
            }
        }
        else if (inputArray.length==2){
            for (var r in mapOfGuests) {
                if (!mapOfGuests.hasOwnProperty(r)) { // Ensure we're only using fields we added.
                    continue;
                }
                if (isInGuestInfo(r,inputArray[0]) && isInGuestInfo(r,inputArray[1])){
                    addGuestToList(r);
                    found=true;
                }
            }
        }
        if (!found) {
            $("#residentList").append(
                '<div class="row">' +
                '<div class="col-sm-12"><p><i>'+"\""+ inputString+"\""+ " not found."+'</i></p></div>' +
                '</div>'
            );
        }
    }
    
}

function addGuestToList(guestId) {
    var guests = mapOfGuests[guestId];
    var rowId = getGstRowId(guestId);
    $("#residentList").append(
        '<div class="row" id="' + rowId + '">' +
            '<div class="col-sm-8"><p>' + guests[0] + '</p></div>' +
            '<div class="col-sm-4"><p>' + guests[2] + '</p></div>' +
        '</div>');
}

function getNextGuestUniqueId() {
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
    var arrayOfGuestUniqueIds = mapOfResidentsToGuests[residentId];
    if(arrayOfGuestUniqueIds) {
        for(var i = 0; i < arrayOfGuestUniqueIds.length; i++) {
            guestUniqueId = arrayOfGuestUniqueIds[i];
            addGuestDetailsToList(guestUniqueId, false);
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

function isSelected(guestUniqueId) {
    for(var i = 0; i < selectedGuestId.length; i++) {
        if(selectedGuestId[i] == guestUniqueId) {
            return true;
        }
    }
    return false;
}

function deleteAllSelectedGuests(arrayOfGuestUniqueIds) {
    //TODO: Also remove guest from data model before removing from table.
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestId = arrayOfGuestUniqueIds[i];
        var rowId = "guest-" + guestId;
        deleteRowFromDisplay(rowId);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedGuestId.length);
}

function checkInAllSelectedGuests(arrayOfGuestUniqueIds) {
    var checkedInString = "Checked in";
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestId = arrayOfGuestUniqueIds[i];
        mapOfGuests[guestId][2] = checkedInString;
    }

    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestId = arrayOfGuestUniqueIds[i];
        var rowId = "guest-" + guestId;
        var textSelector = "#" + rowId + " .status";
        $(textSelector).html(checkedInString);
        temporarilyHighlightText(textSelector);
        // temporarilyHighlightRow(rowId);
    }
}

function checkOutAllSelectedGuests(arrayOfGuestUniqueIds) {
    var checkedOutString = "Checked out";
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestId = arrayOfGuestUniqueIds[i];
        mapOfGuests[guestId][2] = checkedOutString;
    }
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestId = arrayOfGuestUniqueIds[i];
        var rowId = "guest-" + guestId;
        var textSelector = "#" + rowId + " .status";
        $(textSelector).html(checkedOutString);
        temporarilyHighlightText(textSelector);
        deleteRowFromDisplay(rowId);
    }
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
    var guestUniqueId = getGuestDetailsFromForm();
    if(guestUniqueId == -1) {
        // Todo: implement more specific error message
        alert("please enter all required details in the right format.");
        return;
    }
    isEditing = false;
    addGuestDetailsToList(guestUniqueId, true);
    clearGuestDetailsForm();
    showOrHideListOptions(selectedGuestId.length);
}

function addGuestDetailsToList(guestUniqueId, highlightRow){
    var guest = mapOfGuests[guestUniqueId];
    if(guest[2] == "Checked out") {
        return;
    }
    var rowId = "guest-" + guestUniqueId;
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
    var guestUniqueId = getNextGuestUniqueId();
    var guestDetails = [guestName, checkIn, status, duration, daysLeft, guestNote, guestId];
    mapOfGuests[guestUniqueId] = guestDetails;
    var residentToGuestMapEntry = mapOfResidentsToGuests[selectedResidentId];
    if(residentToGuestMapEntry) {
        residentToGuestMapEntry.push(guestId);
    } else {
        mapOfResidentsToGuests[selectedResidentId] = [guestUniqueId];
    }
    return guestUniqueId;
}

function hideDaysLeft() {
    $("#daysLeftFormField").hide();
}

function showGuestDetailsForEditing(guestUniqueId) {
    isEditing = true;
    var guest = mapOfGuests[guestUniqueId];
    $("#top-panel #guestName").val(guest[0]);
    $("#top-panel #checkIn").val(guest[1]);
    setDropdown(guest[2]);
    $("#top-panel #duration").val(guest[3]);
    $("#top-panel #daysLeft").val(guest[4]);
    $("#top-panel #guestNote").val(guest[5]);
    $("#clearForm").show();
    $("#saveNewGuest").show();
}

function getGuestUniqueId(rowId) {
    return rowId.split("guest-")[1];
}

function getGuestRowId(residentId) {
    return "guest-" + residentId;
}

$(document).ready(function(){

    $("#myTab a").click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });

    $("#residentsTab").click(function(e){
        setupResidentList();
        selectedTab = "Residents";
        document.getElementById("searchInput").placeholder="Search by Name or Room Number";
    });

    $("#guestListTab").click(function(e){
        setupGuestsList();
        selectedTab = "Guests";
        document.getElementById("searchInput").placeholder="Search by Name or Status";
    });

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
                removedId = true;
            }
        }
        if(!removedId){
            selectedGuestId.push(guestId);    
            highlightRow(rowId);
        }
        showOrHideListOptions(selectedGuestId.length);
    });

});