var selectedItemId = [];
var selectedItmId = -1;
var selectedTab = "Residents";

function unselectItem(itemId) {
    selectedItmId = -1;
    removeRowHighlight(getItmRowId(itemId));
}

function selectItem(itemId) {
    selectedItmId = itemId;
    highlightRow(getItmRowId(itemId));
}

function getItmId(rowId) {
    return rowId.split("itm-")[1];
}

function getItmRowId(itemId) {
    return "itm-" + itemId;
}

function isInItemInfo(itemMapID, singleString){
    var itemInfo=mapOfItems[pkgMapID];
    var stringForSearch=singleString.toLowerCase();
    if (itemInfo[0].toString().indexOf(stringForSearch)>=0 || itemInfo[1].toLowerCase().indexOf(stringForSearch)>=0){
        return true
    }
    return false;
}

function setupItemsList(searchStr) {
    $("#firstColumn").html("Description");
    $("#secondColumn").html("Return Date");
    $("#residentList").empty();
    if (searchStr === undefined || searchStr.length==0){
        for (var r in mapOfItems) {
            if (!mapOfItems.hasOwnProperty(r)) { // Ensure we're only using fields we added.
                continue;
            }
            addItemToList(r);
        }
    }
    else{
        var found=false;
        var inputString=searchStr;
        var inputArray=inputString.split(" ");
        if (inputArray.length == 1){
            for (var r in mapOfItems) {
                if (!mapOfItems.hasOwnProperty(r)) { // Ensure we're only using fields we added.
                    continue;
                }
                if (isInItemInfo(r,inputArray[0])){
                    addItemToList(r);
                    found=true;
                }
            }
        }
        else if (inputArray.length==2){
            for (var r in mapOfItems) {
                if (!mapOfItems.hasOwnProperty(r)) { // Ensure we're only using fields we added.
                    continue;
                }
                if (isInItemInfo(r,inputArray[0]) && isInItemInfo(r,inputArray[1])){
                    addItemToList(r);
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

function addItemToList(itemId) {
    var items = mapOfItems[itemId];
    var rowId = getItmRowId(itemId);
    $("#residentList").append(
        '<div class="row" id="' + rowId + '">' +
            '<div class="col-sm-8"><p>' + items[0] + '</p></div>' +
            '<div class="col-sm-4"><p>' + items[1] + '</p></div>' +
        '</div>');
}

function deleteAllSelectedItems(arrayOfItemUniqueIds) {
    //TODO: Also remove item from data model before removing from table.
    for(var i = 0; i < arrayOfItemUniqueIds.length; i++){
        var itemId = arrayOfItemUniqueIds[i];
        var rowId = "item-" + itemId;
        deleteRowFromDisplay(rowId);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedItemId.length);
}

function returnAllSelectedItems(arrayOfItemUniqueIds) {
    //TODO: fix this if we implement event log
    deleteAllSelectedItems(arrayOfItemUniqueIds);
}

function clearAllTableSelections() {
    selectedItemId = [];
}

function clearItemDetailsForm() {
    $("#top-panel input").not("#residentName").not("#room").val("");
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
    clearItemDetailsForm();
    showOrHideListOptions(selectedItemId.length);
}

function addItemDetailsToList(itemUniqueId, highlightRow){
    var item = mapOfItems[itemUniqueId];
    var rowId = "item-" + itemUniqueId;
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
    var itemUniqueId = getNextItemUniqueId();
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

function getNextItemUniqueId() {
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
    var arrayOfItemUniqueIds = mapOfResidentsToItems[residentId];
    if(arrayOfItemUniqueIds) {
        for(var i = 0; i < arrayOfItemUniqueIds.length; i++) {
            itemUniqueId = arrayOfItemUniqueIds[i];
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
    $("#residentName").val(resident[0] + " " + resident[1]).prop('disabled', true);
    $("#room").val(resident[2]).prop('disabled', true);
}

function isSelected(itemUniqueId) {
    for(var i = 0; i < selectedItemId.length; i++) {
        if(selectedItemId[i] == itemUniqueId) {
            return true;
        }
    }
    return false;
}

function getItemUniqueId(rowId) {
    return rowId.split("item-")[1];
}

function getItemRowId(residentId) {
    return "item-" + residentId;
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

    $("#itemListTab").click(function(e){
        setupItemsList();
        selectedTab = "Items";
        document.getElementById("searchInput").placeholder="Search by Description or Return Date";
    });

    $("#item-form-options #clearForm").click(function(){
        clearItemDetailsForm();        
    });

    $("#item-form-options #saveNewItem").click(function(){
        saveNewItemFromForm();      
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
                removedId = true;
            }
        }
        if(!removedId){
            selectedItemId.push(itemId);    
            highlightRow(rowId);
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