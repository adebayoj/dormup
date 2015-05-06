var selectedguestUniqueIdList = [];
var selectedTabGuest = -1;
var selectedTab = "Residents";

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
            addGuestToTabList(r);
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
                    addGuestToTabList(r);
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
                    addGuestToTabList(r);
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

function addGuestToTabList(guestUniqueId) {
    var guests = mapOfGuests[guestUniqueId];
    var rowId = getTabGuestRowId(guestUniqueId);
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
    selectedguestUniqueIdList = [];
    $("#tableList").empty();
    var arrayOfGuestUniqueIds = mapOfResidentsToGuests[residentId];
    if(arrayOfGuestUniqueIds) {
        for(var i = 0; i < arrayOfGuestUniqueIds.length; i++) {
            guestUniqueId = arrayOfGuestUniqueIds[i];
            addGuestDetailsToList(guestUniqueId, false);
        }    
    }
    showOrHideListOptions(selectedguestUniqueIdList.length);
    deselectTheSelectAllCheckBox();
    showRightSidebar();
    setTableListMaxHeight();
    $("#guestName").focus();
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
    for(var i = 0; i < selectedguestUniqueIdList.length; i++) {
        if(selectedguestUniqueIdList[i] == guestUniqueId) {
            return true;
        }
    }
    return false;
}

function deleteAllSelectedGuests(arrayOfGuestUniqueIds) {
    //TODO: Also remove guest from data model before removing from table.
    for (i=0; i<Object.keys(mapOfResidents).length; i++){
        if ((mapOfResidents[i][0] + " " + mapOfResidents[i][1]) == $("#residentName").val() && mapOfResidents[i][2] == $("#room").val()){
            residentId = i;
        }
    }
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        delete mapOfGuests[arrayOfGuestUniqueIds[i]];
        for (k=0; k<mapOfResidentsToGuests[residentId].length; k++){
            if (mapOfResidentsToGuests[residentId][k] == arrayOfGuestUniqueIds[i]){
                mapOfResidentsToGuests[residentId].splice(k,1);
            }
        }
        var guestUniqueId = arrayOfGuestUniqueIds[i];
        var rowId = "guest-" + guestUniqueId;
        deleteRowFromDisplay(rowId);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedguestUniqueIdList.length);
}

function checkInAllSelectedGuests(arrayOfGuestUniqueIds) {
    var checkedInString = "Checked in";
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestUniqueId = arrayOfGuestUniqueIds[i];
        mapOfGuests[guestUniqueId][2] = checkedInString;
    }

    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestUniqueId = arrayOfGuestUniqueIds[i];
        var rowId = "guest-" + guestUniqueId;
        var textSelector = "#" + rowId + " .status";
        $(textSelector).html(checkedInString);
        temporarilyHighlightText(textSelector);
        // temporarilyHighlightRow(rowId);
    }
}

function checkOutAllSelectedGuests(arrayOfGuestUniqueIds) {
    var checkedOutString = "Checked out";
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestUniqueId = arrayOfGuestUniqueIds[i];
        mapOfGuests[guestUniqueId][2] = checkedOutString;
    }
    for(var i = 0; i < arrayOfGuestUniqueIds.length; i++){
        var guestUniqueId = arrayOfGuestUniqueIds[i];
        var rowId = "guest-" + guestUniqueId;
        var textSelector = "#" + rowId + " .status";
        $(textSelector).html(checkedOutString);
        temporarilyHighlightText(textSelector);
        deleteRowFromDisplay(rowId);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedguestUniqueIdList.length);
}

function clearAllTableSelections() {
    selectedguestUniqueIdList = [];
}

function clearGuestDetailsForm() {
    $("#top-panel input").not("#residentName").not("#room").val("");
    $("#top-panel textarea").val("");
    setDropdown("Not Arrived");
    $("#guestName").focus();
}

function showFormForNewGuest() {
    $("#clearForm").show();
    $("#saveNewGuest").show();
    clearGuestDetailsForm();
}

function saveNewGuestFromForm() {
    if(isEditing) {
        deleteAllSelectedGuests(selectedguestUniqueIdList);
    }
    var guestUniqueId = getGuestDetailsFromForm();
    if(guestUniqueId == -1) {
        alert("please enter all required details in the right format.");
        return;
    }
    isEditing = false;
    addGuestDetailsToList(guestUniqueId, true);
    clearGuestDetailsForm();
    showOrHideListOptions(selectedguestUniqueIdList.length);
    if (selectedTab == "Guests"){
        addGuestToTabList(guestUniqueId);
    }
}

