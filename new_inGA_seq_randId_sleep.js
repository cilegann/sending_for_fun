
function seqVer() {}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getgaCid() {
    var name = "_ga=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length + 6, c.length);
        }
    }
    return "";
}

function removeScript() {
    var ss = document.getElementsByTagName('script');
    for (i = 0; i < ss.length; i++) {
        if (ss[i].innerHTML.indexOf("function seqVer()") !== -1) {
            ss[i].parentNode.removeChild(ss[i]);
            console.log("Remove script done ver.Seq");
            break;
        }
    }
}

function encodeObj(element_url, elementClasses, elementId, elementText, dataanalyticsID) {
    return JSON.stringify({
        'element_url': element_url,
        'elementClasses': elementClasses,
        'elementId': elementId,
        'elementText': elementText,
        'dataanalyticsID': dataanalyticsID
    })
}

function readTextFile(file, callback) {

    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


function doGHSeqFlow() {
    var wjmId = 'wjm-' + makeid(5);
    var ifrm_w = document.createElement('iframe');
    ifrm_w.setAttribute('id', wjmId);
    ifrm_w.setAttribute('class', 'wjm_stealSeq');
    ifrm_w.style.display = "none";
    document.body.appendChild(ifrm_w);

    var wframe = document.getElementById(wjmId);
    wframe.addEventListener("load", function() {
        setTimeout(function() {
            console.log("removing " + wjmId);
            wframe.parentNode.removeChild(wframe);
            console.log("remove " + wjmId + " done");
        }, 2500);

    });


    uuid = -1
    for (i = 0; i < dataLayer.length; i++) {
        try {
            uuid = dataLayer[i]['ga_c_id'];
        } catch (e) {
            console.log("pass");
        }
        if (uuid != null) {
            break;
        }
    }

    var seqLen = 10;
    var ListForClick = [];
    for (i = 0; i < dataLayer.length; i++) {
        event = dataLayer[i]['event'];
        if (event == "gtm.click") {
            ListForClick.push(i);
        }
    }

    var jsonFileName='';

    switch (window.location.hostname) {
        case 'www.wwluck.com':
            jsonFileName='wwl_stealSeqJson.json';
            break;
        case 'www.siam99.com':
            jsonFileName='si_stealSeqJson.json';
            break;
        case 'www.chanabet555.com':
            jsonFileName='cb5_stealSeqJson.json';
            break;
        case 'www.gembet99.com':
            jsonFileName='gb9_stealSeqJson.json';
            break;
        case 'www.betcity.mx':
            jsonFileName='bc_stealSeqJson.json';
            break;
    }
    readTextFile("https://wjinma.github.io/sending_for_fun/" + jsonFileName + "?_=" + new Date().getTime(), function(text) {
        eList = [];
        var data = JSON.parse(text.replace(/ /g, ""));

        for(i=ListForClick.length-1;i>=0;i--){
            j = ListForClick[i];
            element_url = dataLayer[j]['gtm.elementUrl'];
            elementClasses = dataLayer[j]['gtm.elementClasses'];
            elementId = dataLayer[j]['gtm.elementId'];
            if ("text" in dataLayer[j]['gtm.element']) {
                elementText = dataLayer[j]['gtm.element']["text"];
            } else {
                elementText = "";
            }
            if ("analytics" in dataLayer[j]['gtm.element'].dataset) {
                dataanalyticsID = dataLayer[j]['gtm.element'].dataset["analytics"];
            } else {
                dataanalyticsID = "null"
            }
            encoded=encodeObj(element_url, elementClasses, elementId, elementText, dataanalyticsID);
            code = data[encoded];

            if (code != undefined) {
                if(eList.length==0){
                    eList.push(code);
                }else{
                    if(eList[eList.length-1]!=code){
                        eList.push(code);
                    }
                }
            } else {
                // console.log(objStrList[i]);
            }

            if(eList.length>=seqLen){
                break;
            }
        }
        eList=eList.reverse();

        if(eList.length==0){
            eList.push("empty");
        }else{
            eList.push("");
        }
        eListStr="";
        for(i=0;i<eListStr;i++){
            if(typeof eList[i]=='number'){
                eListStr+= ("@"+eList[i]+":");
            }
        }
        console.log(wjmId+" eList: " + eListStr);
        wframe.src = "https://wjinma.github.io/sending_for_fun/steal_seq_recv.html?uid==" + uuid + "&&domain==" + window.location.hostname + "&&cid==" + getgaCid() + "&&url==" + window.location.href + "&&eList==" + eListStr;
        console.log(wjmId+" url: " + wframe.src);
    });

}

// inga: <script src="https://wjinma.github.io/sending_for_fun/new_inGA_seq_randId_sleep.js"></script>  <script>doGHSeqFlow();</script>
