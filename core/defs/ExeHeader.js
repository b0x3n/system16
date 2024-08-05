///////////////////////////////////////////////////////////
//  System16/core/defs/ExeHeader.js                      //
///////////////////////////////////////////////////////////
//
//  The global.S16_HEADER_* values are offsets for the
//  s16 executable header, they point to locations where
//  specific values are located in the header section of
//  the executable file.
//
//  Some default values are also defined here.
//


///////////////////////////////////////////////////////////
//  Every executable begins with the ID, this is just a
//  string that is checked before the code is loaded and
//  executed.
//
//  It is 6 bytes in length.
//
    global.S16_HEADER_ID                = 0;

    //  Every exe starts with this string.
    //
        global.S16_ID                   = 's16exe';


///////////////////////////////////////////////////////////
//  Version info - each value is 1 byte.
//
    global.S16_HEADER_MAJOR             = 7;
    global.S16_HEADER_MINOR             = 8;
    global.S16_HEADER_PATCH             = 9;

    //  This version (1.0.0);
    //
        global.S16_MAJOR                = 1;
        global.S16_MINOR                = 0;
        global.S16_PATCH                = 0;


///////////////////////////////////////////////////////////
//  Build date - the day and month are 1 byte, the
//  year is 2 bytes.
//
    global.S16_HEADER_DAY               = 10;
    global.S16_HEADER_MONTH             = 11;
    global.S16_HEADER_YEAR              = 12;


///////////////////////////////////////////////////////////
//  Memory model - this is a 2 byte value.
//
    global.S16_HEADER_MODEL             = 14;

    //  In a flat model, the read-only, read-write,
    //  code and stack are all in a single segment.
    //
    //  With the dual model the read-only and
    //  read-write sections are stored together in
    //  a single segment and the code and stack are
    //  together in a single segment.
    //
    //  The multi model puts the read-only section into
    //  a single segment and the read-write section also
    //  into a single segment - the code and stack are
    //  combined in a single segment.
    //
    //  Lastly there's split which will put the code,
    //  stack, read-only and read-write sections into
    //  their own individual segments.
    //
        global.S16_MODEL_FLAT           = 1;
        global.S16_MODEL_DUAL           = 2;
        global.S16_MODEL_MULTI          = 3;
        global.S16_MODEL_SPLIT          = 4;

        global.S16_MODEL                = global.S16_MODEL_FLAT;


///////////////////////////////////////////////////////////
//  Total file size and ro, rw and code section offsets,
//  these are all 4 bytes.
//
//  If running on dual, multi or split models then these
//  may point to segments as opposed to addresses in the
//  code segment.
//
    global.S16_HEADER_EXESIZE           = 16;
    global.S16_HEADER_RO                = 20;
    global.S16_HEADER_RW                = 24;
    global.S16_HEADER_CODE              = 28;


///////////////////////////////////////////////////////////
//  Run mode and segment allocation.
//
//  There are three operating modes:
//
//      's8'        - 8-bit mode, maximum segments and
//                    max address will both be 0xFF
//
//      's16':      - 16-bit (default) mode - maximum
//                    segments and max address will both
//                    be 0xFFFF
//
//      's32':      - 32-bit mode - maximum segments and
//                    max address will both be 0xFFFFFFFF
//
//  This is a 2 byte string.
//
    global.S16_HEADER_MODE              = 32;

        global.S16_MODE_S8              = 8;
        global.S16_MODE_S16             = 16;
        global.S16_MODE_S32             = 32;

///////////////////////////////////////////////////////////
//  Total number of RAM segments to allocate and the size
//  of each segment - these are both 4 byte values.
//
    global.S16_HEADER_SEGMENTS          = 34;
    global.S16_HEADER_MAXADDR           = 38;

    //  Defaults.
    //
        global.S16_MODE                 = global.S16_MODE_S16;
        global.S16_SEGMENTS             = 16;
        global.S16_MAXADDR              = 0xFFFF;


///////////////////////////////////////////////////////////
//  Offset of the _main (entry point) function is stored
//  at this location.
//
    global.S16_HEADER_MAIN              = 46;


///////////////////////////////////////////////////////////
//  Vector table offset, this is stored in the header at
//  offset 50, it occupies 25 bytes.
//
    global.S16_HEADER_VTABLE            = 50;


///////////////////////////////////////////////////////////
//  The byte-order is set at bytes 78 and 79. If we're
//  using little-endian byte-ordering we set:
//
//      offset 78:  FF
//      offset 79:  00
//
//  For big-endian (default) we set:
//
//      offset 78: 00
//      offset 79: FF
//
    global.S16_HEADER_ENDIANESS         = 118;

    