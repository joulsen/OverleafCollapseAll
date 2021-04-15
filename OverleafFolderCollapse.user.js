// ==UserScript==
// @name         Overleaf Collapse All Folders
// @namespace    http://itmunk.dk
// @version      1.0
// @description  Adds a button, that when pressed, collapses all folders within the Overleaf file viewer.
// @author       Andreas Poulsen (@supercigar)
// @match        https://www.overleaf.com/project/*
// @icon         https://cdn.overleaf.com/img/ol-brand/overleaf_og_logo.png
// @grant        none
// ==/UserScript==
'use strict';

addCollapseAllButton();

function addCollapseAllButton(){
    // Wait for toolbar to load, in order to add new button
    var intv = setInterval(function() {
        var toolbarFiletree = document.getElementsByClassName("toolbar-filetree");
        // Return false until toolbar-filetree is found
        if(toolbarFiletree.length < 1){
            return false;
        }
        //when element is found, clear the interval.
        clearInterval(intv);
        // Making a var of left half of the toolbar
        var toolbarHalf = toolbarFiletree[0].firstChild;
        // Duplicating first button and changing icon using font awesome class
        var compressBtn = toolbarHalf.firstChild.cloneNode(true);
        compressBtn.firstChild.className = "fa fa-arrow-up";
        //compressBtn.style.marginLeft = "1em";
        compressBtn.onclick = fileTreeCollapse;
        toolbarHalf.appendChild(compressBtn);
    }, 100);
};

// Checks if a button is innermost by seing if the sibling UL contains another UL
function isInnermostButton(button) {
    // Go out a parent element until an <li> is found
	var outerList = button.parentElement;
    while(outerList.tagName != "LI") {
        outerList = outerList.parentElement;
    }
    // We assume that the sibling of an <li> is <ul> since it was a button (which indicates folders)
    var outerUl = outerList.nextElementSibling;
    // We count the <ul> inside the <ul> i.e. how many more lists is within the first <ul>
    var innerUls = outerUl.getElementsByTagName("ul");
    return innerUls.length < 1;
}

// Main function ran at button press
function fileTreeCollapse() {
    var cols = document.querySelectorAll('[aria-label="Collapse"]');;
    var tries = 0; // I have no idea why this is needed :'(
    while(cols.length > 1 & tries < 100) {
        tries += 1;
        for (let col of cols) {
            if (isInnermostButton(col)) {
                col.click();
            }
        }
        cols = document.querySelectorAll('[aria-label="Collapse"]');
    }
    if (cols.length > 0) {
        cols[0].click();
    }
}
