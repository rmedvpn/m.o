var currentlyOpenSidebar = "";
var currentlyOpenSubSidebar = "";
var callerSidebar = "";
var isControlButtonEnabled = 1;
var isMultiSelectOrder = false;
var curSelectedOrder = "";
var SelectedMultiOrder = "";
var SelectedOrdersCount =0;
var isUpdateDisabled = false;
var UpdateDisableCount = 0;
const ordersRefreshTimer = 20000;
var currentUserView = "";
var searchBoxCloseTimer = "";
var currentProductsView = "CATALOG";
var currSelectedOrder = 0;
var currSelectedEntry = 0;

var DisplayAdjsutmentBreak = 0;
function MonitorUser() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var theResponse = this.responseText;

            if (theResponse.substring(0, 3) == '!!!') {
        //        alert('bye');
                window.location.href = "/";
            }
        } console.log("adsf");
    };
    xmlhttp.open("GET", "Scripts/Ajax/AjaxUserMonitor", true);

    xmlhttp.send();
}

function DisableControlButton() {
    isControlButtonEnabled = 0;
    document.getElementById('ControlButton').innerHTML = "🖤";
}
function EnableControlButton() {
    isControlButtonEnabled = 1;
    document.getElementById('ControlButton').innerHTML = "💚";
}

function ControlButton() {
    if (isControlButtonEnabled == 1) {

        if (callerSidebar != "") {
            controller.open(callerSidebar);
            currentlyOpenSidebar = callerSidebar;
            switch (sbRefresh) {
                case "RoundMenu":
                    var round_id = document.getElementById('RoundToUpdate').value;
                    AdminAjaxUpdate("RoundMenu", "RoundMenuDiv", "RoundMenuLoader", round_id);
                    break;
            }
            callerSidebar = "";
        }
        else {
            switch (currentlyOpenSidebar) {
                case "Info":
                    controller.open("JoinAdmin");
                    currentlyOpenSidebar = "JoinAdmin";
                    break;
                case "JoinAdmin":
                    controller.close("JoinAdmin");
                    currentlyOpenSidebar = "";
                    break;

                case "MainSb":
                    controller.close("MainSb");
                    currentlyOpenSidebar = "";
                    break;


                case "SubMenu":
                    controller.open("MainSb");
                    currentlyOpenSidebar = "MainSb";
                    clearContent('SubMenuContent');

                    break;

                case "":
                    // controller.open('msngr');
                    //   currentlyOpenSidebar = 'msngr';
                    break;



            }
        }
    }


   
    }

function BuildOrderResTable() {
    let activeOrders = SelectedMultiOrder.split("##");
    let blankLoc = activeOrders.indexOf("");
    if (blankLoc > -1) {
        activeOrders.splice(blankLoc, 1);
    }
    activeOrders.sort(function (a, b) { return a - b });
    activeOrders.reverse();

    let ResTable = document.getElementById('ResTable');
    let ResTable2 = document.getElementById('ResTable2');
    let ItemsCopiedCnt = document.getElementById('ItemsCopiedCnt');
    ResTable.innerHTML = "";

    for (order in activeOrders) {
        var curSelectedData = document.getElementById('ordTbl_' + activeOrders[order]);
        if (curSelectedData) {
            if (curSelectedData.innerHTML != "") {
                ResTable.innerHTML = ResTable.innerHTML + curSelectedData.innerHTML;;
            }
        }
    }

    ResTable2.value = ResTable.innerText;
    ItemsCopiedCnt.innerText = SelectedOrdersCount;
    if (SelectedOrdersCount == 0) { hideElement("ClipboardStatDiv"); } else { showElement("ClipboardStatDiv"); }
    document.getElementById('selOrders').value = SelectedMultiOrder;
}
function SelectAndCopy(selIndex) {

    var prevSelectedRow = document.getElementById('ordTable_' + curSelectedOrder);
    var curSelectedRow = document.getElementById('ordTable_' + selIndex);
    var curSelectedData = document.getElementById('ordTbl_' + selIndex);
    var ResTable = document.getElementById('ResTable');
    var ResTable2 = document.getElementById('ResTable2');
    var bgColor = "#e3e3e3";
    var highlightColor = "#ffffcc";

    isUpdateDisabled = true;

    if (isMultiSelectOrder) {
        if (curSelectedRow) {

            if (SelectedMultiOrder.includes("##" + selIndex + "##")) {
                curSelectedRow.style.backgroundColor = bgColor;
                SelectedMultiOrder = SelectedMultiOrder.replace("##" + selIndex + "##", "");
                SelectedOrdersCount--;
            }
            else {
                SelectedMultiOrder = SelectedMultiOrder + "##" + selIndex + "##";
                curSelectedRow.style.backgroundColor = highlightColor;
                curSelectedOrder = selIndex;
                SelectedOrdersCount++;
            }

            
        }
    }
    else {
        if (curSelectedOrder != "") {
            if (prevSelectedRow) {
                prevSelectedRow.style.backgroundColor = bgColor;
            }
            
            hideElement("ordBtn_" + curSelectedOrder);
            showElement("ordLbl_" + curSelectedOrder);

            if (curSelectedOrder == selIndex) {
                curSelectedOrder = "";
                SelectedMultiOrder = "";
                SelectedOrdersCount = 0;
                hideElement("ordBtn_" + selIndex);
                showElement("ordLbl_" + selIndex);
                isUpdateDisabled = false;

            }
            else {
                curSelectedOrder = selIndex;
                curSelectedRow.style.backgroundColor = highlightColor;
                SelectedMultiOrder = "##" + selIndex + "##";
                SelectedOrdersCount = 1;
                showElement("ordBtn_" + selIndex);
                hideElement("ordLbl_" + selIndex);
            }
            
        }
        else {

            curSelectedOrder = selIndex;
            SelectedMultiOrder = "##" + selIndex + "##";
            document.getElementById('ordTable_' + curSelectedOrder).style.backgroundColor = highlightColor;
            SelectedOrdersCount = 1;
            showElement("ordBtn_" + selIndex);
            hideElement("ordLbl_" + selIndex);
        }
        
    }
    BuildOrderResTable();
  
    showElement("ResTable2");
    copyTextAreaToClipBoard("ResTable2");
    hideElement("ResTable2");

   // sbload('GenSb', 'Caller?p1=BoardOrderInfo&p2=' + selIndex);
  //  AdjustMainView();

}
function EnableMulti(setTo) {
    isMultiSelectOrder = setTo;

    if (!setTo) {
        //reset all
        let activeOrders = SelectedMultiOrder.split("##");
        let ResTable = document.getElementById('ResTable');
        let ResTable2 = document.getElementById('ResTable2');
        let ItemsCopiedCnt = document.getElementById('ItemsCopiedCnt');

        ResTable.innerHTML = "";
        ResTable2.value = "";
        SelectedMultiOrder = "";
        for (order in activeOrders) {
            var curOrder = activeOrders[order];
            var curelem = document.getElementById('ordTable_' + activeOrders[order]);
            if (curelem) {
                curelem.style.backgroundColor = "#e3e3e3";
                hideElement("ordBtn_" + curOrder);
                showElement("ordLbl_" + curOrder);

            }

        }
        ResTable2.value = "~";
        showElement("ResTable2");
        copyTextAreaToClipBoard("ResTable2");
        hideElement("ResTable2");
        SelectedOrdersCount = 0;
        ItemsCopiedCnt.innerText = 0;
        hideElement("ClipboardStatDiv");
        hideElement("MultiOrdBtn");
        document.getElementById('selOrders').value = "";
        BuildOrderResTable();
    }
    else {
        if (curSelectedOrder != "") {
            hideElement("ordBtn_" + curSelectedOrder);
            showElement("ordLbl_" + curSelectedOrder);
        }
        showElement("MultiOrdBtn");

        //show done all btn
    }

    isUpdateDisabled = setTo;
    

}
function MultiOrderMarkDone() {
    let activeOrders = SelectedMultiOrder.split("##");
    for (order in activeOrders) {
        var curOrder = activeOrders[order];
        var curelem = document.getElementById('ordTable_' + activeOrders[order]);
        if (curelem) {
            EliminateElement(curelem.id);
        }

    }
    document.getElementById('selOrders').value = "";
    SelectedOrdersCount = 0;
    curSelectedOrder = "";
    SelectedMultiOrder = "";
    BuildOrderResTable();
    isUpdateDisabled = false;

}
function RefreshOrdersView() {
    var OrdersShowWhat = "";
    var OrdersSortDir = "";
    if (document.getElementById("OrdersShowWhat")) {
        OrdersShowWhat = document.getElementById("OrdersShowWhat").value;
    }
    else {
        OrdersShowWhat = "NEW";
    }
    if (document.getElementById("sortDir")) {
        OrdersSortDir = document.getElementById("sortDir").value;
    }
  
    if (!isUpdateDisabled || UpdateDisableCount > 5) {
        RepAjaxUpdate("LoadOrdersView", "MainBoardContainer", "BarLoader", "OrderViewSettings");
        UpdateDisableCount = 0;
        isUpdateDisabled = false;
            
    }
    else {
        UpdateDisableCount++;
    }
   RefreshLiveStats();


}

function ResetOrderView() {
    isMultiSelectOrder = false;
    curSelectedOrder = "";
    SelectedMultiOrder = "";
    SelectedOrdersCount = 0;
    UpdateDisableCount = 0;
    isUpdateDisabled = false;
    /////
}

function RefreshLiveStats() {
    RepAjaxUpdate("RefreshLiveStats", "LiveStatsContainer", "BarLoader");
    RepAjaxUpdate("RefreshRoundsStats", "RoundStatsContainer", "RoundsStatsLoader");
    
}



