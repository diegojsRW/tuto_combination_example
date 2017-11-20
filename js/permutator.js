"use strict";

let app = require("./app");
let jQuery = require("jquery");
let $ = jQuery;
let mathematical = require("./mathematical");
let permuteList = require("./permute-list");
let ps = require("./put-selector-browserified")();
let argv = {};

/**
 * @typedef PointElm
 * @prop {number} index
 * @prop {number} numeric
 * @prop {JQuery<HTMLElement>} DOMElement
 * @prop {any} DOMContainer
 */

const permutator = module.exports = exports = {
    description: "Combinations",
    count: 2,
    /** @type {PointElm[]} */
    points: null,

    /**
     * @param {PointElm} pointer 
     */
    updatePointPosition: (pointer)=>{
        let li = $(".letras>ul>li").eq(pointer.index);
        let elm = $(pointer.DOMElement).find(".arrow-container");
        let x = (li.position().left + (li.width()/2)) - (elm.width() / 2);
        elm.css({
            left: `${x}px`
        });
    },
    updatePoints: _=>{
        permutator.points.forEach(pointer=>permutator.updatePointPosition(pointer));
    },
    checkCombination: _=>{
        let currentCombination = permutator.points.map(pointer=>{
            return $(".letras>ul>li>.number").eq(pointer.index).text();
        });

        $(".letras>ul>li>.number").each((idx,elm)=>{
            $(elm).toggleClass("is-marked", permutator.points.filter(pointer=>pointer.index == idx).length>0)
        });

        let matches = $(".combinacoes>ul>li").filter((idx, elm)=>{
            let testCombination = elm.innerText.split("");
            currentCombination.forEach(ccChar => {
                let tcCharIdx = testCombination.indexOf(ccChar);
                if(tcCharIdx >= 0)
                    testCombination.splice(tcCharIdx, 1);
            });
            return testCombination.length == 0;
        });
        
        let duplicate = [...new Set(currentCombination)].length < currentCombination.length;
        let repeated = (matches.length > 0);
        $(".arrow-container").toggleClass("is-duplicate", duplicate); //E.g.: AA, BB, CC, AAB
        $(".arrow-container").toggleClass("is-repeated", repeated);   //already exists on list, e.g.: BA and AB

        if(matches.length == 0 && !duplicate){
            // $(".combinacoes>ul").append(`<li>${currentCombination.join("")}</li>`);   
            ps($(".combinacoes>ul")[0], "li", currentCombination.join(""));   
            mathematical.updateSum();         
        }
        return {duplicated: duplicate, repeated: repeated, issue: duplicate||repeated};
    },
    doPermutation: (change=false, update=false)=>{
        return [...permutator.points].reduceRight((prev, currentPoint, i)=>{
            if(prev) return prev;
            let idx = currentPoint.index+1;
            prev = idx < permuteList.count;
            if(!prev) idx = 0;
            if(change) currentPoint.index = idx;
            if(update) permutator.updatePointPosition(currentPoint);
            return prev;
        }, false);
    },
    permutate: (change=true,update=true)=>{
        if(!permutator.doPermutation(change,update))
            $(".combinacoes>ul").empty();
        return permutator.checkCombination();
    },
    next: ()=>{permutator.permutate();},
    initialize: (defs)=>{
        app = defs.app;
        jQuery = defs.jQuery;
        $ = jQuery;
        mathematical = defs.mathematical;
        permuteList = defs.permuteList;
        ps = defs.ps;
        argv = app.argv;

        if(argv.p) {
            argv.p = Math.max(parseInt(argv.p),1);
            permutator.count = argv.p || permutator.count;
        }

        permutator.points = Array(permutator.count).fill(0).map((_,i)=>{
            return {
                index: 0, 
                numeric: i,
                DOMElement: $(`
                <div>
                    <div class="arrow-container">
                        <div class="arrow-subcontainer">
                            <span class="arrow"></span>
                            <span class="arrow-number">#${1+i}</span>
                        </div>
                    </div>
                </div>`),
                DOMContainer: null
            };
        });


        permutator.points.forEach(pointer=>{
            $(".letras>div").append(pointer.DOMElement);
            permutator.updatePointPosition(pointer);
        });    
        
        permutator.checkCombination();
    }
};