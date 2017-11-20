"use strict";



module.exports = exports = ()=>{
    console.debug(`Loading put-selector...`);
    require("put-selector");
    console.debug(`Loaded put-selector, got ${typeof put}`, put);
    return put;
};