function PageNavigator(thePage,param1,is_silent,param2) {
    thePage = thePage || "ORDERS";
    param1 = param1 || "";
    param2 = param2 || "";
    is_silent = is_silent || false;
    clearInterval(OrdersAutoUpdate);
    RefreshLiveStats();
    var showWhat = "";
    var theLoader = "MainLoader";

    if (!is_silent) {
        if (currentlyOpenSidebar != "") {
            controller.close(currentlyOpenSidebar);
            currentlyOpenSidebar = "";
        }
    }
    else {
        theLoader = "";
    }
    

    currentUserView = thePage;

    if (param1 != "") {
        showWhat = param1;

    }
    else {
        if (document.getElementById('showWhat')) {
            showWhat = document.getElementById('showWhat').value;
            console.log(showWhat);
        }
    }


    switch (thePage) {

        case "LOBBY":
            RepAjaxUpdate("LOBBY", "MainBoardContainer", theLoader, param1);
            break;

        case "ORDERS":
            ResetOrderView();
            OrdersAutoUpdate = setInterval(function () { RefreshOrdersView(); console.log("."); }, ordersRefreshTimer);
            RepAjaxUpdate("LoadOrdersView", "MainBoardContainer", theLoader, "OrderViewSettings","PROC");
            break;

        case "SITEORDERS":
            ResetOrderView();
            OrdersAutoUpdate = setInterval(function () { RefreshOrdersView(); console.log("."); }, ordersRefreshTimer);
            RepAjaxUpdate("LoadWebOrders", "MainBoardContainer", theLoader, "OrderViewSettings","PROC");
            break;
        case "WEBORDERS":
            ResetOrderView();
            OrdersAutoUpdate = setInterval(function () { RefreshOrdersView(); console.log("."); }, ordersRefreshTimer);
            console.log(param1);
            RepAjaxUpdate("LoadOrdersView", "MainBoardContainer", theLoader, "OrderViewSettings");
            break;
        case "NEWORDERS":
            ResetOrderView();
            OrdersAutoUpdate = setInterval(function () { RefreshOrdersView(); console.log("."); }, ordersRefreshTimer);
            RepAjaxUpdate("LoadOrdersView", "MainBoardContainer", theLoader, "OrderViewSettings", "NEW");
            break;
        case "FUTUREORDERS":
            ResetOrderView();
            OrdersAutoUpdate = setInterval(function () { RefreshOrdersView(); console.log("."); }, ordersRefreshTimer);
            RepAjaxUpdate("LoadOrdersView", "MainBoardContainer", theLoader, "OrderViewSettings", "FUTURE");
            break;

        case "NEWMEMBERS":
            RepAjaxUpdate("NEWMEMBERS", "MainBoardContainer", theLoader);
            break;
        case "MEMBERS":
            RepAjaxUpdate("MEMBERS", "MainBoardContainer", theLoader);
            break;

            
        case "CONTACTFORM":
            RepAjaxUpdate("ContactForm", "MainBoardContainer", theLoader, showWhat);
            break;

        case "JOBAPPS":
            RepAjaxUpdate("JOBAPPS", "MainBoardContainer", theLoader);
            break;
        case "WEBPROSPECTS":
            RepAjaxUpdate("WebProspects", "MainBoardContainer", theLoader, showWhat);
            break;
        case "CLIENTPROSPECTS":
            RepAjaxUpdate("ClientProspects", "MainBoardContainer", theLoader, showWhat);
            break;

        case "WEBPROSPECT":
            RepAjaxUpdate("WebProspect", "MainBoardContainer", theLoader, param1);
            break;

        case "PROSPECTSAPPROVAL":
            RepAjaxUpdate("ProspectsApproval", "MainBoardContainer", theLoader);
            break;


        case "FEEDBACKMANAGER":
            RepAjaxUpdate("FeedbackManager", "MainBoardContainer", theLoader, param1);
            break;

        case "CREDIT":
            RepAjaxUpdate("CreditManager", "MainBoardContainer", theLoader, param1);
            break;
        case "CREDITHISTORY":
            RepAjaxUpdate("CreditHistory", "MainBoardContainer", theLoader, param1);
            break;


        case "ROUNDS":
            RepAjaxUpdate("ROUNDS", "MainBoardContainer", theLoader, param1);
            break;

        case "ROUNDSADMIN":
            RepAjaxUpdate("ROUNDSADMIN", "MainBoardContainer", theLoader, param1);
            break;
        case "MENUSADMIN":
            RepAjaxUpdate("MENUSADMIN", "MainBoardContainer", theLoader, param1);
            break;

        case "DEVFORM":
            RepAjaxUpdate("DEVFORM", "MainBoardContainer", theLoader, param1);
            break;
        case "SUPPORT":
            RepAjaxUpdate("SUPPORT", "MainBoardContainer", theLoader, param1);
            break;

        case "AppSettings":
            RepAjaxUpdate("AppSettings", "MainBoardContainer", theLoader, param1);
            break;

        case "PRODUCTS":
            console.log("currentProductsView " + currentProductsView + " param1 " + param1);
            RepAjaxUpdate("PRODUCTS", "MainBoardContainer", theLoader, currentProductsView, param1);
            break;
        case "CATMANAGER":
            RepAjaxUpdate("CATMANAGER", "MainBoardContainer", theLoader, currentProductsView);
            break;
        case "SPOFFERS":
            RepAjaxUpdate("SPOFFERSADMIN", "MainBoardContainer", theLoader, param1);
        break;
        case "ROUNDBOARD":
            if (param1 > 0)
            {
                if (document.getElementById('is_delivery') && param2 == "") {
                    console.log("AAAAA: " + param2);
                    RepAjaxUpdate('Deliveries', 'round_board_container', 'MainLoader', param1, 0);
                }
                else {
                    console.log("BBBBB");
                    RepAjaxUpdate("RoundBoard", "MainBoardContainer", theLoader, param1);
                }
            }
            else {
                RepAjaxUpdate("Lobby", "MainBoardContainer", theLoader);
            }
            

            break;
        case "ROUNDBOARDCANCELLED":
            RepAjaxUpdate("RoundBoard", "MainBoardContainer", theLoader, param1,"CANCELLED",0);
            break;
            

        case "ZADMIN":
            RepAjaxUpdate("ZAdmin", "MainBoardContainer", theLoader, param1);
            break;
        case "CLOSEZREPORT":
            RepAjaxUpdate("CloseRoundZReport", "MainBoardContainer", theLoader, param1);
            break;

        case "ZREPORT":
            RepAjaxUpdate("ZREPORT", "MainBoardContainer", theLoader, param1);
            break;

        case "COUPONS":
            RepAjaxUpdate("COUPONS", "MainBoardContainer", theLoader, param1);
            break;

        case "VENDORS":
            RepAjaxUpdate("VENDORS", "MainBoardContainer", theLoader, param1);
            break;
        case "PAYMENTS":
            RepAjaxUpdate("PAYMENTS", "MainBoardContainer", theLoader, param1);
            break;

          case "REPS":
            RepAjaxUpdate("REPS", "MainBoardContainer", theLoader, param1);
            break;
        case "ROUNDLOG":
            RepAjaxUpdate("ROUNDLOG", "MainBoardContainer", theLoader, param1);
            break;
        case "DELIVERIES":
            RepAjaxUpdate("Deliveries", "MainBoardContainer", theLoader, param1);
            break;
            

        ///////////////////////////client data releated page calls

        case "ClientSync":
            RepAjaxUpdate("ClientSync", "MainBoardContainer", theLoader, param1);
            break;

        case "REGAPREAPPROVAL":
            RepAjaxUpdate("REGAPREAPPROVAL", "MainBoardContainer", theLoader, param1);
            break;

        case "ONLINEUSERS":
            RepAjaxUpdate("ONLINEUSERS", "MainBoardContainer", theLoader, param1);
            break;



        ////////////////////////////////////

    }


}

