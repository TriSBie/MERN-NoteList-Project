const express = require("express");
const app = express();
const router = express.Router();
const path = require("path")


/**
 * REGEX 
 *  ^abc : abc at the beginning
 *  abc$ : abc at the end of the string
 *  a|b : either of a and b
 *  ^abc|abc$: the string abc at the beginning or at the end of the string
 *  ab{2,4}c : an a followed by two, three or four b's followed by a c
 *  ab{2,}c : an a followed at least two b's followed by a c
 *  ab*c : any number or more 
 *  ab+c : one or more b's followed by a c
 *  ab?c : optional that abc or ac ( b is optional)
 *  a.c  : a.c exactly
 *  [abc] : any one of a,b, c
 *  [Aa]bc : either Abc or abc
 *  [abc]+ : any (nonempty) string of a, b and c such as abc, a, bcbcaaaa
 *  [^abc]+: any (nonempty) string which does not contain any of a,b c such as (def is ok) but (adf is not accepted)
 *  \d\d any two decimal digit such at 42
 *  \w+ a "word" : a nonempty sequence of alphanumeric characters and low lines such as foo, 12bar8
 *  100\s*mk : the str 100 and mk optionally sperated by amount of white space
 */
//Router method accept regx in path
router.get("^/$|/index(.html)?", (req, res) => {
    //res.json, res.data, res.sendFile all of 
    res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})

module.exports = router