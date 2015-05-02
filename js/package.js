var selectedPkgId = [];
var selectedPackageId = -1;
var selectedTab = "Residents";

function unselectPackage(packageId) {
    selectedPackageId = -1;
    removeRowHighlight(getPackageRowId(packageId));
}

function selectPackage(packageId) {
    selectedPackageId = packageId;
    highlightRow(getPackageRowId(packageId));
}

function getPackageId(rowId) {
    return rowId.split("package-")[1];
}

function getPackageRowId(packageId) {
    return "package-" + packageId;
}

function setupPackagesList() {
    $("#firstColumn").html("ID");
    $("#secondColumn").html("Company");
    $("#residentList").empty();
    for (var r in mapOfPkgs) {
        if (!mapOfPkgs.hasOwnProperty(r)) { // Ensure we're only using fields we added.
            continue;
        }
        addPackageToList(r);
    }
}

function addPackageToList(packageId) {
    var packages = mapOfPkgs[packageId];
    var rowId = getPackageRowId(packageId);
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
    selectedPkgId = [];
    $("#tableList").empty();
    var arrayOfPkgUniqueIds = mapOfResidentsToPkgs[residentId];
    if(arrayOfPkgUniqueIds) {
        for(var i = 0; i < arrayOfPkgUniqueIds.length; i++) {
            pkgUniqueId = arrayOfPkgUniqueIds[i];
            addPkgDetailsToList(pkgUniqueId, false);
        }    
    }
    showOrHideListOptions(selectedPkgId.length);
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

function getPkgRowId(residentId) {
    return "pkg-" + residentId;
}

function deleteAllSelectedPkgs(arrayOfPkgUniqueIds) {
    //TODO: Also remove pkg from data model before removing from table.
    for(var i = 0; i < arrayOfPkgUniqueIds.length; i++){
        var company = arrayOfPkgUniqueIds[i];
        var rowId = "pkg-" + company;
        deleteRowFromDisplay(rowId);
        console.log(arrayOfPkgUniqueIds);
    }
    clearAllTableSelections();
    showOrHideListOptions(selectedPkgId.length);
}

function deliverAllSelectedItems(arrayOfPkgUniqueIds) {
    //TODO: fix this if we implement event log
    deleteAllSelectedPkgs(arrayOfPkgUniqueIds);
}

function clearAllTableSelections() {
    selectedPkgId = [];
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
        deleteAllSelectedPkgs(selectedPkgId);
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
    showOrHideListOptions(selectedPkgId.length);
}

function addPkgDetailsToList(pkgUniqueId, highlightRow){
    var pkg = mapOfPkgs[pkgUniqueId];
    var rowId = "pkg-" + pkgUniqueId;
    $("#tableList").prepend(
        '<div class="row" id="' + rowId + '" style="display:none">' +
            '<div class="col-sm-3 col-sm-offset-1"><p>' + pkg[0] + '</p></div>' +
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

$(document).ready(function(){
    setupResidentList();

    $("#myTab a").click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });

    $("#residentsTab").click(function(e){
        setupResidentList();
        selectedTab = "Residents";
    });

    $("#packagesTab").click(function(e){
        setupPackagesList();
        selectedTab = "Packages";
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

    $('#tableList').on('click', '.row', function() {
        var rowId = $(this).attr("id");
        var pkgUniqueId = getPkgUniqueId(rowId);
        var removedId = false;
        for(var i = 0; i < selectedPkgId.length; i++) {
            if(selectedPkgId[i] == pkgUniqueId) {
                // This is a faster way to delete pkg from the middle (in JavaScript) when he ordering of the items isn't relevant
                selectedPkgId[i] = selectedPkgId[selectedPkgId.length - 1];
                selectedPkgId.pop();
                removeRowHighlight(rowId);
                removedId = true;
            }
        }
        if(!removedId){
            selectedPkgId.push(pkgUniqueId);    
            highlightRow(rowId);
        }
        showOrHideListOptions(selectedPkgId.length);
    });

    $("#table-menu #pkgListBtnNewPackage").click(function(){
        showFormForNewPkg();
        $("#top-panel").slideDown();      
    });

    $("#table-menu #pkgListEdit").click(function(){
        showPkgDetailsForEditing(selectedPkgId[0]); 
    });

    $("#table-menu #pkgListDeliver").click(function(){
        deliverAllSelectedItems(selectedPkgId); 
    });

    $("#table-menu #pkgListDelete").click(function(){
        deleteAllSelectedPkgs(selectedPkgId); 
    });
});