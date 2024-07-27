///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/defs/ExeHeader.js    //
///////////////////////////////////////////////////////////
//
//  See:
//
//      System16/core/defs/ExeHeader.js
//
//  For more information about these values.
//


    window.S16_HEADER_ID                = 0;

        window.S16_ID                   = 's16exe';


    window.S16_HEADER_MAJOR             = 7;
    window.S16_HEADER_MINOR             = 8;
    window.S16_HEADER_PATCH             = 9;

        window.S16_MAJOR                = 1;
        window.S16_MINOR                = 0;
        window.S16_PATCH                = 0;


    window.S16_HEADER_DAY               = 10;
    window.S16_HEADER_MONTH             = 11;
    window.S16_HEADER_YEAR              = 12;


    window.S16_HEADER_MODEL             = 14;

        window.S16_MODEL_FLAT           = 0b1000;
        window.S16_MODEL_DUAL           = 0b1100;
        window.S16_MODEL_MULTI          = 0b1110;
        window.S16_MODEL_SPLIT          = 0b1111;

        window.S16_MODEL_DEFAULT        = window.S16_MODEL_FLAT;


    window.S16_HEADER_EXESIZE           = 16;
    window.S16_HEADER_RO                = 20;
    window.S16_HEADER_RW                = 24;
    window.S16_HEADER_CODE              = 28;


    window.S16_HEADER_MODE              = 32;

        window.S16_MODE_S8              = 's8';
        window.S16_MODE_S16             = 's16';
        window.S16_MODE_S32             = 's32';


    window.S16_HEADER_SEGMENTS          = 34;
    window.S16_HEADER_MAXADDR           = 38;

        window.S16_MODE                 = window.S16_MODE_S16;
        window.S16_SEGMENTS             = 16;
        window.S16_MAXADDR              = 0xFFFF;


    window.S16_HEADER_VRAMSIZE          = 42;

        window.S16_VRAM_DEFAULT         = 0;


    window.S16_HEADER_MAIN              = 46;


    window.S16_HEADER_VTABLE            = 50;

    window.S16_HEADER_ENDIANESS         = 78;

