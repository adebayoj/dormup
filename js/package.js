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
        window.location = "pkg.html";
    });

    $("#homePageContainer #btnItem").click(function() {
        window.location = "item.html";
    });

    $("#homePageContainer #btnGuest").click(function() {
        window.location = "guest.html";
    });


    // ********** Package List **********
    var mapOfResidents = {
        0:["Konstantinos","Mentzelos",205,0],
        1:["Julius","Adebayo",118,1],
        2:["Cecilia","Pacheco",304,2],
        3:["Athina","Lentza",121,3],
        4:["Argiro","Lentza",121,4],
        5:["George","Avramopoulos",205,5],
        6:["Konstantinos","Kamranlis",109,6]
    };

    var mapOfPkgs = {
      // Pkg ID, Company, note, pkg Unique ID
        0:["001234","Amazon","Damaged",0],
        1:["001245","DHL","Cold food",1],
        2:["0011433","UPS","Fragile",2],
        3:["0011432","UPS","",3],
        4:["141234","Fedex","",4],
        5:["2311234","Amazon","Stored on top of the shelf",5]
    }

    var mapOfResidentsToPkgs = {
        0:[0,1],
        1:[2,3,4],
        2:[5]
    };

    var selectedPkgId = [];

    var selectedResidentId = -1;

    var isEditing = false;

    setupResidentList();

    hideRightSidebar();

    $("#pkg-form-options #clearForm").click(function(){
        clearPkgDetailsForm();        
    });

    $("#pkg-form-options #saveNewItem").click(function(){
        saveNewPkgFromForm();      
    });

    $('#residentList').on('mouseover', '.row', function() {
        $(this).css("background-color", "#BBDEFB");
        $(this).find("*").css("background-color", "#BBDEFB");
    });

    $('#residentList').on('mouseout', '.row', function() {
        $(this).css("background-color", "white");
        $(this).find("*").css("background-color", "white");
    });

    $('#pkgList').on('mouseover', '.row', function() {
        highlightRow($(this).attr("id"));
    });

    $('#pkgList').on('mouseout', '.row', function() {
        var rowId = $(this).attr("id");
        var pkgUniqueId = getPkgUniqueId(rowId);
        if(!isSelected(pkgUniqueId)) {
            removeRowHighlight(rowId);
        }
    });

    $('#residentList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var residentId = getResidentId(rowId);
        setupRightSidebar(residentId);
    });

    $('#pkgList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var pkgUniqueId = getPkgUniqueId(rowId);
        var removedId = false;
        for(var i = 0; i < selectedPkgId.length; i++) {
            if(selectedPkgId[i] == pkgUniqueId) {
                // This is a faster way to delete pkg from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedPkgId[i] = selectedPkgId[selectedPkgId.length - 1];
                selectedPkgId.pop();
                removeRowHighlight(rowId);
                console.log(rowId);
                console.log("pop")
                removedId = true;
            }
        }
        if(!removedId){
            selectedPkgId.push(pkgUniqueId);    
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

    function getNextPkgUniqueId() {
        var maxId = -1;
        for (var g in mapOfPkgs) {
            if (!mapOfPkgs.hasOwnProperty(g)) { // Ensure we're only using fields we added.
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
        clearPkgDetailsForm();
        selectedPkgId = [];
        $("#pkgList").empty();
        var arrayOfPkgUniqueIds = mapOfResidentsToPkgs[residentId];
        if(arrayOfPkgUniqueIds) {
            for(var i = 0; i < arrayOfPkgUniqueIds.length; i++) {
                pkgUniqueId = arrayOfPkgUniqueIds[i];
                addPkgDetailsToList(pkgUniqueId);
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

    function isSelected(pkgUniqueId) {
        for(var i = 0; i < selectedPkgId.length; i++) {
            if(selectedPkgId[i] == pkgUniqueId) {
                return true;
            }
        }
        return false;
    }

    function getPkgUniqueId(rowId) {
        return rowId.split("pkg-")[1];
    }

    function getResidentId(rowId) {
        return rowId.split("resident-")[1];
    }

    function getResidentRowId(residentId) {
        return "resident-" + residentId;
    }

    function getPkgRowId(residentId) {
        return "pkg-" + residentId;
    }

    function showOrHideListOptions() {
        var selections = selectedPkgId.length;
        if(selections == 0) {
            $("#pkg-list-options .singleSelection").slideUp();
            $("#pkg-list-options .multiSelection").slideUp();
        } else if (selections == 1) {
            $("#pkg-list-options .singleSelection").slideDown();
            $("#pkg-list-options .multiSelection").slideDown();
        } else if (selections > 1){
            $("#pkg-list-options .singleSelection").slideUp();
            $("#pkg-list-options .multiSelection").show();
        } else {
            alert("Invalid selection count: " + selections);
        }

    }

    $("#pkg-list-options #pkgListBtnNewPackage").click(function(){
        showFormForNewItem();
        $("#pkg-details").slideDown();      
    });

    $("#pkg-list-options #pkgListEdit").click(function(){
        showPkgDetailsForEditing(selectedPkgId[0]); 
    });

    $("#pkg-list-options #pkgListDeliver").click(function(){
        deliverAllSelectedItems(selectedPkgId); 
    });

    $("#pkg-list-options #pkgListDelete").click(function(){
        deleteAllSelectedPkgs(selectedPkgId); 
    });

    function deleteAllSelectedPkgs(arrayOfPkgUniqueIds) {
        //TODO: Also remove pkg from data model before removing from table.
        for(var i = 0; i < arrayOfPkgUniqueIds.length; i++){
            var company = arrayOfPkgUniqueIds[i];
            var rowId = "pkg-" + company;
            deleteRowFromDisplay(rowId);
            console.log(arrayOfPkgUniqueIds);
        }
        clearAllTableSelections();
        showOrHideListOptions();
    }

    function deliverAllSelectedItems(arrayOfPkgUniqueIds) {
        //TODO: fix this if we implement event log
        deleteAllSelectedPkgs(arrayOfPkgUniqueIds);
    }

    function clearAllTableSelections() {
        selectedPkgId = [];
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

    function clearPkgDetailsForm() {
        $("#pkg-details input").val("");
        $("#pkg-details textarea").val("");
    }

    function showFormForNewItem() {
        $("#clearForm").show();
        $("#saveNewItem").show();
        clearPkgDetailsForm();
    }

    function saveNewPkgFromForm() {
        if(isEditing) {
            deleteAllSelectedPkgs(selectedPkgId);
        }
        var pkgUniqueId = getPkgDetailsFromForm();
        if(pkgUniqueId == -1) {
            // Todo: implement more specific error message
            alert("please enter all required details in the right format.");
            return;
        }
        isEditing = false;
        addPkgDetailsToList(pkgUniqueId);
        // addDummyGuestDetailsTolist();
        clearPkgDetailsForm();
        showOrHideListOptions();
    }

    function addPkgDetailsToList(pkgUniqueId){
        var pkg = mapOfPkgs[pkgUniqueId];
        var rowId = "pkg-" + pkgUniqueId;
        $("#pkgList").prepend(
            '<div class="row" id="' + rowId + '" style="display:none">' +
                '<div class="col-sm-3 col-sm-offset-1"><p>' + pkg[0] + '</p></div>' +
                '<div class="col-sm-3"><p>' + pkg[1] + '</p></div>' +
                '<div class="col-sm-5"><p>' + pkg[2] + '</p></div>' +
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

    function showPkgDetailsForEditing(pkgUniqueId) {
        isEditing = true;
        var pkg = mapOfPkgs[pkgUniqueId];
        $("#pkg-details #packageId").val(pkg[0]);
        $("#pkg-details #company").val(pkg[1]);
        $("#pkg-details #note").val(pkg[2]);
        $("#clearForm").show();
        $("#saveNewItem").show();
    }

    // function addDummyGuestDetailsTolist(){
    //     // $("#pkgList").prepend('<p>hello</p>');
    //     $("#pkgList").prepend(
    //         '<div class="row">' +
    //             '<div class="col-sm-3 col-sm-offset-1"><p>Peter Pan</p></div>' +
    //             '<div class="col-sm-3"><p>Checked in</p></div>' +
    //             '<div class="col-sm-3"><p>04/18/2015</p></div>' +
    //             '<div class="col-sm-2"><p>5</p></div>' +
    //         '</div>');
    // }

    function getPkgDetailsFromForm() {
        var packageId = $("#packageId").val();
        var company = $("#company").val();
        var note = $("#note").val();
        if(!packageId || !company) {
            return -1;
        }
        var pkgUniqueId = getNextPkgUniqueId();
        var pkgDetails = [packageId, company, note, pkgUniqueId];
        mapOfPkgs[pkgUniqueId] = pkgDetails;
        var residentToPkgMapEntry = mapOfResidentsToPkgs[selectedResidentId];
        if(residentToPkgMapEntry) {
            residentToPkgMapEntry.push(pkgUniqueId);
        } else {
            mapOfResidentsToPkgs[selectedResidentId] = [pkgUniqueId];
        }
        return pkgUniqueId;
    }

    // ********** End of Item List **********



    
});