var selectedPkgIdList = [];
var selectedTabPkg = -1;
var selectedTab = "Residents";

function isInPkgInfo(pkgMapID, singleString){
	var pkgInfo=mapOfPkgs[pkgMapID];
	var stringForSearch=singleString.toLowerCase();
	if (pkgInfo[0].toString().indexOf(stringForSearch)>=0 || pkgInfo[1].toLowerCase().indexOf(stringForSearch)>=0){
		return true
	}
	return false;
}

function setupPackagesList(searchStr) {
    $("#firstColumn").html("ID");
    $("#secondColumn").html("Company");
    $("#residentList").empty();
    if (searchStr === undefined || searchStr.length==0){
    	for (var r in mapOfPkgs) {
	        if (!mapOfPkgs.hasOwnProperty(r)) { // Ensure we're only using fields we added.
	            continue;
	        }
	        addPackageToTabList(r);
	    }
    }
    else{
    	var found=false;
    	var inputString=searchStr;
		var inputArray=inputString.split(" ");
		if (inputArray.length == 1){
			for (var r in mapOfPkgs) {
		        if (!mapOfPkgs.hasOwnProperty(r)) { // Ensure we're only using fields we added.
		            continue;
		        }
		        if (isInPkgInfo(r,inputArray[0])){
		        	addPackageToTabList(r);
		        	found=true;
		        }
		    }
		}
		else if (inputArray.length==2){
			for (var r in mapOfPkgs) {
		        if (!mapOfPkgs.hasOwnProperty(r)) { // Ensure we're only using fields we added.
		            continue;
		        }
		        if (isInPkgInfo(r,inputArray[0]) && isInPkgInfo(r,inputArray[1])){
		        	addPackageToTabList(r);
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

function addPackageToTabList(packageId) {
    var packages = mapOfPkgs[packageId];
    var rowId = getTabPkgRowId(packageId);
    $("#residentList").append(
        '<div class="row" id="' + rowId + '">' +
            '<div class="col-sm-8"><p>' + packages[0] + '</p></div>' +
            '<div class="col-sm-4"><p>' + packages[1] + '</p></div>' +
        '</div>');
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
    displayResidentProfile(residentId);
    clearPkgDetailsForm();
    selectedPkgIdList = [];
    $("#tableList").empty();
    var arrayOfPkgUniqueIds = mapOfResidentsToPkgs[residentId];
    if(arrayOfPkgUniqueIds) {
        for(var i = 0; i < arrayOfPkgUniqueIds.length; i++) {
            pkgUniqueId = arrayOfPkgUniqueIds[i];
            addPkgDetailsToList(pkgUniqueId, false);
        }    
    }
    showOrHideListOptions(selectedPkgIdList.length);
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

function isSelected(pkgUniqueId) {
    for(var i = 0; i < selectedPkgIdList.length; i++) {
        if(selectedPkgIdList[i] == pkgUniqueId) {
            return true;
        }
    }
    return false;
}

function deleteAllSelectedPkgs(arrayOfPkgUniqueIds) {
    //TODO: Also remove pkg from data model before removing from table.
    for(var i = 0; i < arrayOfPkgUniqueIds.length; i++){
        var pkgUniqueId = arrayOfPkgUniqueIds[i];
        var rowId = "pkg-" + pkgUniqueId;
        deleteRowFromDisplay(rowId);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedPkgIdList.length);
}

function deliverAllSelectedItems(arrayOfPkgUniqueIds) {
    //TODO: fix this if we implement event log
    deleteAllSelectedPkgs(arrayOfPkgUniqueIds);
}

function clearAllTableSelections() {
    selectedPkgIdList = [];
}

function clearPkgDetailsForm() {
    $("#top-panel input").not("#residentName").not("#room").val("");
    $("#top-panel textarea").val("");
}

function showFormForNewPkg() {
    $("#clearForm").show();
    $("#saveNewItem").show();
    clearPkgDetailsForm();
}

function saveNewPkgFromForm() {
    if(isEditing) {
        deleteAllSelectedPkgs(selectedPkgIdList);
    }
    var pkgUniqueId = getPkgDetailsFromForm();
    if(pkgUniqueId == -1) {
        // Todo: implement more specific error message
        alert("please enter all required details in the right format.");
        return;
    }
    isEditing = false;
    addPkgDetailsToList(pkgUniqueId, true);
    clearPkgDetailsForm();
    showOrHideListOptions(selectedPkgIdList.length);
}

function addPkgDetailsToList(pkgUniqueId, highlightRow){
    var pkg = mapOfPkgs[pkgUniqueId];
    var rowId = "pkg-" + pkgUniqueId;
    var checkboxId = getCheckboxId(pkgUniqueId);
    $("#tableList").prepend(
        '<div class="row" id="' + rowId + '" style="display:none">' +
            '<div class="col-sm-1"><input type="checkbox" name="pkg-checkbox" id=' + checkboxId + '></div>' +
            '<div class="col-sm-3"><p>' + pkg[0] + '</p></div>' +
            '<div class="col-sm-3"><p>' + pkg[1] + '</p></div>' +
            '<div class="col-sm-5"><p>' + pkg[2] + '</p></div>' +
        '</div>');
    $("#" + rowId).slideDown();
    if(highlightRow) {
        temporarilyHighlightRow(rowId);
    }
}

function showPkgDetailsForEditing(pkgUniqueId) {
    isEditing = true;
    var pkg = mapOfPkgs[pkgUniqueId];
    $("#top-panel #packageId").val(pkg[0]);
    $("#top-panel #company").val(pkg[1]);
    $("#top-panel #note").val(pkg[2]);
    $("#clearForm").show();
    $("#saveNewItem").show();
}

function getPkgDetailsFromForm() {
    var packageId = $("#packageId").val();
    var company = $("#company").val();
    var note = $("#note").val();
    if(!packageId) {
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

function getPkgUniqueId(rowId) {
    return rowId.split("pkg-")[1];
}

function getTabPkgUniqueId(tabPkgRowId) {
    return tabPkgRowId.split("tab-pkg-")[1];
}

function getPkgRowId(residentId) {
    return "pkg-" + residentId;
}

function getTabPkgRowId(tabPkgUniqueId) {
    return "tab-pkg-" + tabPkgUniqueId;
}

function getCheckboxId(pkgUniqueId) {
    return "pkg-checkbox-" + pkgUniqueId;
}

function getPkgUniqueIdFromCheckboxId(checkboxId) {
    return checkboxId.split("pkg-checkbox-")[1];   
}

function selectPkg(pkgUniqueId) {
    selectedPkgIdList.push(pkgUniqueId);
    var checkboxId = getCheckboxId(pkgUniqueId);
    $("#" + checkboxId).prop('checked', true);
    highlightRow(getPkgRowId(pkgUniqueId));
}

function deselectPkg(pkgUniqueId) {
    if(selectedPkgIdList.length != 0) {
        for(var i = 0; i < selectedPkgIdList.length; i++) {
            if(selectedPkgIdList[i] == pkgUniqueId) {
                // This is a faster way to delete item from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedPkgIdList[i] = selectedPkgIdList[selectedPkgIdList.length - 1];
                selectedPkgIdList.pop();
            }
        }
    }
    var checkboxId = getCheckboxId(pkgUniqueId);
    $("#" + checkboxId).prop('checked', false);
    removeRowHighlight(getPkgRowId(pkgUniqueId));
}

function selectTabPkg(pkgUniqueId) {
    selectedTabPkg = pkgUniqueId;
    highlightRow(getTabPkgRowId(pkgUniqueId));
}

function deselectTabPkg(pkgUniqueId) {
    selectedTabPkg = -1;
    removeRowHighlight(getTabPkgRowId(pkgUniqueId));
}

function deselectTheSelectAllCheckBox() {
    $("#pkg-select-all").prop('checked', false);
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

    $("#packagesTab").click(function(e){
        setupPackagesList();
        selectedTab = "Packages";
        document.getElementById("searchInput").placeholder="Search by Id or Company";
    });

    $("#homePageContainer #btnPackage").click(function() {
        window.location = "pkg.html";
    });

    $("#homePageContainer #btnItem").click(function() {
        window.location = "item.html";
    });

    $("#homePageContainer #btnGuest").click(function() {
        window.location = "guest.html";
    });

    $("#pkg-form-options #clearForm").click(function(){
        clearPkgDetailsForm();        
    });

    $("#pkg-form-options #saveNewItem").click(function(){
        saveNewPkgFromForm();      
    });

    $("#table-menu #pkgListBtnNewPackage").click(function(){
        showFormForNewPkg();
        $("#top-panel").slideDown();      
    });

    $("#table-menu #pkgListEdit").click(function(){
        showPkgDetailsForEditing(selectedPkgIdList[0]); 
    });

    $("#table-menu #pkgListDeliver").click(function(){
        deliverAllSelectedItems(selectedPkgIdList); 
    });

    $("#table-menu #pkgListDelete").click(function(){
        deleteAllSelectedPkgs(selectedPkgIdList); 
    });

    $('#tableList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var pkgUniqueId = getPkgUniqueId(rowId);
        if(isSelected(pkgUniqueId)) {
            deselectPkg(pkgUniqueId);
        } else {
            selectPkg(pkgUniqueId);
        }
        showOrHideListOptions(selectedPkgIdList.length);
    });

    $("#pkg-select-all").click(function(event){
        selectedPkgIdList = [];
        var isChecked = this.checked;
        $('input[name="pkg-checkbox"]').each(function() {
            var checkboxId = $(this).attr("id");
            var pkgUniqueId = getPkgUniqueIdFromCheckboxId(checkboxId);
            if(isChecked) {
                selectPkg(pkgUniqueId);    
            } else {
                deselectPkg(pkgUniqueId);
            }
            
        });
        showOrHideListOptions(selectedPkgIdList.length);
    });

});