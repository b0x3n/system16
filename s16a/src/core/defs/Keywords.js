///////////////////////////////////////////////////////////
//  System16/s16a/src/code/defs/Keywords.js              //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  Import any required global .js files from:
//
//      System16/core/defs/
//
    import * as GlobalSections from     "./../../../../core/defs/Sections.js";
    import * as GlobalMemtypes from     "./../../../../core/defs/Memtypes.js";
    import * as GlobalMnemonics from    "./../../../../core/defs/Mnemonics.js";


///////////////////////////////////////////////////////////
//  Import required .js files from:
//
//      System16/s16a/src/core/defs/
//
    import * as GlobalDirectives from   "./Directives.js";


///////////////////////////////////////////////////////////
//  More reserved keywords.
//
    global.S16A_KEYWORD_FUNCTION        = 'function';
    global.S16A_KEYWORD_MAIN            = '_main';
    global.S16A_KEYWORD_END             = 'end';


///////////////////////////////////////////////////////////
//  Every keyword is stored here for quick and dirty
//  checking.
//
    global.S16A_KEYWORDS                =
    [

        global.S16A_KEYWORD_FUNCTION,
        global.S16A_KEYWORD_MAIN,
        global.S16A_KEYWORD_END,

        ...global.S16A_SECTIONS,

        ...global.S16A_DIRECTIVES,

        ...global.S16_MEMTYPES,

        ...Object.keys(global.S16_MNEMONICS)

    ];

    