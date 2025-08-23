var currSelectedOrder = 0;
var currentlyOpenSidebar = "";

function MainAjaxAction(theAction, value, param1, param2,param3,param4) {
        param1 = param1 || "";
        param2 = param2 || "";
        param3 = param3 || "";
        param4 = param4 || "";
        var theHandler = "Scripts/MainAjaxActions";
        var formData = new FormData();
                switch (theAction) {
                    case "LinkRoundText":
                    case "AddNewRound":
                    case "ImportUploadedOrders":
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
                if (theRes.startsWith("!$!")) {
                    Notify(theRes.replace("!$!", ""), 3);
                }
                else {
                    switch (theAction) {


                        case "AddNewRound":
                        case "LinkRoundText":
                            if (!theRes.startsWith("!$!")) {
                                MainAjaxUpdate('UpdateImportSettingsRoundLists', 'AvailableRoundsDiv', '');
                                MainAjaxUpdate('UpdateImportSettingsUnlinkedTexts', 'UnliknedTextsDiv', '');
                            }
                            Notify(theRes.replace("!$!", ""), 3);
                            break;
                        
                        case "ImportUploadedOrders":
                            AjaxLoad('MainCaller?p1=OrdersAdmin');
                            Notify(theRes, 3);
                            break;

                            
                        default:
                            Notify(theRes, 1);
                            break;
                    }
                }

            } console.log(this.responseText);
        };
        xmlhttp.open("POST", theHandler, true);

        xmlhttp.send(formData);
    }

function MainAjaxUpdate(theAction,return_container,loaderElement,param1,param2,param3,param4,param5) {
    loaderElement = loaderElement || "";
    param1 = param1 || "";
    param2 = param2 || "";
    param3 = param3 || "";
    param4 = param4 || "";
    param5 = param5 || "";

    var handlerUrl = "";
    var formData = new FormData();

    handlerUrl = "Scripts/MainAjaxHandler";
    if(loaderElement!=""){
        showElement(loaderElement);
    }

    switch(theAction){

        case "UpdateCartView":
            var form = document.getElementById('orderOptions');
            formData = new FormData(form);
        break;

        default:
        break;

        
    }

    formData.append("theAction", theAction);
    formData.append("param1", param1);
    formData.append("param2", param2);
    formData.append("param3", param3);
    formData.append("param4", param4);
    formData.append("param5", param5);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                document.getElementById(return_container).innerHTML = this.responseText;
                if (loaderElement != "") {
                    hideElement(loaderElement);
                }

                switch (theAction) {
                    case "RoundSpOfferCreator":
                        reOpenAccordion('AccAddSpecial');
                        break;
                    case "PopulateSpOffer":
                        FixAccordion('spOfferCatAcc_' + param5);
                        break;
                    default:
                        break;
                }

            } console.log(this.responseText);
        };

        xmlhttp.open("POST", handlerUrl, true);
        xmlhttp.send(formData);
    }

function MiscActions(theAction,param1,param2,param3) {
    param1 = param1 || "";
    param2 = param2 || "";
    param3 = param3 || "";
    
    switch(theAction){

        case "LoadOrder":
            var order_id = param1;
            if(currSelectedOrder!=0 && currSelectedOrder != order_id){
                console.log(document.getElementById("order_" + currSelectedOrder).style.backgroundColor);
                var oldElem = document.getElementById("order_" + currSelectedOrder);
                oldElem.style.backgroundColor = "#fff";
            }
            currSelectedOrder = order_id;
            var newElem = document.getElementById("order_" + currSelectedOrder);
                newElem.style.backgroundColor = "#ffffcc";
            sbload('GenSb','RepCaller?p1=BoardOrderInfo&p2=' + order_id);
            AdjustMainView();
            break;

         case "MemberSelect":
            document.getElementById('member_uid').value=param2;
            document.getElementById("BoardMemberContainer").innerHTML = "";
            hideElement("BoardMemberContainer");
            hideElement("ACMember");
            showElement('CancelOrderBtn');
            showElement('OkOrderBtn');
            document.getElementById('SelectedUserName').innerHTML = param1 ;
            showElement('SelectedUserName');
            showElement('shipInfoDiv');
            break;
    }

}

function AutoComplete(str,theAction,return_container,loader_element) {
    loader_element = loader_element || "";
    var theHandler = "Scripts/RepAjaxHandler";
    if(loader_element!=""){
        showElement(loader_element);
    }
        
        
        if (str.length == 0) 
        {
            document.getElementById(return_container).innerHTML = "";
            hideElement(return_container);
                if(loader_element!=""){
                    hideElement(loader_element);
                }
            return;
        }
         else 
         {
        var formData = new FormData();
        formData.append("q", str);
        formData.append("theAction", theAction);

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById(return_container).innerHTML = this.responseText;
                       showElement(return_container);
                       if(loader_element!=""){
                            hideElement(loader_element);
                        }
           } console.log(this.responseText);
            };
            xmlhttp.open("POST", theHandler, true);
             xmlhttp.send(formData);
        }
    }

function ControlButton() {
    console.log(currentlyOpenSidebar);

    if(callerSidebar!=""){
            controller.open(callerSidebar);
            currentlyOpenSidebar = callerSidebar;
            switch(sbRefresh){
                case "RoundMenu":
                var round_id=document.getElementById('RoundToUpdate').value;
                    AdminAjaxUpdate("RoundMenu", "RoundMenuDiv", "RoundMenuLoader", round_id);
                break;
                case "RoundSpecials":
                var round_id=document.getElementById('RoundToUpdate').value;
                    AdminAjaxUpdate("RoundSpecials", "RoundSpecialsDiv", "RoundSpLoader", round_id);
                break;

                default:
                break;
            }
            callerSidebar = "";
    }
    else{
        switch (currentlyOpenSidebar) {
            case "GenSb":
                controller.close(currentlyOpenSidebar);
                currentlyOpenSidebar = "";
            break;

            case "ProductsList":
                if(document.getElementById('is_all_products')){
                controller.close(currentlyOpenSidebar);
                currentlyOpenSidebar = "";
                }
                else{
                controller.open("MenuEditor");
                currentlyOpenSidebar = "MenuEditor";
                }
            break;

            case "ProductEditor":
                controller.open("ProductsList");
                currentlyOpenSidebar = "ProductsList";
            break;
        }
    }
}

function UploadFile(uploadType,FormName,return_container,loaderElement,pbar) {
    uploadType = uploadType || "ORDERS";
    FormName = FormName || "pbUploadOrders";
    pbar = pbar || "pbar";
    loaderElement = loaderElement || "ordersLoader";
    return_container = return_container || "ordersContent";
    showElement(loaderElement);
    var form=document.getElementById(FormName);
    var formData = new FormData(form);

    var pbar_txt = document.getElementById(pbar + "_txt");
    var pbar_bar = document.getElementById(pbar + "_bar");
    var uploadHandler = "";

    switch (uploadType){
        case "ORDERS":
            uploadHandler = "Scripts/MainAjaxHandler";
            formData.append("theAction", "UploadOrdersTsv");
            break;
        case "PhoneBook":
            uploadHandler = "Scripts/MainAjaxHandler";
            formData.append("theAction", "UploadPhoneBookTsv");
            break;
    }
    
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById(return_container).innerHTML = this.responseText;
                hideElement(loaderElement);
            }  console.log(this.responseText);
        };

            xmlhttp.open("POST", uploadHandler, true);
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
