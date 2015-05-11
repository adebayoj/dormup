var selectedItemIdList = [];
var selectedTabItem = -1;
var selectedTab = "Residents";
var itemAutocomplete;

function isInItemInfo(itemMapID, singleString){
    var itemInfo=mapOfItems[itemMapID];
    var stringForSearch=singleString.toLowerCase();
    if (itemInfo[0].toLowerCase().indexOf(stringForSearch)>=0 || itemInfo[1].toLowerCase().indexOf(stringForSearch)>=0){
        return true;
    }
    return false;
}

function setupItemsList(searchStr) {
    $("#firstColumn").html("Description");
    $("#secondColumn").html("Return Date");
    $("#residentList").empty();
    if (searchStr === undefined || searchStr.length==0){
        for (var r in mapOfItems) {
            if (!mapOfItems.hasOwnProperty(r)) {
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
                if (!mapOfItems.hasOwnProperty(r)) {
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
                if (!mapOfItems.hasOwnProperty(r)) {
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
    setTableListMaxHeight();
    $("#itemName").focus();
}

function setupRightSidebarForNewItem(itemId) {
    selectedItemIdList = [];
    $("#residentName").val("").prop('disabled', false);
    $("#room").val("").prop('disabled', false);
    $("#itemName").val(mapOfItems[itemId][0]);
    $("#itemId").val(mapOfItems[itemId][2]);
    $("#returnDate").val(mapOfItems[itemId][1]);
    $("#note").val(mapOfItems[itemId][3]);
    $("#tableList").empty();
    showRightSidebar();
    $("#residentName").focus();
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
    var residentId = -1;
    for (i=0; i<Object.keys(mapOfResidents).length; i++){
        if ((mapOfResidents[i][0] + " " + mapOfResidents[i][1]) == $("#residentName").val() && mapOfResidents[i][2] == $("#room").val()){
            residentId = i;
        }
    }
    for(var i = 0; i < arrayOfItemUniqueIds.length; i++){
        mapOfItems[arrayOfItemUniqueIds[i]][1] = "";
        for (k=0; k<mapOfResidentsToItems[residentId].length; k++){
            if (mapOfResidentsToItems[residentId][k] == arrayOfItemUniqueIds[i]){
                mapOfResidentsToItems[residentId].splice(k,1);
            }
        }
        var itemId = arrayOfItemUniqueIds[i];
        var rowId = "item-" + itemId;
        deleteRowFromDisplay(rowId);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedItemIdList.length);
    if (selectedTab == "Items"){
        setupItemsList();
    }
    updateItemAutocomplete();
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
    $("#itemName").focus();
}

function showFormForNewItem() {
    $("#clearForm").show();
    $("#saveNewItem").show();
    clearItemDetailsForm();
}

function saveNewItemFromForm() {
    var check_Item_Availability = false;
    var check_Resident_Availability = false;
    var check_Item_Existence = false;
    for (i=0; i<Object.keys(mapOfItems).length; i++){
        if (mapOfItems[i][0] == $("#itemName").val() && mapOfItems[i][2] == $("#itemId").val()){
            check_Item_Existence = true;
            itemUniqueId = i;
        }
    }
    if (check_Item_Existence == false){
        alert("the item doesn't exist.");
        return;
    }
    if (!isEditing){
        if (mapOfItems[itemUniqueId][1] != ""){
            alert("the item isn't available.");
            return;
        }
    }
    for (i=0; i<Object.keys(mapOfResidents).length; i++){
        if ((mapOfResidents[i][0] + " " + mapOfResidents[i][1]) == $("#residentName").val() && mapOfResidents[i][2] == $("#room").val()){
            check_Resident_Availability = true;
            var residentId = i;
        }
    }
    if (check_Resident_Availability == false){
        alert("the resident doesn't exist.");
        return;
    }
    if ($("#returnDate").val() != ""){
        mapOfItems[itemUniqueId][1] = $("#returnDate").val();
        mapOfItems[itemUniqueId][3] = $("#note").val();
        if (!isEditing){
            var residentToPkgMapEntry = mapOfResidentsToItems[residentId];
            if(residentToPkgMapEntry){
                mapOfResidentsToItems[residentId].push(itemUniqueId);
            }
            else{
                mapOfResidentsToItems[residentId] = [itemUniqueId];
            }
        }
        setupRightSidebar(residentId);
    }
    else{
        alert("please enter all required details in the right format.");
        return;
    }
    isEditing = false;
    if (selectedTab == "Items"){
        setupItemsList();
    }
    updateItemAutocomplete();
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

function updateItemAutocomplete() {
    var checkedoutitems = [];
    var all_items_marked = [];
    for (var m in mapOfResidentsToItems){
        for (var i=0;i<mapOfResidentsToItems[m].length;i++){
            checkedoutitems.push(mapOfResidentsToItems[m][i]);
        }
    } 
    for (var m in mapOfItems){
        var a = checkedoutitems.indexOf(parseInt(m));
        if (a == -1)
        {
            var displayedText = mapOfItems[m][0] + " <" + mapOfItems[m][2] + ">";
            all_items_marked.push(displayedText);
        }
        else
        {
             var displayedText = mapOfItems[m][0] +  " <" + mapOfItems[m][2]  + "> [Unavailable]";
             all_items_marked.push(displayedText);
        }
    }
    if(!itemAutocomplete){
        itemAutocomplete = $('[name=countries]').typeahead({
                            minLength: 1,
                            source: all_items_marked,
                            updater:function(item){
                                var a = item.split(" <");
                                var item_name = a[0];
                                var item_id = a[1].split("> [Unavailable]")[0];
                                $("#itemId").val(item_id);
                                $("#returnDate").focus();
                                return item_name;
                            }
                        });    
    } else {
        itemAutocomplete.data('typeahead').source = all_items_marked;
    }    
}

$(document).ready(function(){
    updateItemAutocomplete();
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

    var residentnameslist = [];
    for (var m in mapOfResidents){
        residentnameslist.push(mapOfResidents[m][0] + " " + mapOfResidents[m][1] + " [room " + 
            mapOfResidents[m][2] + "]");
    } 
  
  $('[name=residents]')
            .typeahead({
                minLength: 1,
                source: residentnameslist,
                updater: function(item) { // http://stackoverflow.com/a/11747290/978369
                    var a = item.split(" [room ");
                    var name = a[0];
                    var b = a[1].split("]");
                    var room = b[0];
                    $("#room").val(room);
                    $("#returnDate").focus();
                    return name;
                }
        });

});