/////////////
function AjaxActions(field, value,loaderElement,param1,param2,param3,param4,param5) {
    loaderElement = loaderElement || "";
    param1 = param1 || "";
    param2 = param2 || "";
    param3 = param3 || "";
    param4 = param4 || "";
    param5 = param5 || "";
    var theHandler = "Scripts/Ajax/AjaxActions";
    var formData = new FormData();
    var noti_break = false;

    if (loaderElement != "") {
        showElement(loaderElement);
    }

    console.log("p1 " + param1);
    console.log("p2 " + param2);
    console.log("p3 " + param3);
    console.log("p4 " + param4);
    console.log("p5 " + param5);
    

        switch (field) 
        {
            case "BuyerDelay":
                hideElement('BuyerDelay_btn');
                hideElement('BuyerDelay_Cancelbtn');
                showElement('BuyerDelay_ldr');
                break;

            case "SaveMsgTemplate":
                var form = document.getElementById('msgTemplateForm');
                formData = new FormData(form);
                break;

            case "CHANGEPW":
                var form = document.getElementById('ChangePwForm');
                formData = new FormData(form);
                break;


            case "NEWMSGTEMPLATE":
            case "AllocatePreserveProspects":
            case "PresereveRepActions":
            case "ExportProspectsList":
            case "ExportPreserveList":
            case "ExportBirthdaysList":
            case "WriteOrderComment":
            case "PROSPECTAPPROVE":
            case "CONTACTRESPONSE":
            case "RegisterNewMember":
            case "SENDWELCOMEMSG":
            case "SENDMSG":
            case "VerifyOrder":
            case "RefuseOrder":
            case "WRITEUSERNOTE":
            case "UpdateMemberInfo":
            case "UpdateOrderInfo":
            case "SaveFeedbackInfo":
            case "RepInsertOrder":
            case "CreditAction":
            case "CreditReturn":
            case "CMCreditAction":
            case "CMCreditReturn":
            case "CancelCreditTransaction":
            case "SaveRoundBasicInfo":
            case "SaveRoundExpressSettings":
            case "SaveRoundPickupSettings":
            case "SaveRoundDeliveriesInfo":
            case "SetupCatalogProduct":
            case "UpdateCatalogProduct":
            case "UpdateProduct":
            case "AddCustomProductField":
            case "UpdateProductCustomField":
            case "AddPricingOption":
            case "AddNewRound":
            case "RoundFinishSetup":
            case "RoundAddSchedule":
            case "EditCatProdPricingOption":
            case "SetupProductFromCatalog":
            case "AddProductsCat":
            case "UpdateCatInfo":
            case "UpdateProductField":
            case "AddProductField":
            case "CreateVendorProductFromCatalog":
            case "UpdateCartOptions":
            case "RepUpdateOrderItems":
            case "ORDERACTION":
            case "CloseRoundZ":
            case "CancelOrder":
            case "UpdateSpecialOfferDetails":
            case "AddRoundItemPricingOption":
            case "UpdateMenuItem":
            case "AddSpecialItemToOffer":
            case "AddSpecialOffer":
            case "AddMemberDiscount":
            case "SaveCouponSettings":
            case "IssueCoupon":
            case "UpdateOrderPaymentOptions":
            case "AddVendorAddress":
            case "AddVendorTeamMemberToRound":
            case "VendorPaymentAction":
            case "DepositoryAction":
            case "SaveRoundRouteCpInfo":
            case "UpdateShippingInfo":
            case "SaveDeliverySettings":
            case "InDeliveryRouteActions":
            case "OutpostOpeningHours":
            case "CloseMainZ":
            case "CreateOrderReturn":
            case "CreateReplacementOrder":
            case "AddNewProduct":
            case "AddMenuFullfilmentOption":
            case "UpdateFullfilmentOption":
            case "AddNewVendorMenu":
            case "AddProductOption":
            case "AddProductOptionitem":
                if (document.getElementById(param1)) {
                    var form = document.getElementById(param1);
                    formData = new FormData(form);
                }
                

                break;

            case "EditRoundSpecial":
            case "AddRoundSpecial":
                var form = document.getElementById(param1);
                formData = new FormData(form);
                hideElement('RoundSpOfferBtn');
                showElement('RoundSpOfferBtnLoader');
                break;

        }

        formData.append("theAction", field);
        formData.append("field", field);
        formData.append("value", value);
        formData.append("param1", param1);
        formData.append("param2", param2);
        formData.append("param3", param3);
        formData.append("param4", param4);
        formData.append("param5", param5);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var theRes = this.responseText;
                switch (field) {
                    case "REACHOUTMSGSENT":
                    case "DEACTIVATEWANUM":
                    case "POSTPONEREACHOUT":
                    case "DELETIONUPONUSERREQUEST":
                    case "PROSPECTBADCONTACT":
                    case "PROSPECTDUPLICATE":
                    case "PROSPECTNOTINERESTED":
                    case "PROSPECTNOWANUM":
                    case "PROSPECTMSGSENT":
                        if (callerSidebar == "") { callerSidebar = "MainSb"; }
                        clearContent(currentlyOpenSidebar + "Content");
                        controller.open(callerSidebar);
                        EnableControlButton();
                        EliminateElement('prospect_' + value);
                        break;
                    case "CANCELPROSPECTACTION":
                        EnableControlButton();
                        ControlButton();
                        break;

                    case "PROSPECTAPPROVE":

                        if (!theRes.startsWith("!$!")) {
                            sbload('MainSb', 'Caller?p1=CONTACTRESPONSE&reachout_type=PROSPECTMSG&member_id=' + value);
                        }
                        break;

                    case "WEBPROSPECTDENY":
                    case "WEBPROSPECTREVIEW":
                        if (!theRes.startsWith("!$!")) {
                            PageNavigator("WEBPROSPECTS");
                            RefreshLiveStats();
                            controller.close(currentlyOpenSidebar);
                            currentlyOpenSidebar = "";

                        }
                        break;


                    case "FINALDELETEMEMBER":
                    case "DELETEMEMBER":
                        EliminateElement('prospect_' + value);
                        break;



                    case "ADDUSER":
                    case "DELUSER":
                        clearContent("InfoContent");
                        sbload('JoinAdmin', 'Caller?p1=UsersAdmin');
                        break;

                    case "CHANGEPW":
                        clearContent("InfoContent");
                        controller.close('Info');
                        break;

                    case "SaveMsgTemplate":
                    case "NEWMSGTEMPLATE":
                    case "DELTEMPLATE":
                        sbload('MainSb', 'Caller?p1=msgTemplates');
                        clearContent("SubMenuContent");
                        break;

                    case "AllocatePreserveProspects":
                        if (!theRes.startsWith("!$!")) {
                            sbload('MainSb', 'Caller?p1=PreserveMembers');
                        }
                        else {
                            hideElement('GoPreserveListLoader');
                            showElement('btnGoPreserveList');
                        }
                        break;

                    case "PresereveRepActions":
                        if (!theRes.startsWith("!$!")) {
                            if (param2 == "DELETE") {
                                sbload('MainSb', 'Caller?p1=PreserveMembers');
                            }
                            else {
                                console.log("2222");
                                //RepAjaxUpdate('PresereveRepActions', 'SubMenuContent', 'SubMenuLoader', 'PreserveListViewSettings', value)    
                            }
                        }
                        break;

                    case "ExportProspectsList":
                            document.getElementById('download_iframe').src = "/tmpFiles/prospectsList.csv?random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
                            showElement('blasterListBtn');
                            hideElement('blasterListLoader');
                        break;

                    case "ExportPreserveList":
                            document.getElementById('download_iframe').src = "/tmpFiles/PreserveList.csv?random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
                            showElement('blasterListBtn');
                            hideElement('blasterListLoader');
                        break;
                    case "ExportBirthdaysList":
                        document.getElementById('download_iframe').src = "/tmpFiles/BirthDayList.csv?random=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000);
                        showElement('blasterListBtn');
                        hideElement('MainLoader');
                        break;

                    case "KillLog":
                                sbload('JoinAdmin','Caller?p1=SysLog');
                        break;

                    case "LOGOUT":
                        window.location.href = "/";
                        break;

                    case "MemberDelete":
                        if (!theRes.startsWith("!$!")) {
                            document.getElementById('MemberSearchText').value = '';
                            document.getElementById('ResultsDiv').innerHTML = '';
                            ControlButton();
                        }
                        break;

                    case "WriteOrderComment":
                    case "SetOrderActiveState":
                    case "SetOrderBoardColor":
                    case "UpdateOrderInfo":
                        if (!theRes.startsWith("!$!")) {
                            if (param3 == "M") {
                                console.log("M");
                                MiscActions("UpdateBoardOrder", param2);
                                PageNavigator('ROUNDBOARD', param4);

                                
                            }
                            else {
                                if (param2 != 0) {
                                    sbload('MainSb', 'Caller?p1=OrdersNotes&p2=' + param2);
                                }
                                else {
                                    refreshCurrentView();
                                }
                            }

                            
                        }
                        break;

                    case "CONTACTRESPONSE":
                        refreshCurrentView(false);
                        RefreshLiveStats();
                        break;
                        
                    case "RegisterNewMember":
                        if (!theRes.startsWith("!$!")) {
                            RefreshLiveStats();

                            switch (param3) {
                                case "WebProspect":
                                    var m_id = theRes;
                                    //RepAjaxUpdate("WebProspects", "MainBoardContainer", "MainLoader", "AFTERNICK");
                                    refreshCurrentView(false);
                                    sbload('MainSb', 'Caller?p1=CONTACTRESPONSE&reachout_type=MEMBERWELCOME&member_id=' + m_id);
                                    console.log('add ok p3=' + m_id);
                                    break;

                                case "PROSPECTMSG":
                                    refreshCurrentView(false);
                                    break;

                                case "QuickAdd":

                                    RefreshLiveStats();
                                    document.getElementById('QuickAddMember').reset();
                                    document.getElementById('QuickAddErrMsg').innerHTML = theRes;
                                    showElement('QuickAddErrMsg');

                                    break;

                                default:
                                    //RepAjaxUpdate("ContactForm", "MainBoardContainer", "MainLoader");
                                    refreshCurrentView();
                                    sbload('MainSb', 'Caller?p1=CONTACTRESPONSE&p2=' + param2);
                                    console.log('add ok p2=' + param2);
                                    break;
                            }

                        }
                        else {
                            switch (param3) {
                                case "QuickAdd":
                                    console.log(theRes.replace("!$!", ""));
                                    document.getElementById('QuickAddErrMsg').innerHTML = theRes.replace("!$!", "");
                                    showElement('QuickAddErrMsg');
                                    break;

                                default:
                                    break;
                            }
                        }
                        break;

                    case "SENDWELCOMEMSG":
                        //RepAjaxUpdate("NEWMEMBERS", "MainBoardContainer", "MainLoader");
                        refreshCurrentView(false);
                        RefreshLiveStats();
                        break;

                    case "SENDMSG":
                        RefreshLiveStats();
                        refreshCurrentView(false);
                        /*
                        if (param2 == "WELCOMEMSG" || param2 == "DELWELCOMEMSG") {
                            RepAjaxUpdate("NEWMEMBERS", "MainBoardContainer", "MainLoader");
                            RefreshLiveStats();
                        }
                        if (param2 == "PROSPECTREFRESHMSG" || param2 == "DELPROSPECTREFRESHMSG") {
                            RepAjaxUpdate("WebProspects", "MainBoardContainer");
                            RefreshLiveStats();
                        }
                        */
                        break;
                        
                        
                    case "WEPROSPECTMSGSENT":
                       // RepAjaxUpdate("WebProspects", "MainBoardContainer");
                        refreshCurrentView(false);
                        RefreshLiveStats();
                        break;


                    case "VerifyOrder":
                    case "RefuseOrder":
                        refreshCurrentView(false);
                        RefreshLiveStats();
                        if (param2) {
                            var m_id = 0;
                            var tmp = theRes.split("##");
                            m_id = tmp[0];
                            sbload('MainSb', 'Caller?p1=CONTACTRESPONSE&reachout_type=ORDERWELCOME&member_id=' + m_id);
                        }
                        else {
                            sbClose();
                        }
                        
                        break;

                    case "WRITEUSERNOTE":
                    case "UpdateMemberInfo":
                    case "MARKMEMBERNEW":
                    case "CreditAction":
                    case "CreditReturn":
                        if (!theRes.startsWith("!$!")) {
                            sbload('MainSb', 'Caller?p1=Member_Info&p2=' + param2);
                        }
                        break;

                    case "CMCreditAction":
                    case "CMCreditReturn":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('SelectCreditMember', 'NewOrderMemberContainer');
                            RepAjaxUpdate('DebtsStatus', 'DebtsStatusDiv', 'MainLoader');
                            RepAjaxUpdate('CreditStatus', 'CreditStatusDiv');

                        }
                        break;

                    case "SaveFeedbackInfo":
                    case "SetFbEntryColor":
                        if (!theRes.startsWith("!$!")) {
                            PageNavigator('FEEDBACKMANAGER', param2, true);
                        }
                        break;

                    case "SetJobAppEntryColor":
                        if (!theRes.startsWith("!$!")) {
                            PageNavigator('JOBAPPS', param2, true);
                        }
                        break;

                    case "RepInsertOrder":

                        if (!theRes.startsWith("!$!")) {
                            PageNavigator('ORDERS', param1);
                        }
                        break;

                    case "UndeleteOrder":
                    case "RepDeleteOrder":
                        ResetOrderView(); RepAjaxUpdate('LoadOrdersView', 'MainBoardContainer', 'MainLoader', 'OrderViewSettings');
                        break;

                    case "ActivatePostponedOrder":

                        if (!theRes.startsWith("!$!")) {
                            PageNavigator('FUTUREORDERS');
                        }
                        break;

                        
                    case "CreditPostponePayment":

                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('CreditEntryInfoRow', 'CreditEntryInfoRow_' + param1, '', param1);
                            RepAjaxUpdate('CreditEntryRow', 'CreditEntryRow_' + value, '', value);
                            RepAjaxUpdate('CreditStatus', 'CreditStatusDiv');
                        }
                        break;    

                    case "CancelCreditTransaction":
                        PageNavigator('CREDIT');
                        break;

                    case "SaveRoundBasicInfo":
                    case "RoundFinishSetup":
                        
                        sbload('GenSb', 'Caller?p1=RoundEdit&p2=' + value + '&p3=' + param2);
                        break;
                    case "MenuFinishSetup":
                    case "DeActivateRound":
                        
                        sbload('GenSb', 'Caller?p1=VendorMenuEdit&p2=' + value );
                        break;
                    case "SortRoundOrder":
                    case "AddNewRound":

                        PageNavigator('ROUNDSADMIN');
                        break;
                    case "AddNewVendorMenu":

                        PageNavigator('MENUSADMIN');
                        break;

                    case "DeActivateRound_old":
                    case "DeleteRound":
                        
                        sbload('GenSb', 'Caller?p1=RoundEdit&p2=' + value + '&p3=' + param2);
                        RepAjaxUpdate("ROUNDSADMIN", "MainBoardContainer", "MainLoader", param1);

                        break;
                        
                    case "DeleteProduct":

                        PageNavigator('PRODUCTS');
                     //   controller.close(currentlyOpenSidebar);
                     //   currentlyOpenSidebar = "";
                      //  AdjustMainView();
                        break;

                    case "AddProduct":
                        if (theRes.startsWith("!$!")) {
                            theRes = theRes.substring(3);
                            var resArr = theRes.split("!$!");
                        }

                        PageNavigator('PRODUCTS',param1);
                        sbload('GenSb', 'Caller?p1=ProductEdit&p2=' + resArr[0]);
                        AdjustMainView();
                        Notify(resArr[1]);
                        noti_break = true;
                        break;

                    case "AddNewProduct":
                        if (theRes.startsWith("!$!")) {
                            theRes = theRes.substring(3);
                            
                            Notify(theRes);
                            console.log('resArr[1]:' + theRes)
                        }
                        else {
                            PageNavigator('PRODUCTS', param2);
                      //      sbload('GenSb', 'Caller?p1=ProductEdit&p2=' + resArr[0]);
                        //    AdjustMainView();
                            Notify(theRes);
                            console.log('theRes:' + theRes)
                        }
                        
                        
                        noti_break = true;
                        break;

                    case "SetupCatalogProduct":
                    case "ActivateCatalogProduct":
                    case "UpdateCatalogProduct":
                    case "UpdateProduct":
                    case "ActivateProduct":
                    case "SetupProductFromCatalog":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate("PRODUCTS", "MainBoardContainer", "MainLoader", currentProductsView);
                            sbload('GenSb', 'Caller?p1=ProductEdit&p2=' + value);
                        }
                        break;

                        //////////////////////////////////
                   

                    case "UpdateProductCustomField":
                    case "ProdCustomFieldProtectionOff":
                        RepAjaxUpdate('UpdateProductCustomField', 'customFieldDiv_' + param2, 'CustomFieldLoader', value, param2);
                        //Notify(theRes, 1);
                        console.log(value);
                        break;


                    case "ActivateProductCustomField":
                    case "DeActivateProductCustomField":
                    case "ProdCustomFieldMoveUp":
                    case "ProdCustomFieldMoveDown":
                    case "ProdCustomFieldEditableOff":
                    case "ProdCustomFieldEditableOn":
                    case "ProdCustomFieldRequiredOff":
                    case "ProdCustomFieldRequiredOn":
                    case "AddCustomProductField":
                    case "DeleteCustomProductField":
                        //Notify(this.responseText, 1);
                        RepAjaxUpdate('ActivateProductCustomField', 'ProductCustomFieldsDiv', 'CustomFieldLoader', value, param1);
                        break;

                    case "DeleteProductField":
                        //Notify(this.responseText, 1);
                        EliminateElement('fieldDiv_' + value);
                        break;
                 
                    case "AddPricingOption":
                    case "DeletePricingOption":
                    case "EditCatProdPricingOption":
                    case "ProdPriceOptionFavToggle":
                        if (!theRes.startsWith("!$!")) {
                            console.log("afsdfasdfasdfavzxcvzxcv123123");
                            RepAjaxUpdate('AddPricingOption', 'AddPricingOptionsContainer', 'AddProductLoader', param2, param3);
                            RepAjaxUpdate('DeletePricingOption', 'PricingOptionsContainer', 'AddProductLoader', param2, param3);
                        }
                        break;

                    case "RoundDeleteSchedule":
                    case "RoundAddSchedule":
                    case "OutpostOpeningHours":
                    case "RoundUpdateTimeTable":
                    case "AddDeliveryToSchedule":
                    case "CreateDeliveriesForAllSchedulesInRound":
                        if (!theRes.startsWith("!$!")) {
                            sbload('GenSb', 'Caller?p1=RoundEdit&p2=' + value + '&p3=' + param2); AdjustMainView();
                            MiscActions("ROUNDBOARDUPDATE", param1);

                        }
                        
                        break;

                    case "AddProductsCat":
                        if (value == 0) {
                             PageNavigator("CATMANAGER", '', true);
                        }
                        else {
                            RepAjaxUpdate('CatList', param2 + 'LISTDIV', '', value, param2);
                        }
                       
                        
                        break;

                    case "AddProductField":
                    case "CatCustomFieldMoveUp":
                    case "CatCustomFieldMoveDown":
                       // Notify(this.responseText, 1);
                        RepAjaxUpdate('FieldsList', 'CUSTOMFIELDSDIV', 'ContentLoader', value, param2);
                        break;
                    case "DeleteCat":
                        EliminateElement('catDiv_' + value);
                        if (param1 == "MAIN") {
                            sbClose();
                            AdjustMainView('right', 'CLOSE');
                        }
                        break;

                    case "UpdateProductField":
                        RepAjaxUpdate('ProductFieldEntry', 'fieldDiv_' + value, 'ContentLoader', value);
                        break;


                    case "DeletePic":
                    case "PrimaryPic":
                        sbload('GenSb', 'Caller?p1=ProductEdit&p2=' + param1);
                        break;


                    case "CreateVendorProductFromCatalog":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate("PRODUCTS", "MainBoardContainer", "MainLoader");
                            RepAjaxUpdate('CreateVendorProductFromCatalog', 'SubProductsContainer', 'ActiveProductsLoader', value);
                        }
                        

                        break;


                case "AddProductToRound":
                case "RemoveMenuItemFromRound":
                        RepAjaxUpdate('RoundMenu', 'RoundMenuDiv', 'RoundMenuLoader', value);
                    break;

                    case "AddToCart":
                    case "RemoveFromCart":

                        if (field == "AddToCart") {
                            hideElement('spinner_' + value);
                        }
                        
                        //showElement('add_btn_' + value);
                        RepAjaxUpdate('OrderEditBar', 'OrderEditBarDiv', '', param2);
                        RepAjaxUpdate('RoundMenuItemRow', 'menuItem_' + param3, 'MainLoader' , param2, value, param3);
                        RepAjaxUpdate('UpdateCartView', 'cartContainerDiv', '', param2);
                        RepAjaxUpdate('OrderCouponsList', 'CouponsContainerDiv', '', param2);

                        break;
                    case "UpdateCartOptions":
                    case "APPLYCOUPONTOORDER":
                    case "RemoveCouponFromCart":
                        if (!theRes.startsWith("!$!")) {
                            hideElement('OrderOptionsLoader');
                            RepAjaxUpdate('OrderEditBar', 'OrderEditBarDiv', 'OrderOptionsLoader', value);
                            RepAjaxUpdate('UpdateCartView', 'cartContainerDiv', 'OrderOptionsLoader', value);
                            RepAjaxUpdate('OrderCouponsList', 'CouponsContainerDiv', '', value);
                            console.log("UPDATE ORDER: " + value)
                        }
                        else {
                            hideElement('OrderOptionsLoader');
                        //    Notify(theRes.replace("!$!", ""), 3);
                        }
                        break;

                        
                    case "RepUpdateOrderItems":
                    case "OrderCartReset":
                    case "UpdateOrderPaymentOptions":
                    case "ResetOrderPaymentOptions":
                    case "CancelOrder":
                    case "UpdateShippingInfo":
                        if (!theRes.startsWith("!$!")) {
                            sbload('GenSb', 'Caller?p1=BoardOrderInfo&p2=' + value);
                            MiscActions("UpdateBoardOrder", value);
                            MiscActions("ROUNDBOARDUPDATE");
                        }
                  
                        break;

                    case "AddMultiOrdersToDelivery":
                        if (!theRes.startsWith("!$!")) {
                            MiscActions("ROUNDBOARDUPDATE");
                        }
                  
                        break;
                    case "AddOrderToDelivery":
                    case "RemoveOrdersFromDelivery":
                        if (!theRes.startsWith("!$!")) {
                            MiscActions("UpdateBoardOrder", value);
                            MiscActions("ROUNDBOARDUPDATE",param1);
                        }
                        break;
                    case "RemoveRouteFromDelivery":
                    case "SaveDeliverySettings":
                    case "CreateScheduledDeliveriesForRound":
                    case "SetRoundActiveDelivery":
                    case "DeleteDeliveryFromRound":
                    case "CreateNewDeliveryInRound":

                        if (!theRes.startsWith("!$!")) {
                            MiscActions("ROUNDBOARDUPDATE",param1);
                        }
                        break;
                    case "AddOrderToRoute":
                    case "SortRouteOrder":
                    case "ChangeRouteDriver":
                    case "ClearRouteDriver":
                    case "CommitAppDeliveryRoutes":
                    case "InDeliveryRouteActions":
                        if (!theRes.startsWith("!$!")) {
                            MiscActions("ROUNDBOARDUPDATE", param3);
                            if (field == "CommitAppDeliveryRoutes") {
                                sbClose(currentlyOpenSidebar);
                                AdjustMainView("right","CLOSE");
                            }
                        }
                        break;
                    case "ORDERACTION":

                        if (theRes.startsWith("##")) {
                            var order_id = 0;
                            var round_id = 0;
                            var tmp = theRes.split("#$#");
                            order_id = tmp[0]; order_id = order_id.replace("##", "");
                            round_id = tmp[1];
                            theRes = tmp[2];
                            //sbload('MainSb', 'Caller?p1=CONTACTRESPONSE&reachout_type=ORDERWELCOME&member_id=' + m_id);

                            console.log('order_id '+order_id);
                            console.log('round_id '+round_id);
                            PageNavigator('ROUNDBOARD', round_id);
                            sbload('GenSb', 'Caller?p1=BoardOrderInfo&p2=' + order_id);
                            AdjustMainView();

                        }
                        else {
                            if (!theRes.startsWith("!$!")) {
                                sbload('GenSb', 'Caller?p1=BoardOrderInfo&p2=' + value);
                                MiscActions("UpdateBoardOrder", value);

                                MiscActions("ROUNDBOARDUPDATE");


                            }
                        }
                        
                      
                  
                        break;

                        
                   
          

                    case "RoundOpenForOrders":
                        MiscActions("ROUNDBOARDUPDATE");

                        break;

                    case "CloseRoundZ":
                        if (!theRes.startsWith("!$!")) {
                            PageNavigator("CLOSEZREPORT", value);
                        }
                        
                        break;
                    case "CloseMainZ":
                        if (!theRes.startsWith("!$!")) {
                            PageNavigator("ZADMIN");
                        }

                        break;
                        
                    case "UpdateSpecialOfferDetails":
                    case "RemoveSpecialItemFromOffer":
                    case "AddSpecialItemToOffer":
                        RepAjaxUpdate('RemoveSpecialItemFromOffer', 'AddSpecialItemDiv', 'spOfferAddItemsLoader', value);
                        RepAjaxUpdate('UpdateSpecialOfferInfo', 'spOfferItemsListDiv', 'spOfferItemsLoader', value);
                        break;

                    case "NewSpecialOffer":
                        PageNavigator('SPOFFERS');
                        break;

                    case "DeleteRoundMenuPricingOption":
                    case "AddRoundMenuPricingOption":
                    case "UpdateMenuItem":
                        Notify(this.responseText, 1);
                        sbload('ProductEditor', 'AdminCaller?p1=MenuItemEdit&p2=' + value);
                        break;

                    case "AddRoundSpecial":
                        Notify(this.responseText, 1);
                        RepAjaxUpdate('RoundsListForSpOffer', 'RoundsListForSpOfferContainer', 'RoundSpOfferCreatorLoader', param2);
                        RepAjaxUpdate('AddSpecialToRound', 'AddSpecialToRoundContainer', 'RoundSpOfferCreatorLoader', param2);
                        break;

                    case "RemoveSpecialOffer":
                    case "AddSpecialOffer":
                        // Notify(theRes.replace("!$!", ""), 3);
                        console.log(theRes);
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('OrderEditBar', 'OrderEditBarDiv', '', param4);
                            RepAjaxUpdate('RoundSpOfferEntry', 'spOfferEntry_' + value, 'spOfferLoader_' + value, param2, value, param3, param4);
                            RepAjaxUpdate('UpdateCartView', 'cartContainerDiv', '', param4);
                            RepAjaxUpdate('OrderCouponsList', 'CouponsContainerDiv', '', param4);
                            console.log("asasdasdasd");
                        }

                        break;

                    case "AddOfferToAllRounds":
                        sbload('GenSb', 'Caller?p1=SpecialEdit&p2=' + value);
                        break;

                    case "RoundZDateChange":
                    case "UpdateRoundScheduledDelvery":
                        if (!theRes.startsWith("!$!")) {
                            MiscActions('ROUNDBOARDUPDATE');
                        }
                     
                        break;

                    case "AddMemberDiscount":
                    case "DeleteMemberDiscount":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('MemberDiscount', 'MemberDiscountDiv', '', value);
                        }

                        break;
                        
                    case "NewCoupon":
                        PageNavigator("COUPONS");
                        break;

                    case "SaveCouponSettings":
                        PageNavigator("COUPONS", '', true);
                        sbload('GenSb', 'Caller?p1=CouponInfo&p2=' + value);
                        AdjustMainView();
                        break;

                    case "SetCouponActiveState":
                        PageNavigator("COUPONS", '', true);
                        sbload('GenSb', 'Caller?p1=CouponEdit&p2=' + value);
                        AdjustMainView();
                        break;

                    case "CouponDelete":
                        PageNavigator("COUPONS", '');
                        break;

                    case "CouponRevoke":
                    case "IssueCoupon":
                        RepAjaxUpdate('IssuedCoupons', 'MemberCouponsDiv', '', param2);
                        break;
                    case "AddVendorTeamMemberToRound":
                    case "RemoveVendorTeamMemberFromRound":
                        RepAjaxUpdate('RoundSettingsView', 'GenSbContent', 'GenSbLoader', param2, param4)
                        break;
                    case "VendorPaymentAction":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('PAYMENTS', 'MainBoardContainer', 'MainLoader', param2);
                        }
                        break;
                    case "DepositoryAction":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('PAYMENTS', 'MainBoardContainer', 'MainLoader', -1);
                        }
                        break;
                    case "AddServiceArea":
                    case "DeleteServiceArea":
                        if (!theRes.startsWith("!$!")) {
                            PageNavigator('AppSettings');
                        }
                        break;
                    case "SaveRoundRouteCpInfo":
                    case "SaveRoundExpressSettings":
                    case "SaveRoundPickupSettings":
                        if (!theRes.startsWith("!$!")) {
                            sbload('GenSb', 'Caller?p1=RoundCP&p2=' + value);
                        }
                        break;

                        
                    case "CreateRegistrationPreApprovalToken":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('PreApprovals', 'PreApprovalListDiv', 'MainLoader');
                        }
                        break;


                        
                    case "AddMenuFullfilmentOption":
                    case "UpdateFullfilmentOption":
                        if (!theRes.startsWith("!$!")) {
                            sbload('GenSb', 'Caller?p1=VendorMenuEdit&p2=' + value);
                        }
                        else {
                            document.getElementById('FulfilmentOptionErrMsg').innerHTML = theRes.replace("!$!", "");
                            showElement('FulfilmentOptionErrDiv');
                            noti_break = true;
                        }
                        break;

                    case "MenuItemIsFeaturedToggle":
                        if (!theRes.startsWith("!$!")) {
                            RepAjaxUpdate('EditMenuItems', 'RoundMenuDiv', 'MainLoader', param2);
                        }
                        break;

                        
                }


                var retString = "";
                retString = theRes.replace("!$!", "");
                retString = retString.replace("$!$", "");

                if (retString != "" && !noti_break) {
                    console.log("B:" + retString);
                    Notify(retString, 1);
                }
                if (loaderElement != "") {
                    hideElement(loaderElement);
                }
            } 

        };
        xmlhttp.open("POST", theHandler, true);
        xmlhttp.send(formData);
    }

