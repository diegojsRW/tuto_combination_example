"use strict";

const 
    permutator = require("./permutator"),
    mathematical = require("./mathematical"),
    jQuery = require("jquery"),
    $ = jQuery, 
    ps = require("./put-selector-browserified")(),
    permuteList = require("./permute-list");

const app = module.exports = exports = {
    skippers: [permutator, mathematical],
    skipping: 0,
    /** @type {Object<String,String>} */
    argv: {},
    /**@type { JQuery.EventHandler<HTMLElement, null>}  */
    onKeyDown: 
    /**
     * @param { JQuery.Event<HTMLElement, null> } evt
     */
    function(evt){
        
        if(evt.keyCode === 13) 
            app.skippers[app.skipping].next();

        if(evt.keyCode === 9){
            evt.preventDefault();
            app.skipping = (app.skipping + 1) % app.skippers.length
            MathJax.Message.Set(`<Enter now skips ${app.skippers[app.skipping].description}>`, null, 1000);
        
        }
        if(evt.key.toLowerCase() === "f"){ 
            let permutimer = function(){
                let it = 0;
                while(permutator.permutate(true,false).issue)
                    if(it++ > 1000) 
                        return console.warn("Giving up...");
                // if(permutator.permutate(true,false).issue)
                // requestAnimationFrame(permutimer)
                // setTimeout(permutimer, 50);
                
                permutator.updatePoints();
            };
            permutimer();
        };
        if(evt.key === "t"){
            MathJax.Message.Set("Teste", null, 10000);
        }
    },
    onResized: _=>{
        permutator.updatePoints();//.forEach(pointer=>permutator.updatePointPosition(pointer));
    },
    onReady: function(){
        if(app.argv.z)
            less.modifyVars({
                "@font-size": (2.2 * (app.argv.z / 100)).toFixed(2) + "vw" 
            });

        [permuteList, permutator, mathematical].forEach(x=>x.initialize({
            app, jQuery, mathematical, permutator, permuteList, ps
        }));      
        $(document).on("keydown", app.onKeyDown);
        $(window).resize(app.onResized);
        $(".letras, .combinacoes").click(permutator.next);
        $("section.mathematic").click(mathematical.next);

        mathematical.initMathjax();
    },
    doinit: function(){
        app.argv = document.location.search.slice(1).split("&").reduce((ps,p)=>{ let [k,v] = p.split("="); ps[k] = v; return ps; },{});
        
        jQuery.fn.reverse = [].reverse;
        
        // window.$ = $;
        // window.JQuery = $;
        // window.ps = ps;
        // window.permutator = permutator;
        // window.mathematical = mathematical;
        // window.permuteList = permuteList;
        $(document).ready(app.onReady);
    }
}