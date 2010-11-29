// h5ile utility version 0.1
// Copyright (C) 2010 Marat Nepomnyashy All Rights Reserved.
// Licensed under BSD, see: https://github.com/maratbn/h5ile/raw/master/LICENSE
// This file is optimized for deployment, for source see: https://github.com/maratbn/h5ile/

window.h5ile={createVisibleFileInput:function(parent,params){if(!parent)throw new Error("h5ile: Expected parent element or id.");if(!(parent instanceof HTMLElement))
parent=document.getElementById(parent);if(!parent)throw new Error("h5ile: Invalid parent element");var elInput=document.createElement('input');elInput.setAttribute('type','file');this.prepareFileInput(elInput,params);parent.appendChild(elInput);return elInput;},isFileAPISupported:function(){return window.File&&window.FileReader?true:false;},prepareFileInput:function(elInput,params){var _processChange=function(){if(!this.files){throw new Error("h5ile:  Expected 'FileList' object, but"
+" did not get any");}
for(var i=0;i<this.files.length;i++){var file=this.files[i];if(!file)continue;if(params&&params.loadtext&&params.loadtext.onloadend){function _onError(){alert("h5ile:  Encountered error loading text file '"+file.name+"'.");}
var reader=new FileReader();reader.onabort=function(){alert("h5ile:  Aborted text loading of file '"+file.name+"'.");}
reader.onerror=function(){_onError();}
reader.onloadend=function(){if(params.loadtext.onloadend){params.loadtext.onloadend(file,reader);}}
reader.onprogress=function(progress_event){if(params.loadtext.onprogress){params.loadtext.onprogress(progress_event);}}
try{reader.readAsText(file);}catch(e){_onError();if(params.loadtext.onloadend){params.loadtext.onloadend(null,null);}}}}}
if(elInput.addEventListener){elInput.addEventListener('change',_processChange,false);}else if(elInput.attachEvent){elInput.attachEvent('change',_processChange);}else{throw new Error("h5ile:  Expected either 'addEventListener' or 'attachEvent'.");}},splitIntoLines:function(file_reader){var arrSplit=file_reader&&file_reader.result&&file_reader.result.split(/(\r\n|\r|\n)/);var arrLines=[];var strLine="";for(var i=0;i<arrSplit.length;i++){strLine+=arrSplit[i];if(strLine.match(/\r\n|\r|\n/)){arrLines.push(strLine);strLine="";}}
if(strLine)arrLines.push(strLine);function _getLine(indexLine){return arrLines&&arrLines.length>indexLine&&arrLines[indexLine]||"";}
function _getLineStripped(indexLine){var strLine=_getLine(indexLine);var arrBreakdownForLine=strLine&&strLine.match(/^\s*(.+\S+)\s*$/);return arrBreakdownForLine&&arrBreakdownForLine.length==2&&arrBreakdownForLine[1]||null;}
var _arrLineTokens=[];function _insureTokenLineExists(indexLine){if(_arrLineTokens[indexLine])return;var strLineStripped=_getLineStripped(indexLine);_arrLineTokens[indexLine]=strLineStripped&&strLineStripped.split(/\s/)||[];}
return{totalChars:file_reader&&file_reader.result&&file_reader.result.length||0,totalLines:arrLines&&arrLines.length||0,getLine:function(indexLine){return _getLine(indexLine);},getLineStripped:function(indexLine){return _getLineStripped(indexLine);},getTotalTokensOnLine:function(indexLine){_insureTokenLineExists(indexLine);return _arrLineTokens[indexLine].length;},getTokenOnLine:function(indexToken,indexLine){_insureTokenLineExists(indexLine);return _arrLineTokens[indexLine][indexToken];}}}}