function SearchMember(str, askingPage, retElement) {
        askingPage = askingPage || "";
    retElement = retElement || "ResultsData";
    let loaderElement = "SearchLoader";
    let retContainer = "ResultsDiv";
    // searchBoxCloseTimer = setInterval(function () { ResetSearch(); console.log("."); }, 1000);
    console.log(loaderElement);

        if (str.length == 0) 
        {

            switch (askingPage) {
                case "MembersAdmin":
                    hideElement(loaderElement);
                    hideElement(retContainer);
                    document.getElementById(retElement).innerHTML = '';
                    break;
                case "MainPage":
                    hideElement(loaderElement);
                    hideElement(retContainer);
                    document.getElementById("MainSearchBox").value = '';
                    document.getElementById(retElement).innerHTML = '';
                    break;
                case "NewOrder":
                    retContainer = "NewOrderNameSearchContainter";
                    loaderElement = "NewOrderSearchLoader";
                    hideElement(loaderElement);
                    hideElement(retContainer);
                    document.getElementById("NewOrderSearchBox").value = '';
                    document.getElementById(retElement).innerHTML = '';
                    break;
                case "NewCredit":
                    retContainer = "NewOrderNameSearchContainter";
                    loaderElement = "NewOrderSearchLoader";
                    hideElement(loaderElement);
                    hideElement(retContainer);
                    document.getElementById("NewOrderSearchBox").value = '';
                    document.getElementById(retElement).innerHTML = '';
                    break;

                    
                case "CouponsIssue":
                    retContainer = "CouponsResultsDiv";
                    retElement = "CouponsResultsData";
                    loaderElement = "CouponsMemberLoader";
                    hideElement(loaderElement);
                    hideElement(retContainer);
                    document.getElementById("CouponIssueSearchBox").value = '';
                    document.getElementById(retElement).innerHTML = '';
                    break;

                    
                case "ApprovalPage":
                    retContainer = "ApprovalResultsDiv";
                    retElement = "ApprovalsResultsData";
                    loaderElement = "CouponsMemberLoader";
                    hideElement(loaderElement);
                    hideElement(retContainer);
                    document.getElementById("prSearchBox").value = '';
                    break;

            }

        }
         else 
         {
            switch (askingPage) {
                case "MembersAdmin":
                    showElement(loaderElement);
                    break;
                case "MainPage":
                    showElement(loaderElement);
                    break;
                case "NewOrder":
                    retContainer = "NewOrderNameSearchContainter";
                    loaderElement = "NewOrderSearchLoader";

                    showElement(retContainer);
                    showElement(retElement);
                    showElement(loaderElement);
                    break;
                case "NewCredit":
                    retContainer = "NewOrderNameSearchContainter";
                    loaderElement = "NewOrderSearchLoader";

                    showElement(retContainer);
                    showElement(retElement);
                    showElement(loaderElement);
                    break;

                case "CouponsIssue":
                    retContainer = "CouponsResultsDiv";
                    retElement = "CouponsResultsData";
                    loaderElement = "CouponsMemberLoader";
                    showElement(retContainer);
                    showElement(retElement);
                    showElement(loaderElement);
                    break;

                case "ApprovalPage":
                    retContainer = "ApprovalResultsDiv";
                    retElement = "ApprovalsResultsData";
                    loaderElement = "CouponsMemberLoader";
                    showElement(retContainer);
                    showElement(retElement);
                    //showElement(loaderElement);
                    break;
            }

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    showElement(retContainer);

                    if (document.getElementById(retElement)) {
                        document.getElementById(retElement).innerHTML = this.responseText;

                    }

                    hideElement(loaderElement);

                } console.log("AAA " + retElement +" BBB " + str);
            };
            xmlhttp.open("GET", "Scripts/Ajax/AjaxSearchMember?a=" + askingPage + "&q=" + str, true);
            xmlhttp.send();
        }
    }

