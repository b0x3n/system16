///////////////////////////////////////////////////////////
//  System16/core/defs/s16Header.js                      //
///////////////////////////////////////////////////////////
//
//  The window.S16_HEADER_* values are offsets for the
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
    window.S16_HEADER_ID                = 0;

    //  Every exe starts with this string.
    //
        window.S16_ID                   = 's16exe';


///////////////////////////////////////////////////////////
//  Version info - each value is 1 byte.
//
    window.S16_HEADER_MAJOR             = 7;
    window.S16_HEADER_MINOR             = 8;
    window.S16_HEADER_PATCH             = 9;

    //  This version (1.0.0);
    //
        window.S16_MAJOR                = 1;
        window.S16_MINOR                = 0;
        window.S16_PATCH                = 0;


///////////////////////////////////////////////////////////
//  Build date - the day and month are 1 byte, the
//  year is 2 bytes.
//
    window.S16_HEADER_DAY               = 10;
    window.S16_HEADER_MONTH             = 11;
    window.S16_HEADER_YEAR              = 12;


///////////////////////////////////////////////////////////
//  Memory model - this is a 2 byte value.
//
    window.S16_HEADER_MODEL             = 14;

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
        window.S16_MODEL_FLAT           = 1;
        window.S16_MODEL_DUAL           = 2;
        window.S16_MODEL_MULTI          = 3;
        window.S16_MODEL_SPLIT          = 4;

        window.S16_MODEL_DEFAULT        = window.S16_MODEL_FLAT;


///////////////////////////////////////////////////////////
//  Total file size and ro, rw and code section offsets,
//  these are all 4 bytes.
//
//  If running on dual, multi or split models then these
//  may point to segments as opposed to addresses in the
//  code segment.
//
    window.S16_HEADER_EXESIZE           = 16;
    window.S16_HEADER_RO                = 20;
    window.S16_HEADER_RW                = 24;
    window.S16_HEADER_CODE              = 28;


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
    window.S16_HEADER_MODE              = 32;

        window.S16_MODE_S8              = 's8';
        window.S16_MODE_S16             = 's16';
        window.S16_MODE_S32             = 's32';

///////////////////////////////////////////////////////////
//  Total number of RAM segments to allocate and the size
//  of each segment - these are both 4 byte values.
//
    window.S16_HEADER_SEGMENTS          = 34;
    window.S16_HEADER_MAXADDR           = 38;

    //  Defaults.
    //
        window.S16_MODE                 = window.S16_MODE_S16;
        window.S16_SEGMENTS             = 16;
        window.S16_MAXADDR              = 0xFFFF;


///////////////////////////////////////////////////////////
//  Offset of the _main (entry point) function is stored
//  at this location.
//
    window.S16_HEADER_MAIN              = 46;


///////////////////////////////////////////////////////////
//  Vector table offset, this is stored in the header at
//  offset 50, it occupies 25 bytes.
//
    window.S16_HEADER_VTABLE            = 50;


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
    window.S16_HEADER_ENDIANESS         = 118;

    