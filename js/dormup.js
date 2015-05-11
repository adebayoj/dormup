/* Insert JavaScript here */
var mapOfResidents = {    
    0:["Argiro","Lentza",1],
    1:["Athina","Lentza",2],
    2:["Bruce","Lee",3],
    3:["Cecilia","Testart",4],
    4:["George","Avramopoulos",13],
    5:["Homer","Simpson",7],
    6:["Jackie","Chen",14],
    7:["James","Smith",8],
    8:["Jet","Lee",15],
    9:["Julius","Adebayo",10],
    10:["Konstantinos","Karamanlis",5],
    11:["Konstantinos","Mentzelos",16],
    12:["Leigh","Fisk",17],
    13:["Munther","Dahler",6],
    14:["Nina","Kevler",9],
    15:["Ope","John",24],
    16:["Paul","Peter",18],
    17:["Peter","Jones",11],
    18:["Qudus","Kayan",12],
    19:["Shane","Allen",21],
    20:["Stella","Wang",20],
    21:["Yan","Ki",22],
    22:["Yusuf","Kayan",19],
    23:["Zulu","Jimoh",23]
};

var mapOfGuests = {
    // Name, check-in date (yyyy-mm-dd), status, duration, days left, note  
    0:["Nate Smith","2015-04-18","Not Arrived",5,5,"He's 6ft"],
    1:["Andrew Carnegie","2015-04-18","Not Arrived",5,5,""],
    2:["Mike Tyson","2015-04-18","Not Arrived",5,5,"Looks like a boxer"],
    3:["Sandra Johnson","2015-04-18","Not Arrived",5,5,"She's 5'10ft"],
};

var mapOfResidentsToGuests = {
    0:[0,1,2],
    1:[3]
};

var mapOfItems = {
  // Name, return date (yyyy-mm-dd), ID, note
    0:["Baseball Bat", "2015-05-15", "00001", ""],
    1:["Basketball - Wilson", "2015-04-29", "00023", ""],
    2:["Movie - Starwars 1","2015-04-25","00123", "Broken case"],
    3:["Movie - Starwars 2","", "00012", ""],
    4:["Movie - Titanic", "2015-04-20", "00145", ""],
    5:["Movie - Tomb Raider", "", "02345", ""],
    6:["Spare key - Room 1","", "00043", ""],
    7:["Spare key - Room 2","2015-05-13", "00044", ""],
    8:["Spare key - Room 3","2015-05-12", "00045", ""],
    9:["Spare key - Room 4","", "00046", ""],
    10:["Spare key - Room 5","", "00047", ""],
    11:["Spare key - Room 6","", "00048", ""],
    12:["Spare key - Room 7","", "00049", ""],
    13:["Spare key - Room 8","", "00050", ""],
    14:["Spare key - Room 9","", "00051", ""],
    15:["Spare key - Room 10","", "00052", ""],
    16:["Spare key - Room 11","", "00053", ""],
    17:["Spare key - Room 12","", "00054", ""],
    18:["Vacuum cleaner", "2015-04-18", "00139", ""],
    19:["Vacuum cleaner", "", "00140", ""]
}

var mapOfResidentsToItems = {
    0:[0,1,2],
    1:[4,7],
    2:[8],
    3:[18]
};

var mapOfPkgs = {
  // Pkg ID, Company, note, pkg Unique ID
    0:["001234","Amazon","Damaged"],
    1:["001245","DHL","Cold food"],
    2:["0011433","UPS","Fragile"],
    3:["0011432","UPS",""],
    4:["141234","Fedex",""],
    5:["2311234","Amazon","Stored on top of the shelf"]
}

var mapOfResidentsToPkgs = {
    0:[0,1],
    1:[2,3,4],
    2:[5]
};

var selectedResidentId = -1;

var isEditing = false;
var listForAutocomplete=[];

