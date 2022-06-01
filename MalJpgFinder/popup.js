var imageFetcher = {
    init: function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {file: "app.js",allFrames: false}, imageFetcher.getImagesCallback)
        })
    },
    getImagesCallback:function(results) {
        console.log(results);
        let data = '';
        fetch("http://localhost:5000/predict", {
        method: 'POST', 
        body: JSON.stringify(results[0]) // body data type must match "Content-Type" header
        })
        .then(response1 => response1.json())
        .then(response=>{
            console.log(response);
            response.forEach(element => {
                data += `<div class="imgContainer" pixels="179515" sizetype="medium" layout="wide" imgsrc="${element}" type="JPG" style="display: flex;flex-direction: column;">
                    <img class="origImg" id="${element['src']}" src="${element['src']}" style="width:100%">
                    <div class="imgInfo ${element['status']}">${element['status']}</div>
                </div>`;
            });
            document.getElementById("imgContainer").innerHTML = data;
            document.getElementById("imgsContainer").style["display"] = "none";
        });
    }
}
imageFetcher.init();