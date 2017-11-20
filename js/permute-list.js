"use strict";

let app = require("./app");
let jQuery = require("jquery");
let $ = jQuery;
let mathematical = require("./mathematical");
let permutator = require("./permutator");
let ps = require("./put-selector-browserified")();
let argv = {};

const permuteList = module.exports = exports = {
    count: 6,
    initialize: (defs)=>{
        app = defs.app;
        jQuery = defs.jQuery;
        $ = jQuery;
        mathematical = defs.mathematical;
        permutator = defs.permutator;
        ps = defs.ps;
        argv = app.argv;
        
        if(argv.n){
            argv.n = Math.max(parseInt(argv.n), 2);
            permuteList.count = argv.n || permuteList.count;
        }

        Array(permuteList.count).fill(0).map((_,i)=>{return String.fromCharCode("A".charCodeAt() + i);}).forEach(item=>{
            // $(".letras>ul").append(`<li><span class="number">${item}</span></li>`);
            ps($(".letras>ul")[0], "li>span.number", item);
        });    
    }
};