function makeListForAutocomple(){
	for (var r in mapOfResidents) {
        if (!mapOfResidents.hasOwnProperty(r)) { // Ensure we're only using fields we added.
            continue;
        }
        var res=mapOfResidents[r];
        listForAutocomplete.push(res[0]+" "+res[1]);
    }
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

function isInResidentInfo(residentMapID, singleString){
	var resInfo=mapOfResidents[residentMapID];
	var stringForSearch=singleString.toLowerCase();
	if (resInfo[0].toLowerCase().indexOf(stringForSearch)>=0 || resInfo[1].toLowerCase().indexOf(stringForSearch)>=0 || resInfo[2].toString().indexOf(stringForSearch)>=0){
		return true
	}
	return false;
}

function setupResidentList(searchStr) {
	$("#firstColumn").html("Name");
    $("#secondColumn").html("Room");
    $("#residentList").empty();
	if (searchStr === undefined || searchStr.length==0){
	    for (var r in mapOfResidents) {
	        if (!mapOfResidents.hasOwnProperty(r)) { // Ensure we're only using fields we added.
	            continue;
	        }
	        addResidentToList(r);
	    }
	}
	else{
		var found=false;
		var inputString=searchStr;
		var inputArray=inputString.split(" ");
		if (inputArray.length == 1){
			for (var r in mapOfResidents) {
		        if (!mapOfResidents.hasOwnProperty(r)) { // Ensure we're only using fields we added.
		            continue;
		        }
		        if (isInResidentInfo(r,inputArray[0])){
		        	addResidentToList(r);
		        	found=true;
		        }
		    }
		}
		else if (inputArray.length == 2){
			for (var r in mapOfResidents) {
		        if (!mapOfResidents.hasOwnProperty(r)) { // Ensure we're only using fields we added.
		            continue;
		        }
		        var resInfo=mapOfResidents[r];
		        if (isInResidentInfo(r,inputArray[0]) && isInResidentInfo(r,inputArray[1])){
		        	addResidentToList(r);
		        	found=true;
		        }
		    }
		}
		else if (inputArray.length == 3){
			if (isInResidentInfo(r,inputArray[0]) && isInResidentInfo(r,inputArray[1]) && isInResidentInfo(r,inputArray[2])){
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

    setResidentListMaxHeight();
	
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
    $("#" + rowId).slideUp("slow", function(){
        $("#" + rowId).remove();
    });
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

function setResidentListMaxHeight() {
    var residentListMaxHeight = $("#footer-text").offset().top - $("#residentList").offset().top - 15;
    $("#residentList").css("max-height", residentListMaxHeight);
}

function setTableListMaxHeight() {
    var tableListMaxHeight = $("#footer-text").offset().top - $("#tableList").offset().top - 30;
    $("#tableList").css("max-height", tableListMaxHeight);
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

    $('#residentList, #tableList').on('mouseover', '.row', function() {
        $(this).addClass("hovered-row");
    });

    $('#residentList, #tableList').on('mouseout', '.row', function() {
        $(this).removeClass("hovered-row");
    });

    $('#residentList').on('click', '.row', function() {
        check_Selected_Item = false;
        if (selectedTab == "Residents"){
            var rowId = $(this).attr("id");
            var residentId = getResidentId(rowId);
            if(selectedResidentId != -1) {
                unselectResident(selectedResidentId);
            }
            selectResident(residentId);
            setupRightSidebar(residentId);
        }
        else if (selectedTab == "Packages"){
            var rowId = $(this).attr("id");
            var pkgUniqueId = getTabPkgUniqueId(rowId);
            if(selectedTabPkg != -1) {
                deselectTabPkg(selectedTabPkg);
            }
            selectTabPkg(pkgUniqueId);
            for (i=0; i<Object.keys(mapOfResidents).length; i++){
                if (i in mapOfResidentsToPkgs){
                    temporary = mapOfResidentsToPkgs[i]
                    for (j=0; j<temporary.length; j++){
                        if (temporary[j] == pkgUniqueId){
                            selectedResidentId = i;
                        }
                    }
                }
            }
            setupRightSidebar(selectedResidentId);
            temporarilyHighlightRow(getPkgRowId(pkgUniqueId));
        }
        else if (selectedTab == "Guests"){
            var rowId = $(this).attr("id");
            var guestUniqueId = getTabGuestUniqueId(rowId);
            if(selectTabGuest != -1) {
                deselectTabGuest(selectedTabGuest);
            }
            selectTabGuest(guestUniqueId);
            for (i=0; i<Object.keys(mapOfResidents).length; i++){
                if (i in mapOfResidentsToGuests){
                    temporary = mapOfResidentsToGuests[i]
                    for (j=0; j<temporary.length; j++){
                        if (temporary[j] == guestUniqueId){
                            selectedResidentId = i;
                        }
                    }
                }
            }
            setupRightSidebar(selectedResidentId);
            temporarilyHighlightRow(getGuestRowId(guestUniqueId));
        }
        else if (selectedTab == "Items"){
            var rowId = $(this).attr("id");
            var itemId = getTabItemUniqueId(rowId);
            if(selectedTabItem != -1) {
                deselectTabItem(selectedTabItem);
            }
            selectTabItem(itemId);
            for (i=0; i<Object.keys(mapOfResidents).length; i++){
                if (i in mapOfResidentsToItems){
                    temporary = mapOfResidentsToItems[i]
                    for (j=0; j<temporary.length; j++){
                        if (temporary[j] == itemId){
                            selectedResidentId = i;
                            check_Selected_Item = true;
                        }
                    }
                }
            }
            if (check_Selected_Item == false){
                setupRightSidebarForNewItem(itemId);
            }
            else{
                setupRightSidebar(selectedResidentId);
            }
            temporarilyHighlightRow(getItemRowId(itemId));
        }
    });

    $('#searchInput').keyup(function(e) {
    	var searchString =$("#searchInput").val();
    	if (selectedTab=="Residents"){
    		setupResidentList(searchString);
    	}
    	else if (selectedTab=="Packages") {
    		setupPackagesList(searchString);
    	}
    	else if (selectedTab=="Guests"){
    		setupGuestsList(searchString);
    	}
    	else if (selectedTab=="Items"){
    		setupItemsList(searchString);
    	}
    	
    });

    makeListForAutocomple();

});