function AjaxUpdate(theAction,return_container,loaderElement,param1,param2) {
    loaderElement = loaderElement || "";
    param1 = param1 || "";
    param2 = param2 || "";

    var handlerUrl = "";
    var formData = new FormData();
    var is_loader = true;
    handlerUrl = "Scripts/Ajax/ReportsAjaxHandler";
    if(loaderElement!=""){
        showElement(loaderElement);
    }

    switch(theAction){
        case 'NonActiveReport':
            var form = document.getElementById('NonActiveReport');
            formData = new FormData(form);
            break;
    }

    formData.append("theAction", theAction);
    formData.append("param1", param1);
    formData.append("param2", param2);


    if(theAction=="ROUNDITEMINFO"){
         formData.append("item_id", param1);
    }
  
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                document.getElementById(return_container).innerHTML = this.responseText;
                showElement(return_container);
                if (loaderElement != "") {
                    hideElement(loaderElement);
                }

                switch(theAction)
                {
                    case 'NonActiveReport':
                    if(IsAccordion('ReportSettingsAcc')){Accordionize('ReportSettingsAcc');}
                    break;
                }   

                if (theAction == "ROUNDITEMINFO") {
                    Accordionize('btnAccRounds');
                }


            } 
        };

        xmlhttp.open("POST", handlerUrl, true);
        xmlhttp.send(formData);
    }

