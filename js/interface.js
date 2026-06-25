var currentlyOpenSidebar = "";
var sbRefresh = "";
var isDisplayAdjusted = false;
    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showElement(id) {
    var e = document.getElementById(id);
    if (e) {e.style.display = 'block';}
}

function hideElement(id) {
        var e = document.getElementById(id);
    if (e) { e.style.display = 'none'; }
}

function setElementValue(id, theValue) {
    var e = document.getElementById(id);
    if (e) { e.value = theValue; }
}
function setElementDisablity(id, theValue) {
    var e = document.getElementById(id);
    if (e) { e.disabled = theValue; }
}
function setElementCheck(id, theValue) {
    var e = document.getElementById(id);
    if (e) { e.checked = theValue; }
}
function setElementVisibility(id, theValue) {
    var e = document.getElementById(id);
    if (!theValue)
        e.style.display = 'none';
    else
        e.style.display = 'block';
}

function setElementClass(id, theClass) {
    var e = document.getElementById(id);
    if (e) { e.className = theClass; }

   
    console.log(theClass);
}



function toggle_visibility(id) {
        var e = document.getElementById(id);
        if (e.style.display == 'block')
            e.style.display = 'none';
        else
            e.style.display = 'block';
    }
function t_v(id) {
        var e = document.getElementById(id);
        if (e.style.display == 'block')
            e.style.display = 'none';
        else
            e.style.display = 'block';
    }
function clearContent(id) {
    var e = document.getElementById(id);
    if (e) { e.innerHTML = ''; }
}

function EliminateElement(id) {
    var e = document.getElementById(id);
    if (e) { e.outerHTML = ''; }
}

function selectElementContents(el) {
        var body = document.body, range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
            document.execCommand("copy");

        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
            range.execCommand("Copy");
        }
        //alert('copied');
}

function selectElementContentsById(el_id) {
    var body = document.body, range, sel;
    var el = document.getElementById(el_id);
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
        document.execCommand("copy");

    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
        range.execCommand("Copy");
    }
    //alert('copied');
}


function AjaxLoad(url, is_animate,afterAction) {
        is_animate = is_animate || "1";
        afterAction = afterAction || "";
        showElement('MainContentContainer');
        if(is_animate=="1"){
        showElement('ContentLoader');
        }

        if(currentlyOpenSidebar!=""){
            controller.close(currentlyOpenSidebar);
           AdjustMainView('right','CLOSE');
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                
                
                document.getElementById("MainContentDiv").innerHTML = this.responseText;
                if(is_animate=="1"){
                hideElement('ContentLoader');
                      }
            if(afterAction=="ROUNDMONITOR"){
                StartRoundMonitor();
            }
                      
            }  console.log(this.responseText);
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
function Notify(msg, msg_type){
      msg_type = msg_type || 1;
        var bgColors = [
    "linear-gradient(to right, #00b09b, #96c93d)",
    "linear-gradient(to right, #ff5f6d, #ffc371)"
],
    i = 0;

// Options for the toast
var options = {
    text: msg,
    duration: 2500,
    callback: function () {
        this.remove();
        Toastify.reposition();
    },
    close: true,
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
};

// Initializing the toast
var myToast = Toastify(options);

// Toast after delay
/*setTimeout(function () {
    myToast.showToast();
}, 3000);

setTimeout(function () {
    Toastify({
        text: "Highly customizable",
        gravity: "bottom",
        positionLeft: true,
        close: true,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
    }).showToast();
}, 2000);
*/

/*
Toastify({
    text: "Pure JavaScript Toasts",
    gravity: "bottom",
    positionLeft: false,
    backgroundColor: "#0f3443"
}).showToast();

// Displaying toast on manual action `Try`
document.getElementById('new-toast').addEventListener('click', function () {
    Toastify({
        text: "This is a toast",
        duration: 3000,
        backgroundColor: bgColors[i]
    }).showToast();
    i = i ? 0 : 1;
});

*/

Toastify({
    text: msg,
    duration: 3500,
    newWindow: true,
    gravity: "top",
    positionLeft: true
}).showToast();


    }
function GoSlider(sliding_element,is_autoClose,theDelay,keepContent,justClose) {
    is_autoClose = is_autoClose || 1;
    theDelay = theDelay || 4000;
    keepContent = keepContent || 1;
    justClose = justClose || 0;

    if(justClose!=0)
    {
        SlideOut(sliding_element,keepContent);
    }
    else
    {
        showElement(sliding_element);
        SlideIn(sliding_element);

        if(is_autoClose==1)
        {
            setTimeout(function () { SlideOut(sliding_element,keepContent); }, theDelay);
        }    
    }
    
    }
function isHidden(el){
    return (el.offsetParent === null)
    }
function reOpenPanel(btn_id) {
        var btn = document.getElementById(btn_id);
        btn.click();
        setTimeout(btn.click(), 500);
        console.log(btn_id);
        
}
function Accordionize(elem){
    var acc = document.getElementById(elem);
    acc.classList.toggle("active");
    var panel = acc.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    console.log("ACCING: " + elem);
}
function Accordionize2(elem){
    var acc = document.getElementById(elem);
    acc.onclick = function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  }
}
function IsAccordion(elem)    {
    var acc = document.getElementById(elem);
    var panel = acc.nextElementSibling;
    if(panel.style.maxHeight!=null && panel.style.maxHeight!=0){
        console.log('t');
        return true;
    }
    else{
        console.log('f');
        return false;

    }
    }
