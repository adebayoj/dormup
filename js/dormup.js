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
    var selectedGuestId = [];

    //TODO: Set Resident ID when the resident is selected
    var residentId = 2;
    //TODO: Guest list should only show the guests of the selected resident.

    var isEditing = false;

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
        // $('#guestStatusDropdown li a')[0].click(); // Select first option
        setDropdown("Not Arrived");
        $("#guest-details *").val("");
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
            // Todo: implement error handling logic
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

    // ********** End of Guest List **********













  //   // ********************* Item List ****************
  // var selectedItemId = [];

  //   //TODO: Set Resident ID when the resident is selected
  //   var residentId = 2;
  //   //TODO: Guest list should only show the guests of the selected resident.

  //   var isEditingitem = false;

  //   setDropdown("Not Arrived");
  //   showOrHideListOptions();
    

  //   $("#item-form-options #clearForm").click(function(){
  //       clearItemDetailsForm();        
  //   });

  //   $("#guest-form-options #saveNewGuest").click(function(){
  //       saveNewItemFromForm();      
  //   });

  //   $('#residentList').on('mouseover', '.row', function() {
  //       $(this).css("background-color", "#BBDEFB");
  //       $(this).find("*").css("background-color", "#BBDEFB");
  //   });

  //   $('#residentList').on('mouseout', '.row', function() {
  //       $(this).css("background-color", "white");
  //       $(this).find("*").css("background-color", "white");
  //   });

  //   $('#itemList').on('mouseover', '.row', function() {
  //       highlightRow($(this).attr("id"));
  //   });

  //   $('#itemList').on('mouseout', '.row', function() {
  //       var rowId = $(this).attr("id");
  //       var guestId = getGuestId(rowId);
  //       if(!isSelected(guestId)) {
  //           removeRowHighlight(rowId);
  //       }
  //   });

  //   $('#itemList').on('click', '.row', function() {
  //       var rowId = $(this).attr("id");
  //       var guestId = getGuestId(rowId);
  //       var removedId = false;
  //       for(var i = 0; i < selectedGuestId.length; i++) {
  //           if(selectedGuestId[i] == guestId) {
  //               // This is a faster way to delete item from the middle (in JavaScript) when he ordering of the items isn't relevant
  //               selectedGuestId[i] = selectedGuestId[selectedGuestId.length - 1];
  //               selectedGuestId.pop();
  //               removeRowHighlight(rowId);
  //               console.log(rowId);
  //               console.log("pop")
  //               removedId = true;
  //           }
  //       }
  //       if(!removedId){
  //           selectedGuestId.push(guestId);    
  //           highlightRow(rowId);
  //           console.log(rowId);
  //               console.log("push")
  //       }
  //       showOrHideListOptions();
  //   });

  //   function highlightRow(rowId) {
  //       var selector = "#" + rowId;
  //       $(selector).css("background-color", "#BBDEFB");
  //       $(selector).find("*").css("background-color", "#BBDEFB");
  //   }

  //   function removeRowHighlight(rowId) {
  //       var selector = "#" + rowId;
  //       $(selector).css("background-color", "white");
  //       $(selector).find("*").css("background-color", "white");
  //   }

  //   function isSelected(itemId) {
  //       for(var i = 0; i < selectedItemId.length; i++) {
  //           if(selectedItemId[i] == itemId) {
  //               return true;
  //           }
  //       }
  //       return false;
  //   }

  //   function getGuestId(rowId) {
  //       return rowId.split("item-")[1];
  //   }

  //   function showOrHideListOptions() {
  //       var selections = selectedGuestId.length;
  //       if(selections == 0) {
  //           $("#item-list-options .singleSelection").slideUp();
  //           $("#item-list-options .multiSelection").slideUp();
  //       } else if (selections == 1) {
  //           $("#item-list-options .singleSelection").slideDown();
  //           $("#item-list-options .multiSelection").slideDown();
  //       } else if (selections > 1){
  //           $("#item-list-options .singleSelection").slideUp();
  //           $("#item-list-options .multiSelection").show();
  //       } else {
  //           alert("Invalid selection count: " + selections);
  //       }

  //   }

  //   $("#item-list-options #itemListNewFormBtn").click(function(){
  //       showFormForNewItem();
  //       $("#guest-details").slideDown();      
  //   });

  //   $("#item-list-options #itemListEdit").click(function(){
  //       showItemDetailsForEditing(selectedItemId[0]); 
  //   });

  //   $("#item-list-options #itemListCheckIn").click(function(){
  //       checkInAllSelectedItems(selectedItemId); 
  //   });

  //   $("#item-list-options #itemListCheckOut").click(function(){
  //       checkOutAllSelectedItems(selectedItemId); 
  //   });

  //   $("#item-list-options #guestListDelete").click(function(){
  //       deleteAllSelectedItems(selectedItemId); 
  //   });

  //   function deleteAllSelectedItems(arrayOfItemIds) {
  //       //TODO: Also remove guest from data model before removing from table.
  //       for(var i = 0; i < arrayOfItemIds.length; i++){
  //           var guestId = arrayOfItemIds[i];
  //           var rowId = "guest-" + itemId;
  //           deleteRowFromDisplay(rowId);
  //           console.log(arrayOfItemIds);
  //       }
  //       clearAllTableSelections();
  //       showOrHideListOptions();
  //   }

  //   function checkInAllSelectedItems(arrayOfGuestIds) {
  //       var checkedInString = "Checked in";
  //       for(var i = 0; i < arrayOfGuestIds.length; i++){
  //           var guestId = arrayOfGuestIds[i];
  //           mapOfGuests[guestId][2] = checkedInString;
  //       }

  //       for(var i = 0; i < arrayOfGuestIds.length; i++){
  //           var guestId = arrayOfGuestIds[i];
  //           var rowId = "guest-" + guestId;
  //           var textSelector = "#" + rowId + " .status";
  //           $(textSelector).html(checkedInString);
  //           temporarilyHighlightText(textSelector);
  //           // temporarilyHighlightRow(rowId);
  //       }
  //   }

  //   function checkOutAllSelectedGuests(arrayOfGuestIds) {
  //       var checkedOutString = "Checked out";
  //       for(var i = 0; i < arrayOfGuestIds.length; i++){
  //           var guestId = arrayOfGuestIds[i];
  //           mapOfGuests[guestId][2] = checkedOutString;
  //       }
  //       for(var i = 0; i < arrayOfGuestIds.length; i++){
  //           var guestId = arrayOfGuestIds[i];
  //           var rowId = "guest-" + guestId;
  //           var textSelector = "#" + rowId + " .status";
  //           $(textSelector).html(checkedOutString);
  //           temporarilyHighlightText(textSelector);
  //           deleteRowFromDisplay(rowId);
  //       }
  //       console.log(arrayOfGuestIds.length);
  //       clearAllTableSelections();
  //       showOrHideListOptions();
  //   }

  //   function clearAllTableSelections() {
  //       selectedItemId = [];
  //   }

  //   function temporarilyHighlightText(textSelector) {
  //       $(textSelector).css("font-weight", "bold");
  //       setTimeout(function(){
  //           $(textSelector).css("font-weight", "normal");
  //       }, 2000);
  //   }

  //   function temporarilyHighlightRow(rowId) {
  //       var selector = "#" + rowId;
  //       var initialBackgroundColor = $(selector).css("background-color");
  //       $(selector).css("background-color", "#FFECB3");
  //       $(selector).find("*").css("background-color", "#FFECB3");
  //       setTimeout(function(){
  //           $(selector).css("background-color", initialBackgroundColor);
  //       $(selector).find("*").css("background-color", initialBackgroundColor);
  //       }, 2000);
  //   }

  //   function deleteRowFromDisplay(rowId) {
  //       console.log("row id dfd =" + rowId);
  //       $("#" + rowId).slideUp();
  //   }

  //   function clearItemDetailsForm() {
  //       // $('#guestStatusDropdown li a')[0].click(); // Select first option
  //       setDropdown("Not Arrived");
  //       $("#guest-details *").val("");
  //   }

  //   function showFormForNewItem() {
  //       $("#clearForm").show();
  //       $("#saveNewGuest").show();
  //       clearItemDetailsForm();
  //   }

  //   function saveNewItemFromForm() {
  //       if(isEditing) {
  //           deleteAllSelectedGuests(selectedGuestId);
  //       }
  //       var guestId = getGuestDetailsFromForm();
  //       if(guestId == -1) {
  //           // Todo: implement error handling logic
  //           alert("please enter all required details.");
  //           return;
  //       }
  //       isEditing = false;
  //       addGuestDetailsToList(guestId);
  //       // addDummyGuestDetailsTolist();
  //       clearGuestDetailsForm();
  //       showOrHideListOptions();
  //   }

  //   function addItemDetailsToList(guestId){
  //       var guest = mapOfGuests[guestId];
  //       var rowId = "guest-" + guestId;
  //       $("#guestList").prepend(
  //           '<div class="row" id="' + rowId + '" style="display:none">' +
  //               '<div class="col-sm-3 col-sm-offset-1"><p>' + item[0] + '</p></div>' +
  //               '<div class="col-sm-3"><p class="status">' + item[2] + '</p></div>' +
  //               '<div class="col-sm-3"><p>' + item[1] + '</p></div>' +
  //               '<div class="col-sm-2"><p>' + item[3] + '</p></div>' +
  //           '</div>');

  //       $("#" + rowId).slideDown();
  //       temporarilyHighlightRow(rowId);
  //   }

  //   function showGuestDetailsForEditing(guestId) {
  //       isEditing = true;
  //       var guest = mapOfGuests[guestId];
  //       $("#guest-details #guestName").val(guest[0]);
  //       $("#guest-details #checkIn").val(guest[1]);
  //       setDropdown(guest[2]);
  //       $("#guest-details #duration").val(guest[3]);
  //       $("#guest-details #daysLeft").val(guest[4]);
  //       $("#guest-details #guestNote").val(guest[5]);
  //       $("#clearForm").show();
  //       $("#saveNewGuest").show();
  //   }

  //   function addDummyGuestDetailsTolist(){
  //       // $("#guestList").prepend('<p>hello</p>');
  //       $("#guestList").prepend(
  //           '<div class="row">' +
  //               '<div class="col-sm-3 col-sm-offset-1"><p>Peter Pan</p></div>' +
  //               '<div class="col-sm-3"><p>Checked in</p></div>' +
  //               '<div class="col-sm-3"><p>04/18/2015</p></div>' +
  //               '<div class="col-sm-2"><p>5</p></div>' +
  //           '</div>');
  //   }

  //   function setDropdown(value) {
  //       $("#guestStatusDropdownLabel").html(value + ' <span class="caret"></span>');
  //       $("#guestStatusDropdownLabel").val(value);
  //   }

  //   function getGuestDetailsFromForm() {
  //       var guestName = $("#guestName").val();
  //       var checkIn  = $("#checkIn").val();
  //       var status = $("#guestStatusDropdownLabel").val();
  //       var duration = $("#duration").val();
  //       var daysLeft = $("#daysLeft").val();
  //       var guestNote = $("#guestNote").val();
  //       if(!duration && daysLeft) {
  //           duration = daysLeft;
  //       }
  //       if(!daysLeft && duration) {
  //           daysLeft = duration;
  //       }

  //       if(!guestName || !checkIn || !status || !duration || !daysLeft) {
  //           return -1;
  //       }
  //       var guestId = nextGuestId++;
  //       var guestDetails = [guestName, checkIn, status, duration, daysLeft, guestNote, guestId];
  //       mapOfGuests[guestId] = guestDetails;
  //       var residentToGuestMapEntry = mapOfResidentsToGuests[residentId];
  //       if(residentToGuestMapEntry) {
  //           residentToGuestMapEntry.push(guestId);
  //       } else {
  //           mapOfResidentsToGuests[residentId] = [guestId];
  //       }
  //       return guestId;
  //   }

  //   function hideDaysLeft() {
  //       $("#daysLeftFormField").hide();
  //   }

  //   var mapOfResidents = {
  //       0:["Konstantinos","Mentzelos",205,0],
  //       1:["Julius","Adebayo",118,1],
  //       2:["Cecilia","Pacheco",304,2],
  //       3:["Athina","Lentza",121,3]
  //   };

  //   var mapOfGuests = {
  //       // Name, check-in date (yyyy-mm-dd), status, duration, days left, note  
  //       0:["Nate Smith","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",0],
  //       1:["Andrew Carnegie","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",1],
  //       2:["Mike Tyson","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",2],
  //       3:["Sandra Johnson","2015-04-18","Not Arrived",5,5,"African American, about 6ft and with an afro",3],
  //   };

  //   var mapOfResidentsToGuests = {
  //       0:[0,1,2],
  //       1:[3]
  //   };

  //   var nextGuestId = 4;










// ************************* Item List ******************



    
});