function ParsePastedData(PastedText,PasteWhat,is_commit) {
            is_commit = is_commit || "";
            var formData = new FormData();
            formData.append("PastedText", PastedText);
            formData.append("theAction", PasteWhat);
            formData.append("is_commit", is_commit);

            var handlerUrl = "Scripts/Ajax/AjaxParsePastedData";

            if(PasteWhat=="NORMALIZECONTACTS"){
                handlerUrl = "Scripts/Ajax/AjaxNormalizePastedData";
            }

            if(is_commit==""){
                controller.open("Info");
                currentlyOpenSidebar = "Info";
                showElement("InfoLoader");    
            }
            else
            {
                hideElement('PasteCommitBtn');
                showElement('PasteCommitloader');
            }
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    if (is_commit == "") {
                        hideElement('InfoLoader');
                        if(PasteWhat=="NORMALIZECONTACTS"){
                            document.getElementById("ResultsDiv").innerHTML = this.responseText;
                        }
                        else{
                            document.getElementById("InfoContent").innerHTML = this.responseText;    
                        }
                            document.getElementById("InfoContent").innerHTML = this.responseText;    
                    }
                    else {
                        Notify(this.responseText, 1);
                        sbload('JoinAdmin','SyncInfo');
                        clearContent('InfoContent');
                        console.log('asdfasdf');
                    }


                   
                } 
            }; 

            xmlhttp.open("POST", handlerUrl, true);
            xmlhttp.send(formData);

        }

function SyncOrdersFile(is_commit) {
    is_commit = is_commit || "";
    if(is_commit==""){
    controller.open("Info");
    currentlyOpenSidebar = "Info";
    showElement("InfoLoader");        
    }
    else
    {
      hideElement('OrdersSyncCommitBtn');
      showElement('OrdersSyncCommitloader');
    }
    

    var form=document.getElementById("pbUploadOrders");
    var formData = new FormData(form);
     formData.append("is_commit", is_commit);

    var pbar_txt = document.getElementById("pbar_txt");
    var pbar_bar = document.getElementById("pbar_bar");

    
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if(is_commit==""){
                document.getElementById("InfoContent").innerHTML = this.responseText;
                hideElement("InfoLoader");    
                }
                else{
                        Notify(this.responseText, 1);
                        sbload('JoinAdmin','SyncInfo');
                        clearContent('InfoContent');
                }
            }
        };

            xmlhttp.open("POST", "Scripts/Ajax/ajaxSyncOrders", true);
            xmlhttp.onprogress = function (e) {
                if (e.lengthComputable) {
                    var progress = "";
                    console.log(e.loaded + " / " + e.total)
                    progress = Math.round((e.loaded / e.total) * 100);

                    console.log(progress + "%");
                    pbar_txt.innerHTML = progress + "%";
                    pbar_bar.style.width = progress + "%";
                    console.log(pbar_bar.style.width);
                }
            }
            xmlhttp.onloadstart = function (e) {
                console.log("start")
            }
            xmlhttp.onloadend = function (e) {
                console.log("end")
            }

            xmlhttp.send(formData);

        }
//////////////////

function RepAjaxAction(theAction, value, param1, param2,param3,param4) {
        param1 = param1 || "";
        param2 = param2 || "";
        param3 = param3 || "";
        param4 = param4 || "";
        var theHandler = "Scripts/RepAjaxActions";

        var formData = new FormData();

                switch (theAction) {

                    case "RoundAddSchedule":
                        var form = document.getElementById(param1);
                        formData = new FormData(form);
                    break;


                    default:
                    break;
                }


        formData.append("theAction", theAction);
        formData.append("value", value);
        formData.append("param1", param1);
        formData.append("param2", param2);
        formData.append("param3", param3);
        formData.append("param4", param4);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var theRes = this.responseText;

                switch (theAction) {


                    case "AddDeliveryToRound":
                        AdminAjaxUpdate('AddDeliveryToRound', 'RoundSettingsDeliveriesDiv', 'RoundSettingsInfoLoader', value);
                        Notify(theRes.replace("!$!", ""), 1);
                        break;

                        
                    default:
                        Notify(theRes, 1);
                        break;
                }

            } console.log(this.responseText);
        };
        xmlhttp.open("POST", theHandler, true);

        xmlhttp.send(formData);
    }

function RepAjaxUpdate(theAction,return_container,loaderElement,param1,param2,param3,param4) {
    loaderElement = loaderElement || "";
    param1 = param1 || "";
    param2 = param2 || "";
    param3 = param3 || "";
    param4 = param4 || "";

    /*
        switch (theAction) {

        case "RoundSettingsView":
        case "LoadSubCat":
        case "LoadTags":
        case "PRODUCTS":
        case "AddPricingOption":
        case "DeletePricingOption":
        case "ActivateProductCustomField":
        case "DeActivateProductCustomField":
        case "ProdCustomFieldMoveUp":
        case "ProdCustomFieldMoveDown":
        case "ProdCustomFieldEditableOff":
        case "ProdCustomFieldEditableOn":
        case "ProdCustomFieldRequiredOff":
        case "ProdCustomFieldRequiredOn":
        case "AddCustomProductField":
        case "DeleteCustomProductField":
        case "LoadProductCatalog":
        case "LoadVendorInvEntities":
        case "UpdateCatInfo":
        case "AddProductsCat":
        case "CatList":
        case "AddProductField":
        case "FieldsList":
        case "ProductFieldEntry":
        case "PRODUCTIMAGES":
        case "CreateVendorProductFromCatalog":
        case "RoundMenu":
        case "ROUNDSADMIN":
        case "OrderEditBar":
        case "RoundMenuItemRow":
        case "UpdateCartView":
            break;
        default:
            if (currentlyOpenSidebar != "") {
                controller.close(currentlyOpenSidebar);
                currentlyOpenSidebar = "";
                AdjustMainView('right', 'CLOSE');
            }
            break;
    }

    */
 


    var handlerUrl = "";
    var formData = new FormData();

    handlerUrl = "Scripts/RepAjaxHandler";
    if(loaderElement!=""){
        showElement(loaderElement);
    }

    switch(theAction){
        case "URL":
            handlerUrl = param1;
            break;

        case "CalcNewList":
        case "PresereveRepActions":
        case "LoadOrdersView":
        case "LoadMessageTemplate":
        case "GetReplacementProducts":
        case "ReviewReplacementOrder":
            var form = document.getElementById(param1);
            if (form) {
                formData = new FormData(form); 
            }
            
            break;

        default:
        break;

        
    }

    formData.append("theAction", theAction);
    formData.append("param1", param1);
    formData.append("param2", param2);
    formData.append("param3", param3);
    formData.append("param4", param4);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                console.log(theAction + ":" + this.responseText);

                if (!isUpdateDisabled) {
                    document.getElementById(return_container).innerHTML = this.responseText;
                }
                else {
                    if (theAction != "LoadOrdersView") {
                        document.getElementById(return_container).innerHTML = this.responseText;
                    }
                }
                

                switch (theAction) {
                    case "RepListSettings":
                             FixAccordion('ListSettingsAcc');
                        break;
                    case "MemberDiscount":
                        FixAccordion('DiscountsInfoAcc');

                        break;

                        
                    default:
                        break;
                }


                if (loaderElement != "") {
                    hideElement(loaderElement);
                }
            }

        };

        xmlhttp.open("POST", handlerUrl, true);
        xmlhttp.send(formData);

    if (currentlyOpenSidebar == "") {
       AdjustMainView("right", "CLOSE");
    }


    }

function waLaunch(wanum) {
    var is_mobile = false;
    let url = 'whatsapp://send?phone=' + wanum;
    var waFrame = document.getElementById('wa_launch');

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        is_mobile = true;
    }

    if (is_mobile) {
        url = 'https://wa.me/' + wanum;
        window.location.href = url;
    }
    else {
        waFrame.src = url;
    }
    
    
    //console.log(url);
}

function copyTextToClipboard(theText) {
    var txtCopier = document.getElementById('txtCopier');
    txtCopier.value = theText;
    showElement('txtCopier');
    copyTextAreaToClipBoard('txtCopier');
    hideElement('txtCopier');
    txtCopier.value = '';
    console.log(theText);

}