function reOpenAccordion(accElem){
        
            Accordionize(accElem);
            setTimeout(function () { Accordionize(accElem); }, 500);    
        

    }
function reOpenSideBar(sbElem){
    controller.close(sbElem);
   
    currentlyOpenSidebar = "";
        setTimeout(function () { controller.open(sbElem); currentlyOpenSidebar = sbElem;}, 500);

}
function sbload(sideBar,url,loader_element,form_name,open_after_load){
    loader_element = loader_element || sideBar + "Loader";
    form_name = form_name || "";
    open_after_load = open_after_load || false;

    var content_container = sideBar + "Content";




    if(!open_after_load){
        if(currentlyOpenSidebar==sideBar){
        reOpenSideBar(sideBar);
        }
        else
        {
            controller.open(sideBar);
        }
        currentlyOpenSidebar = sideBar;
    }
    

    if(document.getElementById(loader_element)){
        showElement(loader_element);    
    }

    var formData = new FormData();
    if(form_name!=""){
        if (document.getElementById(form_name)) {
            var form = document.getElementById(form_name);
            formData = new FormData(form);
            console.log("form aqq: " + form)
        }
    }

    document.getElementById(content_container).innerHTML = "";

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var theRespone=this.responseText;
                if(theRespone.startsWith("!$!")){
                    Notify(theRespone.replace("!$!",""), 3);
                }
                else{
                     document.getElementById(content_container).innerHTML = this.responseText;
                     if(open_after_load){
                        if(currentlyOpenSidebar==sideBar){
                        reOpenSideBar(sideBar);
                        }
                        else
                        {
                            controller.open(sideBar);
                        }
                        currentlyOpenSidebar = sideBar;
                    }
                }

                if(document.getElementById(loader_element)){
                    hideElement(loader_element);    
                }

            } 
        };

        xmlhttp.open("POST", url, true);
        if(form_name!=""){
            xmlhttp.send(formData);    
           
        }else{
            xmlhttp.send();    
        }
        

}

function sbClose(sideBar, clear_content) {
    sideBar = sideBar || "";
    clear_content = clear_content || true;

    if (sideBar == "") {
        sideBar = currentlyOpenSidebar;
    }
    if (sideBar != "") {
        var content_container = sideBar + "Content";
        if (clear_content) {
            clearContent(content_container);
        }
        currentlyOpenSidebar = "";
        controller.close(sideBar);
        AdjustMainView("right", "CLOSE");
    }


}


function FixAccordion(elem) {
    var acc = document.getElementById(elem);
    var panel = acc.nextElementSibling;
    setTimeout(function () { panel.style.maxHeight = panel.scrollHeight + "px"; }, 500);

}
function accLoad(Accelem,url){
    var loader_element = Accelem + "Loader";
    var content_container = Accelem + "Content";
    var content_wrapper = Accelem + "Div";

    if(IsAccordion(Accelem)){
        reOpenAccordion(Accelem);
    }
    else
    {
        showElement(content_wrapper);
        Accordionize(Accelem);
    }
    if(document.getElementById(loader_element)){
        showElement(loader_element);    
    }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById(content_container).innerHTML = this.responseText;
                if(document.getElementById(loader_element)){
                    hideElement(loader_element);    
                }
               console.log(this.responseText);
            }  //console.log(this.responseText);
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

}


function copyTextAreaToClipBoard(theTextArea){
  var textarea = document.getElementById(theTextArea);
  textarea.select();
  document.execCommand("copy");
  

    }
function autoResizeTextArea(el) {
    el.style.height = "auto";      // reset height
    el.style.height = el.scrollHeight + "px";
}
function AdjustMainView(floatDir, ForceAction) {
    floatDir = floatDir || "right";
    ForceAction = ForceAction || "";
    var ViewDiv = document.getElementById("MainBoardContainer");

    if (IsAccordion('MainMenuAcc')) { Accordionize('MainMenuAcc'); }

    switch (ForceAction) {
        case "CLOSE":

            ViewDiv.style.width = "100%";
            ViewDiv.style.float = "";
            if (currSelectedEntry != 0) {
                MiscActions("UnHighlightEntry");
            }
            
            if (currentlyOpenSidebar != "") {
                sbClose(currentlyOpenSidebar);
            }
            isDisplayAdjusted = false;
            break;

        default:
            console.log("DisplayAdjsutmentBreak: " + DisplayAdjsutmentBreak);
            if (currentlyOpenSidebar != "" || ViewDiv.style.width == "100%" || ViewDiv.style.width =="") {
                ViewDiv.style.width = "60%";
                ViewDiv.style.float = floatDir;
                isDisplayAdjusted = true;
            }
            else {
                ViewDiv.style.width = "100%";
                ViewDiv.style.float = "";

                if (currSelectedEntry != 0) {
                    MiscActions("UnHighlightEntry");
                }
                if (currentlyOpenSidebar != "") {
                    sbClose(currentlyOpenSidebar);
                }
                isDisplayAdjusted = false;

                //

            }
            break;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
