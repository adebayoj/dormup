var selectedItemIdList = [];
var selectedTabItem = -1;
var selectedTab = "Residents";

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
    var rowId = getTabItemRowId(itemId);
    $("#residentList").append(
        '<div class="row" id="' + rowId + '">' +
            '<div class="col-sm-8"><p>' + items[0] + '</p></div>' +
            '<div class="col-sm-4"><p>' + items[1] + '</p></div>' +
        '</div>');
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
    selectedItemIdList = [];
    $("#tableList").empty();
    var arrayOfItemUniqueIds = mapOfResidentsToItems[residentId];
    if(arrayOfItemUniqueIds) {
        for(var i = 0; i < arrayOfItemUniqueIds.length; i++) {
            itemUniqueId = arrayOfItemUniqueIds[i];
            addItemDetailsToList(itemUniqueId, false);
        }    
    }
    showOrHideListOptions(selectedItemIdList.length);
    deselectTheSelectAllCheckBox();
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
    for(var i = 0; i < selectedItemIdList.length; i++) {
        if(selectedItemIdList[i] == itemUniqueId) {
            return true;
        }
    }
    return false;
}

function deleteAllSelectedItems(arrayOfItemUniqueIds) {
    //TODO: Also remove item from data model before removing from table.
    for(var i = 0; i < arrayOfItemUniqueIds.length; i++){
        var itemId = arrayOfItemUniqueIds[i];
        var rowId = "item-" + itemId;
        deleteRowFromDisplay(rowId);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedItemIdList.length);
}

function returnAllSelectedItems(arrayOfItemUniqueIds) {
    //TODO: fix this if we implement event log
    deleteAllSelectedItems(arrayOfItemUniqueIds);
}

function clearAllTableSelections() {
    selectedItemIdList = [];
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
        deleteAllSelectedItems(selectedItemIdList);
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
    showOrHideListOptions(selectedItemIdList.length);
}

function addItemDetailsToList(itemUniqueId, highlightRow){
    var item = mapOfItems[itemUniqueId];
    var rowId = "item-" + itemUniqueId;
    var checkboxId = getCheckboxId(itemUniqueId);
    $("#tableList").prepend(
        '<div class="row" id="' + rowId + '" style="display:none">' +
            '<div class="col-sm-1"><input type="checkbox" name="item-checkbox" id=' + checkboxId + '></div>' +
            '<div class="col-sm-3"><p>' + item[0] + '</p></div>' +
            '<div class="col-sm-3"><p>' + item[2] + '</p></div>' +
            '<div class="col-sm-3"><p>' + item[1] + '</p></div>' +
        '</div>');
    $("#" + rowId).slideDown();
    if(highlightRow) {
        temporarilyHighlightRow(rowId);
    }
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

function getItemUniqueId(rowId) {
    return rowId.split("item-")[1];
}

function getTabItemUniqueId(tabItemRowId) {
    return tabItemRowId.split("tab-item-")[1];
}

function getItemRowId(itemUniqueId) {
    return "item-" + itemUniqueId;
}

function getTabItemRowId(itemUniqueId) {
    return "tab-item-" + itemUniqueId;
}

function getCheckboxId(itemUniqueId) {
    return "item-checkbox-" + itemUniqueId;
}

function getItemUniqueIdFromCheckboxId(checkboxId) {
    return checkboxId.split("item-checkbox-")[1];   
}

function selectItem(itemUniqueId) {
    selectedItemIdList.push(itemUniqueId);
    var checkboxId = getCheckboxId(itemUniqueId);
    $("#" + checkboxId).prop('checked', true);
    highlightRow(getItemRowId(itemUniqueId));
}

function deselectItem(itemUniqueId) {
    if(selectedItemIdList.length != 0) {
        for(var i = 0; i < selectedItemIdList.length; i++) {
            if(selectedItemIdList[i] == itemUniqueId) {
                // This is a faster way to delete item from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedItemIdList[i] = selectedItemIdList[selectedItemIdList.length - 1];
                selectedItemIdList.pop();
            }
        }
    }
    var checkboxId = getCheckboxId(itemUniqueId);
    $("#" + checkboxId).prop('checked', false);
    removeRowHighlight(getItemRowId(itemUniqueId));
}

function selectTabItem(itemUniqueId) {
    selectedTabItem = itemUniqueId;
    highlightRow(getTabItemRowId(itemUniqueId));
}

function deselectTabItem(itemUniqueId) {
    selectedTabItem = -1;
    removeRowHighlight(getTabItemRowId(itemUniqueId));
}

function deselectTheSelectAllCheckBox() {
    $("#item-select-all").prop('checked', false);
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

    $("#table-menu #newFormBtn").click(function(){
        showFormForNewItem();
        $("#top-panel").slideDown();      
    });

    $("#table-menu #itemListEdit").click(function(){
        showItemDetailsForEditing(selectedItemIdList[0]); 
    });

    $("#table-menu #itemListReturn").click(function(){
        returnAllSelectedItems(selectedItemIdList); 
    });

    $("#table-menu #itemListDelete").click(function(){
        deleteAllSelectedItems(selectedItemIdList); 
    });

    $('#tableList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var itemUniqueId = getItemUniqueId(rowId);
        if(isSelected(itemUniqueId)) {
            deselectItem(itemUniqueId);
        } else {
            selectItem(itemUniqueId);
        }
        showOrHideListOptions(selectedItemIdList.length);
    });

    $("#item-select-all").click(function(event){
        selectedItemIdList = [];
        var isChecked = this.checked;
        $('input[name="item-checkbox"]').each(function() {
            var checkboxId = $(this).attr("id");
            var itemUniqueId = getItemUniqueIdFromCheckboxId(checkboxId);
            if(isChecked) {
                selectItem(itemUniqueId);    
            } else {
                deselectItem(itemUniqueId);
            }
            
        });
        showOrHideListOptions(selectedItemIdList.length);
    });
});