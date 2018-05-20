function anno_getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function addNewData(url,xpath,text,tag,startPoint,endPoint){
    $.ajax({
    url: 'http://127.0.0.1:5000/store', 
    method: 'POST',
    data: {
    url:url,
    xpath:xpath,
        tag:tag,
        text:text,
        startPoint:startPoint,
        endPoint:endPoint,
    },
    success: function (response) {
    console.log(response);
    console.log("Success1");
    },
    error: function(response){
    console.log(response);
    console.log("Error1");
    },
  });
}

function getTextNodesIn(node) {
    var textNodes = [];
    if (node.nodeType == 3) {
        textNodes.push(node);
    } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
    }
    return textNodes;
}

function setSelectionRange(el, start, end) {
    if (document.createRange && window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var textNodes = getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0, endCharCount;

        for (var i = 0, textNode; textNode = textNodes[i++]; ) {
            endCharCount = charCount + textNode.length;
            if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
                range.setStart(textNode, start - charCount);
                foundStart = true;
            }
            if (foundStart && end <= endCharCount) {
                range.setEnd(textNode, end - charCount);
                break;
            }
            charCount = endCharCount;
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(true);
        textRange.moveEnd("character", end);
        textRange.moveStart("character", start);
        textRange.select();
    }
}

function makeEditableAndHighlight(colour) {
    sel = window.getSelection();
    if (sel.rangeCount && sel.getRangeAt) {
        range = sel.getRangeAt(0);
    }
    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
    // Use HiliteColor since some browsers apply BackColor to the whole block
    if (!document.execCommand("HiliteColor", false, colour)) {
        document.execCommand("BackColor", false, colour);
    }
    document.designMode = "off";
}

function highlight(colour) {
    var range, sel;
    if (window.getSelection) {
        // IE9 and non-IE
        try {
            if (!document.execCommand("BackColor", false, colour)) {
                makeEditableAndHighlight(colour);
            }
        } catch (ex) {
            makeEditableAndHighlight(colour)
        }
    } else if (document.selection && document.selection.createRange) {
        // IE <= 8 case
        range = document.selection.createRange();
        range.execCommand("BackColor", false, colour);
    }
}

function selectAndHighlightRange(nodeobject, start, end) {
    setSelectionRange(nodeobject, start, end);
    highlight("yellow");
}

function createR(node, start, end) {
  console.log(node);
  var range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  return range;
}
function getTextNodeFrom(element) {
  // replace with more sophisticated method.
  // The first node does not have to be a textNode.
  return element.childNodes[0];
}
function createH() {
    var highlight = document.createElement('span');
    highlight.style.backgroundColor="yellow";
    return highlight;
}
function createRC(element, start, end) {
  console.log(element);
  var textNode = getTextNodeFrom(element);
  var range = createR(textNode, start, end);
  return range;
}

var todisplay=[];
var obj;
var oldobj;
function tryfunc()
{
var message,oldmessage;
var body=(document.getElementsByTagName('body'))[0];
fcn="function(){var text = \"\";if (window.getSelection){text = window.getSelection().toString();} else if (document.selection && document.selection.type != \"Control\") {text = document.selection.createRange().text;};console.log(text);}"
document.querySelector('head').innerHTML += '<link rel="stylesheet" href="https://codepen.io/kUSHAL06/pen/prXRWg.css" type="text/css"/>';
body.innerHTML+="<div id=\"buttons\"><button id=\"adbtn\" class=\"w3-btn w3-teal w3-round\">ADD</button><button id=\"sbmtbtn\" class=\"w3-btn w3-orange w3-round\">SUBMIT</button><input type=\"text\" id=\"tag\" class=\"w3-round w3-border-black\" placeholder=\"Tag For Selected Data\" autocomplete=\"off\"></div>";

body.onmouseup= function(event) {
	if(window.getSelection())
	{
    if (event===undefined) event= window.event;                     
    var target= 'target' in event? event.target : event.srcElement; 
oldobj=obj;
obj=event.target;

    var root= document.compatMode==='CSS1Compat'? document.documentElement : document.body;
    var path= getPathTo(target);
    oldmessage=message;
    message = path;
}
}


function getPathTo(element) {
    if (element.id!=='')
        return "//*[@id='" + element.id + "']";
    if (element===document.body)
        return "html/" + element.tagName.toLowerCase();
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

document.getElementById('adbtn').onclick=function()
{
  
  // oldobj.style.backgroundColor="yellow";
  var tag=document.getElementById('tag').value;
  var temp={};
	temp.url=window.location.toString();
	var text = "";
	if (window.getSelection){text = window.getSelection().toString();}
	 else if (document.selection && document.selection.type != "Control") 
	 	{text = document.selection.createRange().text;};
	 
  temp.text=text;
  temp.xpath=oldmessage;
  temp.tag=null;
  temp.startPoint=window.getSelection().anchorOffset;
  temp.endPoint=parseInt(temp.startPoint)+text.length;
  if(tag!="")
    temp.tag="TAG:\t"+tag+"\n";
   if(oldmessage=="xpath: #bt")
	 	alert("\n\n\nPlease select text again\n\n\n");
	 else if(text=="")
	 	alert("\n\n\nPlease select something\n\n\n");
  else
    {
    todisplay.push(temp);
    selectAndHighlightRange(oldobj,temp.startPoint,temp.endPoint);
      addNewData(temp.url,temp.xpath,temp.text,temp.tag,temp.startPoint,temp.endPoint);
    }
  
}
document.getElementById('sbmtbtn').onclick=function()
{
  var stri="";
  console.log("SUBMIT CALLED");
  for(var i in todisplay)
    {
     stri+=todisplay[i].url;
      stri+=todisplay[i].text;
      stri+=todisplay[i].xpath;
      stri+="startPoint: "+todisplay[i].startPoint+"\n";
      stri+="endPoint: "+todisplay[i].endPoint+"\n";
      if(todisplay[i].tag)
        stri+=todisplay[i].tag;
      stri+="\n";
    }
  alert(stri);
}
}
function retrievedata(cur_url,new_data){
  $.ajax({
    url:'http://127.0.0.1:5000/data',
    method: 'GET',
    data:{url: cur_url},
    success:function(response)
    {
      // console.log("success");
      console.log(response);
      new_data=response;
    },
    complete:function()
    {
      for(var i in new_data)
        {
          // console.log(new_data[i]);
          var curnode=anno_getElementByXpath(new_data[i].xpath);
          console.log(curnode);
          selectAndHighlightRange(curnode,new_data[i].startPoint,new_data[i].endPoint);
        }
    },
    error:function(response)
    {
      console.log("error");
      console.log(response);
    },
  });
}
tryfunc();
retrievedata(window.location.toString(),[]);
// alert("ONLOAD");