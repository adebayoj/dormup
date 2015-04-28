var selectedItemId = [];

function deleteAllSelectedItems(arrayOfItemIds) {
    //TODO: Also remove item from data model before removing from table.
    for(var i = 0; i < arrayOfItemIds.length; i++){
        var itemId = arrayOfItemIds[i];
        var rowId = "item-" + itemId;
        deleteRowFromDisplay(rowId);
        console.log(arrayOfItemIds);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedItemId.length);
}

function returnAllSelectedItems(arrayOfItemIds) {
    //TODO: fix this if we implement event log
    deleteAllSelectedItems(arrayOfItemIds);
}

function clearAllTableSelections() {
    selectedItemId = [];
}

function clearItemDetailsForm() {
    $("#top-panel input").val("");
    $("#top-panel textarea").val("");
}

function showFormForNewItem() {
    $("#clearForm").show();
    $("#saveNewItem").show();
    clearItemDetailsForm();
}

function saveNewItemFromForm() {
    if(isEditing) {
        deleteAllSelectedItems(selectedItemId);
    }
    var itemUniqueId = getItemDetailsFromForm();
    if(itemUniqueId == -1) {
        // Todo: implement more specific error message
        alert("please enter all required details in the right format.");
        return;
    }
    isEditing = false;
    addItemDetailsToList(itemUniqueId, true);
    // addDummyGuestDetailsTolist();
    clearItemDetailsForm();
    showOrHideListOptions(selectedItemId.length);
}

function addItemDetailsToList(itemId, highlightRow){
    var item = mapOfItems[itemId];
    var rowId = "item-" + itemId;
    $("#tableList").prepend(
        '<div class="row" id="' + rowId + '" style="display:none">' +
            '<div class="col-sm-3 col-sm-offset-1"><p>' + item[0] + '</p></div>' +
            '<div class="col-sm-3"><p>' + item[2] + '</p></div>' +
            '<div class="col-sm-3"><p>' + item[1] + '</p></div>' +
        '</div>');
    $("#" + rowId).slideDown();
    if(highlightRow) {
        temporarilyHighlightRow(rowId);
    }
}

function showItemDetailsForEditing(itemUniqueId) {
    isEditing = true;
    var item = mapOfItems[itemUniqueId];
    $("#top-panel #itemName").val(item[0]);
    $("#top-panel #returnDate").val(item[1]);
    $("#top-panel #itemId").val(item[2]);
    $("#top-panel #note").val(item[3]);
    $("#clearForm").show();
    $("#saveNewItem").show();
}

function getItemDetailsFromForm() {
    var itemName = $("#itemName").val();
    var returnDate  = $("#returnDate").val();
    var itemId = $("#itemId").val();
    var note = $("#note").val();
    if(!itemName || !returnDate || !itemId) {
        return -1;
    }
    var itemUniqueId = getNextItemId();
    var itemDetails = [itemName, returnDate, itemId, note, itemUniqueId];
    mapOfItems[itemUniqueId] = itemDetails;
    var residentToItemMapEntry = mapOfResidentsToItems[selectedResidentId];
    if(residentToItemMapEntry) {
        residentToItemMapEntry.push(itemUniqueId);
    } else {
        mapOfResidentsToItems[selectedResidentId] = [itemUniqueId];
    }
    return itemUniqueId;
}

function getNextItemId() {
    var maxId = -1;
    for (var g in mapOfItems) {
        if (!mapOfItems.hasOwnProperty(g)) { // Ensure we're only using fields we added.
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
    clearItemDetailsForm();
    selectedItemId = [];
    $("#tableList").empty();
    var arrayOfItemIds = mapOfResidentsToItems[residentId];
    if(arrayOfItemIds) {
        for(var i = 0; i < arrayOfItemIds.length; i++) {
            itemUniqueId = arrayOfItemIds[i];
            addItemDetailsToList(itemUniqueId, false);
        }    
    }
    showOrHideListOptions(selectedItemId.length);
    showRightSidebar();
}

function displayResidentProfile(residentId) {
    var resident = mapOfResidents[residentId];
    if(!resident) {
        alert("Could not find profile for resident ID: " + residentId);
    }
    var residentHeading = resident[0] + " " + resident[1] + " (Room " + resident[2] + ")";
    $("#residentIdentifier h3").html(residentHeading);
}

function isSelected(itemId) {
    for(var i = 0; i < selectedItemId.length; i++) {
        if(selectedItemId[i] == itemId) {
            return true;
        }
    }
    return false;
}

function getItemId(rowId) {
    return rowId.split("item-")[1];
}

function getResidentId(rowId) {
    return rowId.split("resident-")[1];
}


$(document).ready(function(){    
    $("#item-form-options #clearForm").click(function(){
        clearItemDetailsForm();        
    });

    $("#item-form-options #saveNewItem").click(function(){
        saveNewItemFromForm();      
    });

    $('#tableList').on('mouseover', '.row', function() {
        highlightRow($(this).attr("id"));
    });

    $('#tableList').on('mouseout', '.row', function() {
        var rowId = $(this).attr("id");
        var itemId = getItemId(rowId);
        if(!isSelected(itemId)) {
            removeRowHighlight(rowId);
        }
    });

    $('#tableList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var itemId = getItemId(rowId);
        var removedId = false;
        for(var i = 0; i < selectedItemId.length; i++) {
            if(selectedItemId[i] == itemId) {
                // This is a faster way to delete item from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedItemId[i] = selectedItemId[selectedItemId.length - 1];
                selectedItemId.pop();
                removeRowHighlight(rowId);
                console.log(rowId);
                console.log("pop")
                removedId = true;
            }
        }
        if(!removedId){
            selectedItemId.push(itemId);    
            highlightRow(rowId);
            console.log(rowId);
                console.log("push")
        }
        showOrHideListOptions(selectedItemId.length);
    });

    $("#table-menu #newFormBtn").click(function(){
        showFormForNewItem();
        $("#top-panel").slideDown();      
    });

    $("#table-menu #itemListEdit").click(function(){
        showItemDetailsForEditing(selectedItemId[0]); 
    });

    $("#table-menu #itemListReturn").click(function(){
        returnAllSelectedItems(selectedItemId); 
    });

    $("#table-menu #itemListDelete").click(function(){
        deleteAllSelectedItems(selectedItemId); 
    });    
});