var message,oldmessage;
var body=(document.getElementsByTagName('body'))[0];
fcn="function(){var text = \"\";if (window.getSelection){text = window.getSelection().toString();} else if (document.selection && document.selection.type != \"Control\") {text = document.selection.createRange().text;};console.log(text);}"
body.innerHTML="<div><button id=\"bt\" style=\"position:fixed;top:1em;right=0.2em;z-index:10\" align=\"center\">ADD</button></div>"+body.innerHTML;

body.onmouseup= function(event) {
	if(window.getSelection())
	{
    if (event===undefined) event= window.event;                     
    var target= 'target' in event? event.target : event.srcElement; 

    var root= document.compatMode==='CSS1Compat'? document.documentElement : document.body;
    var path= getPathTo(target);
    oldmessage=message;
    message = 'xpath: '+path;
}
}

function getPathTo(element) {
    if (element.id!=='')
        return "#"+element.id;
    if (element===document.body)
        return element.tagName.toLowerCase();
    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        
        if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        
        if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

document.getElementById('bt').onclick=function()
{
	var alrt="url:"+window.location+"\n\n\n";
	var text = "";
	if (window.getSelection){text = window.getSelection().toString();}
	 else if (document.selection && document.selection.type != "Control") 
	 	{text = document.selection.createRange().text;};
	 alrt+="text:"+text+"\n\n\n";
	 alrt+=oldmessage+"\n\n\n";
	 if(oldmessage=="xpath: #bt")
	 	alert("\n\n\nPlease select text again\n\n\n");
	 else if(text=="")
	 	alert("\n\n\nPlease select something\n\n\n");
	 else
		alert(alrt);
}