function refreshCurrentView(is_background,param1) {
    is_background = is_background || true;
    param1 = param1 || "";
    console.log(currentUserView);
    if (currentUserView != "") {
        switch (currentUserView) {
            case "ORDERS":
                PageNavigator("ORDERS", param1, is_background);
                break;
            case "NEWORDERS":
                PageNavigator("NEWORDERS", param1, is_background);
                break;
            case "NEWMEMBERS":
                PageNavigator("NEWMEMBERS", param1, is_background);

                break;
            case "CONTACTFORM":
                PageNavigator("CONTACTFORM", param1, is_background);

                break;


            case "WEBPROSPECTS":
                PageNavigator("WEBPROSPECTS", param1, is_background);

                break;

            case "WEBPROSPECT":
                PageNavigator("WEBPROSPECT", param1, is_background);

                break;

            case "PROSPECTSAPPROVAL":
                PageNavigator("PROSPECTSAPPROVAL", param1, is_background);

                break;



        }
    }
}

function MiscActions(theAction,param1,param2,param3) {
    theAction = theAction || "";
    param1 = param1 || "";
    param2 = param2 || "";
    param3 = param3 || "";

    console.log(theAction);
    switch (theAction) {
   
        case "ResetMemberEditView":

            hideElement('LicenseEditDiv');
            hideElement('VipEditDiv');
            hideElement('BirthDateEditDiv');
            hideElement('EmailEditDiv');
            hideElement('TlgEditDiv');
            hideElement('WanumEditDiv');
            hideElement('NickEditDiv');
            hideElement('BlockEditDiv');
            hideElement('DeleteEditDiv');
            hideElement('MoreActionsEditDiv');
            hideElement('CreditSettingsDiv');
            hideElement('AreaSettingsDiv');
            
            showElement('btnEditNick');
            showElement('btnEditWanum');
            showElement('btnEditTlg');
            showElement('btnEditEmail');
            showElement('btnEditBirthDate');
            showElement('btnEditVip');
            showElement('btnEditLicense');
            showElement('btnEditBlock');
            showElement('btnEditDelete');
            showElement('btnEditMoreActions');
            showElement('btnEditCredit');
            showElement('btnEditArea');
            
            break;
        case "OrderExistingMember":

            hideElement('OrderFormFullName');
            showElement('OrderFormNick');
            hideElement('OrderFormNewMember');
            showElement('OrderFormOrderPw');

            break;
        case "ResetOrderMemberSelector":
            hideElement('disp_wanum_box');
            showElement('wanum');
            document.getElementById("disp_wanum_box").value = '';
            break;

        case "HighlightEntry":
            var entry_id = param1;
            if (currSelectedEntry != 0 && currSelectedEntry != entry_id) {
                // console.log(document.getElementById("entry_" + currSelectedEntry).style.backgroundColor);
                if (document.getElementById("entry_" + currSelectedEntry)) {
                    var oldElem = document.getElementById("entry_" + currSelectedEntry);
                    var origElemColor = "#ffffff"
                    if (document.getElementById('boardColorpicker_' + currSelectedEntry)) {
                        origElemColor = document.getElementById('boardColorpicker_' + currSelectedEntry).value;
                    }


                    if (origElemColor == "") { origElemColor = "#ffffff"; }
                    origElemColor = "#ffffff"
                    oldElem.style.backgroundColor = origElemColor;
                }
            }
            if (document.getElementById("entry_" + entry_id)) {
                currSelectedEntry = entry_id;
                var newElem = document.getElementById("entry_" + currSelectedEntry);
                newElem.style.backgroundColor = "#ffffcc";
            }
            else {
                if (DisplayAdjsutmentBreak == 0) {
                    setTimeout(function () { MiscActions("HighlightEntry", entry_id); }, 500);
                    DisplayAdjsutmentBreak++;
                }
                else {
                    DisplayAdjsutmentBreak == 0;
                }
                
            }
            //  sbload('GenSb','RepCaller?p1=BoardOrderInfo&p2=' + entry_id);
            AdjustMainView();
            break;

        case "UnHighlightEntry":
            if (currSelectedEntry != 0) {
                
                console.log("SELentry_" + currSelectedEntry);
                if (document.getElementById("entry_" + currSelectedEntry)) {
                    var oldElem = document.getElementById("entry_" + currSelectedEntry);
                    var origElemColor = "#ffffff"
                    if (document.getElementById('boardColorpicker_' + currSelectedEntry)) {
                        origElemColor = document.getElementById('boardColorpicker_' + currSelectedEntry).value;
                    }

                    if (origElemColor == "") { origElemColor = "#ffffff"; }
                    origElemColor = "#ffffff";
                    oldElem.style.backgroundColor = origElemColor;
                    currSelectedEntry = 0;
                }
            }
            break;

        case "ROUNDBOARDUPDATE":
            if (true) {

                var round_id = 0;
                var showWhat = "";
                var z_id = 0;
                var delivery_id = 0;
                if (document.getElementById('board_round_id')) {
                    round_id = document.getElementById('board_round_id').value;
                }
                if (document.getElementById('board_z_id')) {
                    z_id = document.getElementById('board_z_id').value;
                }
                if (document.getElementById('board_show_what')) {
                    showWhat = document.getElementById('board_show_what').value;
                    console.log("showWhat:0 " + showWhat);
                }
     
                if (param1 == "CANCELLED") {
                    showWhat = param1;
                }

                var lobby = '';
                if (document.getElementById('is_lobby')) {
                    lobby = 'MAIN';
                }
                if (document.getElementById('is_delivery')) {
                    lobby = 'DELIVERY';
                    if (document.getElementById('current_delivery_id')) {
                        //delivery_id = param1;
                        delivery_id = document.getElementById('current_delivery_id').value
                        console.log("delivery_id " + delivery_id);
                    }

                }


                switch (lobby) {
                    case "":
                        RepAjaxUpdate("RoundBoard", "MainBoardContainer", "RoundBoardLoader", round_id, showWhat, z_id);
                        break;

                    case "MAIN":
                        RepAjaxUpdate("LOBBY", "MainBoardContainer", "RoundBoardLoader");
                        break;

                    case "DELIVERY":
                        if (true) {
                            RepAjaxUpdate('Deliveries', 'round_board_container', 'MainLoader', round_id, delivery_id);
                            if (document.getElementById('RoundScheduleReload')) {
                                let RoundScheduleReloadId = document.getElementById('RoundScheduleReloadId').value;
                                sbload('GenSb', 'Caller?p1=RoundCP&p2=' + RoundScheduleReloadId +'&p3=SCHEDULE')
                            }
                        }
                        
                        break;

                }
                console.log("lobbyASSAAS: " + lobby);
                
                if (currSelectedEntry != 0) {
                    console.log("entry: " + currSelectedEntry);
                    setTimeout(function () { MiscActions("HighlightEntry", currSelectedEntry); }, 500);

                }
            }
            
            break;


        case "UpdateBoardOrder":
            if (true) {
                var lobby = '';
                if (document.getElementById('is_lobby')) {
                    lobby = 'MAIN';
                }

                if (document.getElementById('is_delivery')) {
                //    lobby = 'DELIVERY';
                    console.log("lobby: " + lobby);
                }

                if (document.getElementById('entry_' + param1)) {
                    RepAjaxUpdate('UpdateBoardOrder', 'entry_' + param1, '', param1, lobby);
                }

            }
            
            break;


        case "ORDERBOARDENTRYACTIONS":
            switch (param1) {
                case "APPROVE":
                    hideElement('statusActionsDiv_' + param2);
                    hideElement('ordUpdateEtaDiv_' + param2);
                    hideElement('ordDenyDiv_' + param2);
                    showElement('statusActionsApproval_' + param2);
                    Accordionize('statusActionsAcc_' + param2);
                    break;
                case "RESET":
                    document.getElementById('actionSelector_' + param2).value='';
                    if (IsAccordion('statusActionsAcc_' + param2)) { Accordionize('statusActionsAcc_' + param2); }

                    hideElement('statusActionsApproval_' + param2);
                    hideElement('ordDenyDiv_' + param2);
                    hideElement('ordUpdateEtaDiv_' + param2);
                    
                    showElement('statusActionsDiv_' + param2);
                    break;
                case "CANCEL":
                case "DENY":
                    hideElement('statusActionsDiv_' + param2);
                    hideElement('ordUpdateEtaDiv_' + param2);
                    showElement('ordDenyDiv_' + param2);
                    Accordionize('statusActionsAcc_' + param2);
                    break;
                case "ETA":
                    hideElement('statusActionsDiv_' + param2);
                    hideElement('ordDenyDiv_' + param2);
                    showElement('ordUpdateEtaDiv_' + param2);
                    Accordionize('statusActionsAcc_' + param2);
                    break;
                case "TRANSFER":
                    break;
                case "":
                    break;
            }
            break;


        case "RouteSelector":
            if (true) {
                let route_id = param1;
                let set_to = param2;
                let allOrdersFldName = "AllOrdersRoute_" + route_id;
                console.log(allOrdersFldName);

                let orders = document.getElementById('AllOrdersRoute_' + route_id).value;
                let activeOrders = orders.split("##");
                console.log("orders: " + orders + " route: " + route_id);

                for (order in activeOrders) {
                    var fldname = "RouteTbl_" + activeOrders[order];
                    if (document.getElementById(fldname)) {
                        var curElement = document.getElementById(fldname);
                        curElement.checked = set_to;
                    }
                    
                }

                if (document.getElementById('SelOrdersRoute_' + route_id)) {
                    if (set_to) {
                        document.getElementById('SelOrdersRoute_' + route_id).value = orders;
                    }
                    else {
                        document.getElementById('SelOrdersRoute_' + route_id).value = "";
                    }
                    
                }
                
            }
            break;
            

        case "ToggleOrdersEditSwitch":
            if (true) {
                let route_id = param1;
                let set_to = param2;
                let allOrdersFldName = "AllOrdersRoute_" + route_id;
                console.log(allOrdersFldName);
                console.log("asdasdasdasd");

                let orders = document.getElementById('AllOrdersRoute_' + route_id).value;
                let activeOrders = orders.split("##");
                console.log("orders: " + orders + " route: " + route_id);

                for (order in activeOrders) {
                    var fldname = "RouteTbl_" + activeOrders[order];
                    if (document.getElementById(fldname)) {
                        var curElement = document.getElementById(fldname);
                         curElement.checked = false;
                        toggle_visibility(fldname);
                    }
                    
                }
                fldname = fldname + route_id;
                if (document.getElementById(fldname)) {
                    var curElement = document.getElementById(fldname);
                    //curElement.checked = false;
                    toggle_visibility(fldname);
                }


                
            }
            break;
            
        case "OrderSelector":
            if (true) {
                let set_to = param1;
                let allOrdersFldName = "AllViewableOrders";
                console.log(allOrdersFldName);

                let orders = document.getElementById('AllViewableOrders').value;
                let activeOrders = orders.split("##");
                console.log("orders: " + orders);

                for (order in activeOrders) {
                    var fldname = "cb_order_" + activeOrders[order];
                    if (document.getElementById(fldname)) {
                        var curElement = document.getElementById(fldname);
                        curElement.checked = set_to;
                    }
                    
                }

                if (document.getElementById('SelectedOrders')) {
                    if (set_to) {
                        document.getElementById('SelectedOrders').value = orders;
                    }
                    else {
                        document.getElementById('SelectedOrders').value = "";
                    }
                    
                }
                
            }
            break;




        case "ResetItemsReturnView":
            setElementClass('itemRowSome', 'ItemRow'); 
            setElementClass('itemRowNoReturn', 'ItemRow'); 
            setElementClass('itemRowAll', 'ItemRow');
            hideElement('PartialReturnDiv');
            break;


        case "AddProductSelector":
            switch (param1) {
                case "":
                    hideElement('OptVendor');
                    hideElement('OptCat');
                    hideElement('ProductAddDiv');
                    hideElement('ProductImportDiv');

                    break;
                case "CATALOG":
                    hideElement('OptVendor');
                    hideElement('ProductImportDiv');
                    showElement('OptCat');
                    showElement('ProductAddDiv');
                    break;
                case "IMPORT":
                    hideElement('OptCat');
                    hideElement('ProductAddDiv');
                    showElement('OptVendor');
                    showElement('ProductImportDiv');
                    break;
                case "VENDOR":
                    hideElement('OptCat');
                    hideElement('ProductImportDiv');
                    showElement('OptVendor');
                    showElement('ProductAddDiv');
              
                    break;

            }
            break;


        case "ProductEditSelector":

            hideElement('ActiveProductsDiv');
            hideElement('ProductMenusDiv');
            hideElement('ProductSettingsDiv');
            hideElement('ProductPricingDiv');
            hideElement('ProductCustomFieldsDiv');
            hideElement('RoundsProductsDiv');
            hideElement('ProductEditInfoDiv');
            hideElement('ProductImagesContainer');
            showElement(param2);

            break;
        case "LoadFulfillmentOption":
            if (true) {
                hideElement('FulfilmentOptionErrDiv');

                let x = document.getElementById('ServiceSelectedAreas').value;
                let Areas = x.split("##");
                
                
                console.log('FullfilmentOptionType: ' + param1);
                switch (param1) {
                
                    case "1":
                        hideElement('ExpDeliveryInfoDiv');
                        hideElement('ExpressTimelineHeaderDiv');
                        hideElement('PickupTimelineHeaderDiv');
                        hideElement('PickupInfoDiv');
                        for (const area of Areas) {
                            if (area.trim() !== "" && !isNaN(area)) {
                               
                                hideElement('RoundArea_ETA_DIV_' + area);
                            }
                        }
                        showElement('DeliveryAreasDiv');
                        showElement('RoundTimelineHeaderDiv');
                        showElement('DeliveryInfoDiv');
                        break;
                    case "2":
                        hideElement('PickupTimelineHeaderDiv');
                        hideElement('RoundTimelineHeaderDiv');
                        hideElement('PickupInfoDiv');
                        for (const area of Areas) {
                            if (area.trim() !== "" && !isNaN(area)) {
                                
                                showElement('RoundArea_ETA_DIV_' + area);
                            }
                        }
                        showElement('DeliveryAreasDiv');
                        showElement('ExpressTimelineHeaderDiv');
                        showElement('DeliveryInfoDiv');
                        showElement('ExpDeliveryInfoDiv');
                        break;
                    case "3":
                        hideElement('ExpressTimelineHeaderDiv');
                        hideElement('RoundTimelineHeaderDiv');
                        hideElement('DeliveryInfoDiv');
                        hideElement('DeliveryAreasDiv');
                        showElement('PickupTimelineHeaderDiv');
                        showElement('PickupInfoDiv');
                        break;
                }

            }

            break;



        case "AddAreaToServiceOption":

            if (true) {
                let ServiceArea = document.getElementById('ServiceSelectedAreas');
                if (ServiceArea) {
                    if (!ServiceArea.value.includes("##" + param1 + "##")) {
                        ServiceArea.value += "##" + param1 + "##";
                        showElement('AreaInfoDiv_' + param1);
                    }
                    
                    document.getElementById("delivery_add_area").selectedIndex = 0;
                }

            }
         
            break;
        case "RemoveAreaFromServiceOption":
            if (true) {
                let ServiceArea = document.getElementById('ServiceSelectedAreas');
                if (ServiceArea) {
                    ServiceArea.value = ServiceArea.value.replace("##" + param1 + "##", "");
                    hideElement('AreaInfoDiv_' + param1);
                }
            }
           
       

            break;

        case "AutoFillServiceOptionTime":
            if (true) {
                let start_time;
                let end_time;

                switch (param1) {
                    case 1:
                        start_time = document.getElementById('sun_start_time').value;
                        end_time = document.getElementById('sun_end_time').value;
                        break;
                    case 2:
                        start_time = document.getElementById('mon_start_time').value;
                        end_time = document.getElementById('mon_end_time').value;
                        break;
                    case 3:
                        start_time = document.getElementById('tue_start_time').value;
                        end_time = document.getElementById('tue_end_time').value;
                        break;
                    case 4:
                        start_time = document.getElementById('wed_start_time').value;
                        end_time = document.getElementById('wed_end_time').value;
                        break;
                    case 5:
                        start_time = document.getElementById('thu_start_time').value;
                        end_time = document.getElementById('thu_end_time').value;
                        break;
                    case 6:
                        start_time = document.getElementById('fri_start_time').value;
                        end_time = document.getElementById('fri_end_time').value;
                        break;
                    case 7:
                        start_time = document.getElementById('sat_start_time').value;
                        end_time = document.getElementById('sat_end_time').value;
                        break;
                }

                document.getElementById('sun_start_time').value = start_time;
                document.getElementById('mon_start_time').value = start_time;
                document.getElementById('tue_start_time').value = start_time;
                document.getElementById('wed_start_time').value = start_time;
                document.getElementById('thu_start_time').value = start_time;
                document.getElementById('fri_start_time').value = start_time;
                document.getElementById('sat_start_time').value = start_time;

                document.getElementById('sun_end_time').value = end_time;
                document.getElementById('mon_end_time').value = end_time;
                document.getElementById('tue_end_time').value = end_time;
                document.getElementById('wed_end_time').value = end_time;
                document.getElementById('thu_end_time').value = end_time;
                document.getElementById('fri_end_time').value = end_time;
                document.getElementById('sat_end_time').value = end_time;



            }



            break;





        case "InitMce":
            if (true) {
                tinymce.remove();

                tinymce.init({
                    selector: '.ProdEditTb1',
                    height: 400,
                    menubar: false,
                    plugins: 'lists link table code',
                    toolbar: 'undo redo | bold italic underline | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link | code',
                    license_key: 'gpl'
                });
        
            }
            break;
        case "InitSN":
            {
                let sNFldName = "#" + param1;

                $(sNFldName).show();

                $(sNFldName).summernote({
                    placeholder: '?',
                    disableDragAndDrop: true,
                    shortcuts: false,
                    spellCheck: false,
                    disableResizeEditor: true,
                    height: 300,
                    toolbar: [
                        ['font', ['bold', 'underline', 'size']],
                        ['fontsize', ['fontsize']],
                        ['color', ['forecolor', 'backcolor']],
                        ['para', ['ul', 'paragraph']],
                        ['table', ['table']]
                    ]
                });

                hideElement(param1 + 'View');
                hideElement(param1 + '_edit_btn');
                showElement(param1 + '_cancel_btn');
            }
            break;

        case "CancelSN":
            {
                let sNFldName = "#" + param1;
                let sNRestoreFldName = param1 + "_save";

                $(sNFldName).summernote('destroy');
                $(sNFldName).hide();

                document.getElementById(param1).value = document.getElementById(sNRestoreFldName).value;

                hideElement(param1 + '_cancel_btn');
                showElement(param1 + '_edit_btn');
                showElement(param1 + 'View');
            }
            break;
        case "":
            // controller.open('msngr');
            //   currentlyOpenSidebar = 'msngr';
            break;

    }



}

