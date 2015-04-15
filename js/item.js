/* Insert JavaScript here */

function startTime() {
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    m = checkTime(m);
    document.getElementById('clock').innerHTML = h+":"+m;
    var t = setTimeout(function(){startTime()},30000);
}

function checkTime(i) {
    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}


$(document).ready(function(){

    $("#homePageContainer #btnPackage").click(function() {
        window.location = "package.html";
    });

    $("#homePageContainer #btnItem").click(function() {
        window.location = "item.html";
    });

    $("#homePageContainer #btnGuest").click(function() {
        window.location = "guest.html";
    });


    // ********** Item List **********
    var mapOfResidents = {
        0:["Konstantinos","Mentzelos",205,0],
        1:["Julius","Adebayo",118,1],
        2:["Cecilia","Pacheco",304,2],
        3:["Athina","Lentza",121,3]
    };

    var mapOfItems = {
      // Name, return date (yyyy-mm-dd), ID, note
        0:["Movie - Titanic","2015-04-25",00123, "Broken case",0],
        1:["Spare key","2015-04-18", 00012, "", 1],
        2:["Movie - Starwars 1", "2015-04-20", 00145, "", 2],
        3:["Vacuum cleaner", "2015-04-18", 00139, "", 3],
    }

    var mapOfResidentsToItems = {
        0:[0,1,2],
        1:[3]
    };

    var selectedItemId = [];

    var selectedResidentId = -1;

    var isEditing = false;

    setupResidentList();

    hideRightSidebar();

    $("#item-form-options #clearForm").click(function(){
        clearItemDetailsForm();        
    });

    $("#item-form-options #saveNewItem").click(function(){
        saveNewItemFromForm();      
    });

    $('#residentList').on('mouseover', '.row', function() {
        $(this).css("background-color", "#BBDEFB");
        $(this).find("*").css("background-color", "#BBDEFB");
    });

    $('#residentList').on('mouseout', '.row', function() {
        $(this).css("background-color", "white");
        $(this).find("*").css("background-color", "white");
    });

    $('#itemList').on('mouseover', '.row', function() {
        highlightRow($(this).attr("id"));
    });

    $('#itemList').on('mouseout', '.row', function() {
        var rowId = $(this).attr("id");
        var itemId = getItemId(rowId);
        if(!isSelected(itemId)) {
            removeRowHighlight(rowId);
        }
    });

    $('#residentList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var residentId = getResidentId(rowId);
        setupRightSidebar(residentId);
    });

    $('#itemList').on('click', '.row', function() {
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
        showOrHideListOptions();
    });

    function hideRightSidebar() {
        $(".rightSidebar").hide();
    }

    function showRightSidebar() {
        $(".rightSidebar").slideDown();   
    }

    function setupResidentList() {
        $("#residentList").empty();
        for (var r in mapOfResidents) {
            if (!mapOfResidents.hasOwnProperty(r)) { // Ensure we're only using fields we added.
                continue;
            }
            addResidentToList(r);
        }
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
        if(selectedResidentId != -1) {
            unselectResident(residentId);
        }
        selectResident(residentId);
        displayResidentProfile(residentId);
        clearItemDetailsForm();
        selectedItemId = [];
        $("#itemList").empty();
        var arrayOfItemIds = mapOfResidentsToItems[residentId];
        if(arrayOfItemIds) {
            for(var i = 0; i < arrayOfItemIds.length; i++) {
                itemUniqueId = arrayOfItemIds[i];
                addItemDetailsToList(itemUniqueId);
            }    
        }
        showOrHideListOptions();
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

    function unselectResident(residentId) {
        selectedResidentId = -1;
        removeRowHighlight(getResidentRowId(residentId));
    }

    function selectResident(residentId) {
        selectedResidentId = residentId;
        highlightRow(getResidentRowId(residentId));
    }

    function highlightRow(rowId) {
        var selector = "#" + rowId;
        $(selector).css("background-color", "#BBDEFB");
        $(selector).find("*").css("background-color", "#BBDEFB");
    }

    function removeRowHighlight(rowId) {
        var selector = "#" + rowId;
        $(selector).css("background-color", "white");
        $(selector).find("*").css("background-color", "white");
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

    function getResidentRowId(residentId) {
        return "resident-" + residentId;
    }

    function getGuestRowId(residentId) {
        return "item-" + residentId;
    }

    function showOrHideListOptions() {
        var selections = selectedItemId.length;
        if(selections == 0) {
            $("#item-list-options .singleSelection").slideUp();
            $("#item-list-options .multiSelection").slideUp();
        } else if (selections == 1) {
            $("#item-list-options .singleSelection").slideDown();
            $("#item-list-options .multiSelection").slideDown();
        } else if (selections > 1){
            $("#item-list-options .singleSelection").slideUp();
            $("#item-list-options .multiSelection").show();
        } else {
            alert("Invalid selection count: " + selections);
        }

    }

    $("#item-list-options #itemListNewFormBtn").click(function(){
        showFormForNewItem();
        $("#item-details").slideDown();      
    });

    $("#item-list-options #itemListEdit").click(function(){
        showItemDetailsForEditing(selectedItemId[0]); 
    });

    $("#item-list-options #itemListReturn").click(function(){
        returnAllSelectedItems(selectedItemId); 
    });

    $("#item-list-options #itemListDelete").click(function(){
        deleteAllSelectedItems(selectedItemId); 
    });

    function deleteAllSelectedItems(arrayOfItemIds) {
        //TODO: Also remove item from data model before removing from table.
        for(var i = 0; i < arrayOfItemIds.length; i++){
            var itemId = arrayOfItemIds[i];
            var rowId = "item-" + itemId;
            deleteRowFromDisplay(rowId);
            console.log(arrayOfItemIds);
        }
        clearAllTableSelections();
        showOrHideListOptions();
    }

    function returnAllSelectedItems(arrayOfItemIds) {
        //TODO: fix this if we implement event log
        deleteAllSelectedItems(arrayOfItemIds);
    }

    function clearAllTableSelections() {
        selectedItemId = [];
    }

    function temporarilyHighlightText(textSelector) {
        $(textSelector).css("font-weight", "bold");
        setTimeout(function(){
            $(textSelector).css("font-weight", "normal");
        }, 2000);
    }

    function temporarilyHighlightRow(rowId) {
        var selector = "#" + rowId;
        var initialBackgroundColor = $(selector).css("background-color");
        $(selector).css("background-color", "#FFECB3");
        $(selector).find("*").css("background-color", "#FFECB3");
        setTimeout(function(){
            $(selector).css("background-color", initialBackgroundColor);
        $(selector).find("*").css("background-color", initialBackgroundColor);
        }, 2000);
    }

    function deleteRowFromDisplay(rowId) {
        $("#" + rowId).slideUp();
    }

    function clearItemDetailsForm() {
        $("#item-details input").val("");
        $("#item-details textarea").val("");
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
        addItemDetailsToList(itemUniqueId);
        // addDummyGuestDetailsTolist();
        clearItemDetailsForm();
        showOrHideListOptions();
    }

    function addItemDetailsToList(itemId){
        var item = mapOfItems[itemId];
        var rowId = "item-" + itemId;
        $("#itemList").prepend(
            '<div class="row" id="' + rowId + '" style="display:none">' +
                '<div class="col-sm-3 col-sm-offset-1"><p>' + item[0] + '</p></div>' +
                '<div class="col-sm-3"><p>' + item[2] + '</p></div>' +
                '<div class="col-sm-3"><p>' + item[1] + '</p></div>' +
            '</div>');
        $("#" + rowId).slideDown();
        temporarilyHighlightRow(rowId);
    }

    function addResidentToList(residentId) {
        var resident = mapOfResidents[residentId];
        var rowId = getResidentRowId(residentId);
        $("#residentList").append(
            '<div class="row" id="' + rowId + '">' +
                '<div class="col-sm-8"><p>' + resident[0] + " " + resident[1] + '</p></div>' +
                '<div class="col-sm-4"><p>' + resident[2] + '</p></div>' +
            '</div>');
    }

    function showItemDetailsForEditing(itemUniqueId) {
        isEditing = true;
        var item = mapOfItems[itemUniqueId];
        $("#item-details #itemName").val(item[0]);
        $("#item-details #returnDate").val(item[1]);
        $("#item-details #itemId").val(item[2]);
        $("#item-details #note").val(item[3]);
        $("#clearForm").show();
        $("#saveNewItem").show();
    }

    // function addDummyGuestDetailsTolist(){
    //     // $("#itemList").prepend('<p>hello</p>');
    //     $("#itemList").prepend(
    //         '<div class="row">' +
    //             '<div class="col-sm-3 col-sm-offset-1"><p>Peter Pan</p></div>' +
    //             '<div class="col-sm-3"><p>Checked in</p></div>' +
    //             '<div class="col-sm-3"><p>04/18/2015</p></div>' +
    //             '<div class="col-sm-2"><p>5</p></div>' +
    //         '</div>');
    // }

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

    // ********** End of Item List **********



    
});