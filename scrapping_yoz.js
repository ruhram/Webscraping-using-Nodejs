var a =document.getElementsByClassName("hfpxzc")
var b=""
for (var i = 0; i < a.length; i++) {
    var aElement = a[i];
    var href = aElement.href;

 

    // Lakukan sesuatu dengan properti href
    b+=href+"\n";
}
var downloadLink = document.createElement('a');
downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(b);
var tit=document.title
downloadLink.download = tit+'.txt';

 

downloadLink.click();