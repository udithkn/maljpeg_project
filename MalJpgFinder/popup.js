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
                data += `<div class="imgContainer" pixels="179515" width="805" height="223" sizetype="medium" layout="wide" imgsrc="${element}" type="JPG" style="display: -webkit-box;">
                    <img class="origImg" id="${element['src']}" src="${element['src']}" style="wwidth:805px; hheight:223px">
                    <br>
                    <input class="imgInput" value="${element['src']}">
                    <div class="imgInfo">
                        <div class="imgSize imgDimension" style="margin-left:5px;">23 KB</div>
                        <div class="imgSize">805x223</div>
                        <div class="imgSize imgType" style="margin-right:5px;">JPG</div>
                    </div>
                </div>`;
            });
            document.getElementById("imgContainer").innerHTML = data;
            document.getElementById("imgsContainer").style["display"] = "none";
        });
    }
}
imageFetcher.init();