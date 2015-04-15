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


    // ********** Guest List **********
    var mapOfResidents = {
        0:["Konstantinos","Mentzelos",205,0],
        1:["Julius","Adebayo",118,1],
        2:["Cecilia","Pacheco",304,2],
        3:["Athina","Lentza",121,3]
    };

    var mapOfGuests = {
        // Name, check-in date (yyyy-mm-dd), status, duration, days left, note  
        0:["Nate Smith","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",0],
        1:["Andrew Carnegie","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",1],
        2:["Mike Tyson","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",2],
        3:["Sandra Johnson","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",3],
    };

    var mapOfResidentsToGuests = {
        0:[0,1,2],
        1:[3]
    };

    var nextGuestId = 4;

    var selectedGuestId = [];

    var selectedResidentId = -1;

    var isEditing = false;

    setupResidentList();

    hideRightSidebar();

    $('#guestStatusDropdown li a').click(function(){
        setDropdown($(this).text());
    });
    

    $("#guest-form-options #clearForm").click(function(){
        clearGuestDetailsForm();        
    });

    $("#guest-form-options #saveNewGuest").click(function(){
        saveNewGuestFromForm();      
    });

    $('#residentList').on('mouseover', '.row', function() {
        $(this).css("background-color", "#BBDEFB");
        $(this).find("*").css("background-color", "#BBDEFB");
    });

    $('#residentList').on('mouseout', '.row', function() {
        $(this).css("background-color", "white");
        $(this).find("*").css("background-color", "white");
    });

    $('#guestList').on('mouseover', '.row', function() {
        highlightRow($(this).attr("id"));
    });

    $('#guestList').on('mouseout', '.row', function() {
        var rowId = $(this).attr("id");
        var guestId = getGuestId(rowId);
        if(!isSelected(guestId)) {
            removeRowHighlight(rowId);
        }
    });

    $('#residentList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var residentId = getResidentId(rowId);
        setupRightSidebar(residentId);
    });

    $('#guestList').on('click', '.row', function() {
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
        if(selectedResidentId != -1) {
            unselectResident(residentId);
        }
        selectResident(residentId);
        displayResidentProfile(residentId);
        clearGuestDetailsForm();
        selectedGuestId = [];
        $("#guestList").empty();
        var arrayOfGuestIds = mapOfResidentsToGuests[residentId];
        if(arrayOfGuestIds) {
            for(var i = 0; i < arrayOfGuestIds.length; i++) {
                guestId = arrayOfGuestIds[i];
                addGuestDetailsToList(guestId);
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

    function isSelected(guestId) {
        for(var i = 0; i < selectedGuestId.length; i++) {
            if(selectedGuestId[i] == guestId) {
                return true;
            }
        }
        return false;
    }

    function getGuestId(rowId) {
        return rowId.split("guest-")[1];
    }

    function getResidentId(rowId) {
        return rowId.split("resident-")[1];
    }

    function getResidentRowId(residentId) {
        return "resident-" + residentId;
    }

    function getGuestRowId(residentId) {
        return "guest-" + residentId;
    }

    function showOrHideListOptions() {
        var selections = selectedGuestId.length;
        if(selections == 0) {
            $("#guest-list-options .singleSelection").slideUp();
            $("#guest-list-options .multiSelection").slideUp();
        } else if (selections == 1) {
            $("#guest-list-options .singleSelection").slideDown();
            $("#guest-list-options .multiSelection").slideDown();
        } else if (selections > 1){
            $("#guest-list-options .singleSelection").slideUp();
            $("#guest-list-options .multiSelection").show();
        } else {
            alert("Invalid selection count: " + selections);
        }

    }

    $("#guest-list-options #guestListNewFormBtn").click(function(){
        showFormForNewGuest();
        $("#guest-details").slideDown();      
    });

    $("#guest-list-options #guestListEdit").click(function(){
        showGuestDetailsForEditing(selectedGuestId[0]); 
    });

    $("#guest-list-options #guestListCheckIn").click(function(){
        checkInAllSelectedGuests(selectedGuestId); 
    });

    $("#guest-list-options #guestListCheckOut").click(function(){
        checkOutAllSelectedGuests(selectedGuestId); 
    });

    $("#guest-list-options #guestListDelete").click(function(){
        deleteAllSelectedGuests(selectedGuestId); 
    });

    function deleteAllSelectedGuests(arrayOfGuestIds) {
        //TODO: Also remove guest from data model before removing from table.
        for(var i = 0; i < arrayOfGuestIds.length; i++){
            var guestId = arrayOfGuestIds[i];
            var rowId = "guest-" + guestId;
            deleteRowFromDisplay(rowId);
            console.log(arrayOfGuestIds);
        }
        clearAllTableSelections();
        showOrHideListOptions();
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
        showOrHideListOptions();
    }

    function clearAllTableSelections() {
        selectedGuestId = [];
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
        console.log("row id dfd =" + rowId);
        $("#" + rowId).slideUp();
    }

    function clearGuestDetailsForm() {
        $("#guest-details input").val("");
        $("#guest-details textarea").val("");
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
            alert("please enter all required details.");
            return;
        }
        isEditing = false;
        addGuestDetailsToList(guestId);
        // addDummyGuestDetailsTolist();
        clearGuestDetailsForm();
        showOrHideListOptions();
    }

    function addGuestDetailsToList(guestId){
        var guest = mapOfGuests[guestId];
        if(guest[2] == "Checked out") {
            return;
        }
        var rowId = "guest-" + guestId;
        $("#guestList").prepend(
            '<div class="row" id="' + rowId + '" style="display:none">' +
                '<div class="col-sm-3 col-sm-offset-1"><p>' + guest[0] + '</p></div>' +
                '<div class="col-sm-3"><p class="status">' + guest[2] + '</p></div>' +
                '<div class="col-sm-3"><p>' + guest[1] + '</p></div>' +
                '<div class="col-sm-2"><p>' + guest[3] + '</p></div>' +
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

    function showGuestDetailsForEditing(guestId) {
        isEditing = true;
        var guest = mapOfGuests[guestId];
        $("#guest-details #guestName").val(guest[0]);
        $("#guest-details #checkIn").val(guest[1]);
        setDropdown(guest[2]);
        $("#guest-details #duration").val(guest[3]);
        $("#guest-details #daysLeft").val(guest[4]);
        $("#guest-details #guestNote").val(guest[5]);
        $("#clearForm").show();
        $("#saveNewGuest").show();
    }

    // function addDummyGuestDetailsTolist(){
    //     // $("#guestList").prepend('<p>hello</p>');
    //     $("#guestList").prepend(
    //         '<div class="row">' +
    //             '<div class="col-sm-3 col-sm-offset-1"><p>Peter Pan</p></div>' +
    //             '<div class="col-sm-3"><p>Checked in</p></div>' +
    //             '<div class="col-sm-3"><p>04/18/2015</p></div>' +
    //             '<div class="col-sm-2"><p>5</p></div>' +
    //         '</div>');
    // }

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

    // ********** End of Guest List **********


  //   // ********************* Item List ****************


// ************************* Item List ******************



    
});