function ResetSearch(theSearch) {
    theSearch = theSearch || "";

    switch (theSearch) {
        case "NewOrder":
            hideElement('NewOrderNameSearchContainter');
            hideElement('NewOrderSearchLoader');
            
            document.getElementById("NewOrderNameSearch").innerHTML = '';
            break;
        default:
            hideElement('SearchLoader');
            hideElement('ResultsDiv');
            document.getElementById("MainSearchBox").value = '';
            document.getElementById("ResultsData").innerHTML = '';
            break;
    }
    

}

function ProductCatSelector(cat_id) {
    var SelectedCatField = document.getElementById("SelectedCat");
    var selectedElement = document.getElementById("cat_btn_" + cat_id);


    let isSelected = selectedElement.classList.toggle('ProductTagSelected');

    selectedElement.classList.toggle('ProductTagUnSelected', !isSelected);

    if (isSelected) {
        SelectedCatField.value += "##" + cat_id + "##";
    } else {
        SelectedCatField.value = SelectedCatField.value.replace("##" + cat_id + "##", "");
    }

}

function ProductImageUpload(theBlob) {
    var p_id = document.getElementById('upload_p_id').value;
    var theHandler = "Scripts/Ajax/AjaxActions";
    var formData = new FormData();
    formData.append("file", theBlob, "temp.jpg");
    formData.append("p_id", p_id);
    formData.append("theAction", "UploadProductImage");
    formData.append("field", "UploadProductImage");
    
    showElement("ImgUploadLoader");
    hideElement("ImgUploadBtn");


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            RepAjaxUpdate("PRODUCTIMAGES", "ProductImagesContainer", "ImgUploadLoader", p_id);
        }
    };   //alert(this.responseText);

    xmlhttp.open("POST", theHandler, true);
    xmlhttp.send(formData);

}
