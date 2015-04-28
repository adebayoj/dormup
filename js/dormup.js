/* Insert JavaScript here */
var mapOfResidents = {
    0:["Konstantinos","Mentzelos",205,0],
    1:["Julius","Adebayo",118,1],
    2:["Cecilia","Pacheco",304,2],
    3:["Athina","Lentza",121,3],
    4:["Argiro","Lentza",121,4],
    5:["George","Avramopoulos",205,5],
    6:["Konstantinos","Kamranlis",109,6]
};

var mapOfGuests = {
    // Name, check-in date (yyyy-mm-dd), status, duration, days left, note  
    0:["Nate Smith","2015-04-18","Not Arrived",5,5," 6ft ",0],
    1:["Andrew Carnegie","2015-04-18","Not Arrived",5,5,"6ft ",1],
    2:["Mike Tyson","2015-04-18","Not Arrived",5,5,"6ft ",2],
    3:["Sandra Johnson","2015-04-18","Not Arrived",5,5,"5'10ft",3],
};

var mapOfResidentsToGuests = {
    0:[0,1,2],
    1:[3]
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

var selectedResidentId = -1;

var isEditing = false;

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

function unselectResident(residentId) {
    selectedResidentId = -1;
    removeRowHighlight(getResidentRowId(residentId));
}

function selectResident(residentId) {
    selectedResidentId = residentId;
    highlightRow(getResidentRowId(residentId));
}

function highlightRow(rowId) {
    $("#" + rowId).addClass("selected-row");
}

function removeRowHighlight(rowId) {
    $("#" + rowId).removeClass("selected-row");
}

function getResidentId(rowId) {
    return rowId.split("resident-")[1];
}

function getResidentRowId(residentId) {
    return "resident-" + residentId;
}

function showOrHideListOptions(numOfSelections) {
    if(numOfSelections == 0) {
        $("#table-menu .singleSelection").slideUp();
        $("#table-menu .multiSelection").slideUp();
    } else if (numOfSelections == 1) {
        $("#table-menu .singleSelection").slideDown();
        $("#table-menu .multiSelection").slideDown();
    } else if (numOfSelections > 1){
        $("#table-menu .singleSelection").slideUp();
        $("#table-menu .multiSelection").show();
    } else {
        alert("Invalid selection count: " + numOfSelections);
    }
}

function temporarilyHighlightText(textSelector) {
    $(textSelector).css("font-weight", "bold");
    setTimeout(function(){
        $(textSelector).css("font-weight", "normal");
    }, 2000);
}

function temporarilyHighlightRow(rowId) {
    var selector = "#" + rowId;
    $(selector).addClass("flash");
    setTimeout(function(){
        $(selector).removeClass("flash");
    }, 2000);
}

function deleteRowFromDisplay(rowId) {
    $("#" + rowId).slideUp();
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

$(document).ready(function(){
    setupResidentList();
    hideRightSidebar();

    $("#homePageContainer #btnPackage").click(function() {
        window.location = "package.html";
    });

    $("#homePageContainer #btnItem").click(function() {
        window.location = "item.html";
    });

    $("#homePageContainer #btnGuest").click(function() {
        window.location = "guest.html";
    });

    $('#residentList').on('mouseover', '.row', function() {
        $(this).addClass("hovered-row");
    });

    $('#residentList').on('mouseout', '.row', function() {
        $(this).removeClass("hovered-row");
    });

    $('#residentList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var residentId = getResidentId(rowId);
        if(selectedResidentId != -1) {
            unselectResident(selectedResidentId);
        }
        selectResident(residentId);
        setupRightSidebar(residentId);
    });
});