function addGuestDetailsToList(guestUniqueId, highlightRow){
    var guest = mapOfGuests[guestUniqueId];
    if(guest[2] == "Checked out") {
        return;
    }
    var rowId = "guest-" + guestUniqueId;
    var checkboxId = getCheckboxId(guestUniqueId);
    $("#tableList").prepend(
        '<div class="row" id="' + rowId + '" style="display:none">' +
            '<div class="col-sm-1"><input type="checkbox" name="guest-checkbox" id=' + checkboxId + '></div>' +
            '<div class="col-sm-3"><p>' + guest[0] + '</p></div>' +
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
    var guestDetails = [guestName, checkIn, status, duration, daysLeft, guestNote, guestUniqueId];
    mapOfGuests[guestUniqueId] = guestDetails;
    var residentToGuestMapEntry = mapOfResidentsToGuests[selectedResidentId];
    if(residentToGuestMapEntry) {
        residentToGuestMapEntry.push(guestUniqueId);
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

function getTabGuestUniqueId(rowId) {
    return rowId.split("tab-guest-")[1];
}

function getGuestRowId(guestUniqueId) {
    return "guest-" + guestUniqueId;
}

function getTabGuestRowId(guestUniqueId) {
    return "tab-guest-" + guestUniqueId;
}

function getCheckboxId(guestUniqueId) {
    return "guest-checkbox-" + guestUniqueId;
}

function getGuestUniqueIdFromCheckboxId(checkboxId) {
    return checkboxId.split("guest-checkbox-")[1];   
}

function selectGuest(guestUniqueId) {
    selectedguestUniqueIdList.push(guestUniqueId);
    var checkboxId = getCheckboxId(guestUniqueId);
    $("#" + checkboxId).prop('checked', true);
    highlightRow(getGuestRowId(guestUniqueId));
}

function deselectGuest(guestUniqueId) {
    if(selectedguestUniqueIdList.length != 0) {
        for(var i = 0; i < selectedguestUniqueIdList.length; i++) {
            if(selectedguestUniqueIdList[i] == guestUniqueId) {
                // This is a faster way to delete item from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedguestUniqueIdList[i] = selectedguestUniqueIdList[selectedguestUniqueIdList.length - 1];
                selectedguestUniqueIdList.pop();
            }
        }
    }
    var checkboxId = getCheckboxId(guestUniqueId);
    $("#" + checkboxId).prop('checked', false);
    removeRowHighlight(getGuestRowId(guestUniqueId));
}

function selectTabGuest(guestUniqueId) {
    selectedTabGuest = guestUniqueId;
    highlightRow(getTabGuestRowId(guestUniqueId));
}

function deselectTabGuest(guestUniqueId) {
    selectedTabGuest = -1;
    removeRowHighlight(getTabGuestRowId(guestUniqueId));
}

function deselectTheSelectAllCheckBox() {
    $("#guest-select-all").prop('checked', false);
}

$(document).ready(function(){
    setupResidentList();
    hideRightSidebar();

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
        showGuestDetailsForEditing(selectedguestUniqueIdList[0]); 
    });

    $("#table-menu #guestListCheckIn").click(function(){
        checkInAllSelectedGuests(selectedguestUniqueIdList); 
    });

    $("#table-menu #guestListCheckOut").click(function(){
        checkOutAllSelectedGuests(selectedguestUniqueIdList); 
    });

    $("#table-menu #guestListDelete").click(function(){
        deleteAllSelectedGuests(selectedguestUniqueIdList); 
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
        var guestUniqueId = getGuestUniqueId(rowId);
        if(isSelected(guestUniqueId)) {
            deselectGuest(guestUniqueId);
        } else {
            selectGuest(guestUniqueId);
        }
        showOrHideListOptions(selectedguestUniqueIdList.length);
    });

    $("#guest-select-all").click(function(event){
        selectedguestUniqueIdList = [];
        var isChecked = this.checked;
        $('input[name="guest-checkbox"]').each(function() {
            var checkboxId = $(this).attr("id");
            var guestUniqueId = getGuestUniqueIdFromCheckboxId(checkboxId);
            if(isChecked) {
                selectGuest(guestUniqueId);    
            } else {
                deselectGuest(guestUniqueId);
            }
            
        });
        showOrHideListOptions(selectedguestUniqueIdList.length);
    });

});