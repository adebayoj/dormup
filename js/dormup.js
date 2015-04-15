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

    $("#btnPackage").click(function() {
        window.location = "package.html";
    });


    // ********** Guest List **********
    var selectedGuestID = [];

    //TODO: Set Resident ID when the resident is selected
    var residentId = 2;
    //TODO: Guest list should only show the guests of the selected resident.

    setDropdown("Not Arrived");
    showOrHideListOptions();

    $('#guestStatusDropdown li a').click(function(){
        setDropdown($(this).text());
    });
    

    $("#guest-form-options #clearForm").click(function(){
        clearGuestDetailsForm();        
    });

    $("#guest-form-options #saveNewGuest").click(function(){
        saveNewGuestFromForm();      
    });

    $("#guestList .row").mouseover(function(){
        highlightRow($(this).attr("id"));
    });

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

    $("#guestList .row").mouseout(function(){
        var rowId = $(this).attr("id");
        var guestId = getGuestId(rowId);
        if(!isSelected(guestId)) {
            removeRowHighlight(rowId);
        }
    });

    function isSelected(guestId) {
        for(var i = 0; i < selectedGuestID.length; i++) {
            if(selectedGuestID[i] == guestId) {
                return true;
            }
        }
        return false;
    }

    $("#guestList .row").click(function(){
        var rowId = $(this).attr("id");
        var guestId = getGuestId(rowId);
        var removedId = false;
        for(var i = 0; i < selectedGuestID.length; i++) {
            if(selectedGuestID[i] == guestId) {
                // This is a faster way to delete item from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedGuestID[i] = selectedGuestID[selectedGuestID.length - 1];
                selectedGuestID.pop();
                removeRowHighlight(rowId);
                console.log(rowId);
                console.log("pop")
                removedId = true;
            }
        }
        if(!removedId){
            selectedGuestID.push(guestId);    
            highlightRow(rowId);
            console.log(rowId);
                console.log("push")
        }
        showOrHideListOptions();
    });

    function getGuestId(rowId) {
        return rowId.split("guest-")[1];
    }

    function showOrHideListOptions() {
        var selections = selectedGuestID.length;
        if(selections == 0) {
            $("#guest-list-options .singleSelection").hide();
            $("#guest-list-options .multiSelection").hide();
        } else if (selections == 1) {
            $("#guest-list-options .singleSelection").show();
            $("#guest-list-options .multiSelection").show();
        } else if (selections > 1){
            $("#guest-list-options .singleSelection").hide();
            $("#guest-list-options .multiSelection").show();
        } else {
            alert("Invalid selection count: " + selections);
        }

    }

    $("#guest-list-options #guestListNewFormBtn").click(function(){
        showFormForNewGuest();      
    });

    $("#guest-list-options #guestListEdit").click(function(){
        showGuestDetailsForEditing(selectedGuestID[0]); 
    });

    $("#guest-list-options #guestListCheckIn").click(function(){
        checkInAllSelectedGuests(selectedGuestID); 
    });

    $("#guest-list-options #guestListCheckOut").click(function(){
        checkOutAllSelectedGuests(selectedGuestID); 
    });

    $("#guest-list-options #guestListDelete").click(function(){
        deleteAllSelectedGuests(selectedGuestID); 
    });

    function deleteAllSelectedGuests(arrayOfGuestIds) {
        //TODO: Also remove guest from data model before removing from table.
        for(var i = 0; i < arrayOfGuestIds.length; i++){
            var guestId = arrayOfGuestIds[i];
            var rowId = "guest-" + guestId;
            deleteRowFromDisplay(rowId);
        }
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
            // temporarilyHighlightRow(rowId);
            deleteRowFromDisplay(rowId);
        }
    }

    function temporarilyHighlightText(textSelector) {
        $(textSelector).css("font-weight", "bold");
        setTimeout(function(){
            $(textSelector).css("font-weight", "normal");
        }, 1000);
    }

    function temporarilyHighlightRow(rowId) {
        var selector = "#" + rowId;
        var initialBackgroundColor = $(selector).css("background-color");
        $(selector).css("background-color", "#FFECB3");
        $(selector).find("*").css("background-color", "#FFECB3");
        setTimeout(function(){
            $(selector).css("background-color", initialBackgroundColor);
        $(selector).find("*").css("background-color", initialBackgroundColor);
        }, 1000);
    }

    function deleteRowFromDisplay(rowId) {
        $("#" + rowId).slideUp();
    }

    function clearGuestDetailsForm() {
        // $('#guestStatusDropdown li a')[0].click(); // Select first option
        setDropdown("Not Arrived");
        $("#guest-details input").val("");
    }

    function showFormForNewGuest() {
        $("#clearForm").show();
        $("#saveNewGuest").show();
        clearGuestDetailsForm();
    }

    function saveNewGuestFromForm() {
        var guestId = getGuestDetailsFromForm();
        if(guestId == -1) {
            // Todo: implement error handling logic
        }
        
        // addGuestDetailsToList(guestId);
        addDummyGuestDetailsTolist();
        clearGuestDetailsForm();
    }

    function addGuestDetailsToList(guestId){
        var guest = mapOfGuests[guestId];
        $("#guestList").prepend(
            '<div class="row">' +
                '<div class="col-sm-3 col-sm-offset-1"><p>' + guest[0] + '</p></div>' +
                '<div class="col-sm-3"><p>' + guest[2] + '</p></div>' +
                '<div class="col-sm-3"><p>' + guest[1] + '</p></div>' +
                '<div class="col-sm-2"><p>' + guest[3] + '</p></div>' +
            '</div>');
    }

    function showGuestDetailsForEditing(guestId) {
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

    function addDummyGuestDetailsTolist(){
        // $("#guestList").prepend('<p>hello</p>');
        $("#guestList").prepend(
            '<div class="row">' +
                '<div class="col-sm-3 col-sm-offset-1"><p>Peter Pan</p></div>' +
                '<div class="col-sm-3"><p>Checked in</p></div>' +
                '<div class="col-sm-3"><p>04/18/2015</p></div>' +
                '<div class="col-sm-2"><p>5</p></div>' +
            '</div>');
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
        var guestId = nextGuestId++;
        var guestDetails = [guestName, checkIn, status, duration, daysLeft, guestNote, guestId];
        mapOfGuests[guestId] = guestDetails;
        var residentToGuestMapEntry = mapOfResidentsToGuests[residentId];
        if(residentToGuestMapEntry) {
            residentToGuestMapEntry.push(guestId);
        } else {
            mapOfResidentsToGuests[residentId] = [guestId];
        }
        return guestId;
    }

    function hideDaysLeft() {
        $("#daysLeftFormField").hide();
    }

    var mapOfResidents = {
        0:["Konstantinos","Mentzelos",205,0],
        1:["Julius","Adebayo",118,1],
        2:["Cecilia","Pacheco",304,2],
        3:["Athina","Lentza",121,3]
    };

    var mapOfGuests = {
        // Name, check-in date (yyyy-mm-dd), status, duration, days left, note  
        0:["Nate","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",0],
        1:["Nate","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",1],
        2:["Nate","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",2],
        3:["Nate","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",3],
    };

    var mapOfResidentsToGuests = {
        0:[0,1,2],
        1:[3]
    };

    var nextGuestId = 4;

    // ********** End of Guest List **********
    
});