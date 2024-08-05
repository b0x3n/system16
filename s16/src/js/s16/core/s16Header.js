///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/s16Header.js            //
///////////////////////////////////////////////////////////
//
//  
//


///////////////////////////////////////////////////////////
//  All of the header offsets are defined in this
//  file:
//
    import { exeHeader } from           "./../defs/s16Header.js";


///////////////////////////////////////////////////////////
//  The s16Header module.                                //
///////////////////////////////////////////////////////////
//
    export const    s16Header           = exe_data =>
    {

        const   __exe_view              = new DataView(exe_data);


    ///////////////////////////////////////////////////////
    //  Byte ordering
    //
    //  If the __low_byte is 0xFF and the __high_byte is
    //  0x00 then we run in little-endian byte ordering,
    //  we set window.__s16Sys.little_endian to true,
    //  otherwise we set it to false for big-endian.
    //
        const   __low_byte              = __exe_view.getUint8(window.S16_HEADER_ENDIANESS);
        const   __high_byte             = __exe_view.getUint8(window.S16_HEADER_ENDIANESS + 1);

        if (__low_byte === 0xFF && __high_byte === 0x00)
            window.__s16Sys.little_endian = true;
        else if (__low_byte === 0x00 && __high_byte === 0xFF)
            window.__s16Sys.little_endian = false;
        else
            window.__s16_error(`Unknown byte ordering specified in header: ${__low_byte.toString(16)} ${__high_byte.toString(16)}`);


    ///////////////////////////////////////////////////////
    //  Header ID
    //
    //  The first check - is this is a valid s16exe then
    //  the first 6 bytes of the header should be:
    //
    //      s16exe
    //
        let     __s16_id                = '';

        for (let byte_no = 0; byte_no < 6; byte_no++)
            __s16_id += String.fromCharCode(__exe_view.getUint8(byte_no));

        if (__s16_id !== 's16exe')
            return window.__s16_error(`Invalid header ID: ${__s16_id}`);


    ///////////////////////////////////////////////////////
    //  Finally, return the header object.
    //
        let     _objHeader              =
        {

    //  First 6 bytes (id) should be the string s16exe.
    //
            'id':                       __s16_id,

    //  The next 3 bytes contain version info.
    //
            'major':                    __exe_view.getUint8(window.S16_HEADER_MAJOR),
            'minor':                    __exe_view.getUint8(window.S16_HEADER_MINOR),
            'patch':                    __exe_view.getUint8(window.S16_HEADER_PATCH),

    //  The next 4 bytes are the day, month and year of
    //  assembly, day and month are byte each, year is
    //  2 bytes.
    //
            'day':                      __exe_view.getUint8(window.S16_HEADER_DAY),
            'month':                    __exe_view.getUint8(window.S16_HEADER_MONTH),
            'year':                     __exe_view.getUint16(window.S16_HEADER_YEAR, window.__s16Sys.little_endian),

    //  Next is the header model - this is a 2-byte
    //  value that describes the memory layour, see
    //  the ExeHeader.js file in defs for more info.
    //
            'model':                    __exe_view.getUint16(window.S16_HEADER_MODEL, window.__s16Sys.little_endian),

    //  Next we have the exe size, a 4-byte value.
    //
            'exe_size':                 __exe_view.getUint32(window.S16_HEADER_EXESIZE, window.__s16Sys.little_endian),

    //  Now we have the RO, RW and CODE section offsets,
    //  these tell us where the data and code are in
    //  the file body - all 3 values are 4 bytes each.
    //
            'ro_offset':                __exe_view.getUint32(window.S16_HEADER_RO, window.__s16Sys.little_endian),
            'rw_offset':                __exe_view.getUint32(window.S16_HEADER_RW, window.__s16Sys.little_endian),
            'code_offset':              __exe_view.getUint32(window.S16_HEADER_CODE, window.__s16Sys.little_endian),

    //  The mode (8, 16 or 32-bit) value is 2 bytes.
    //
            'mode':                     __exe_view.getUint16(window.S16_HEADER_MODE, window.__s16Sys.little_endian),

    //  The main boot program can specify the total segments
    //  and max address values in the header - these are
    //  ignored for child processes.
    //
    //  Both values are 4 bytes each.
    //
            'segments':                 __exe_view.getUint32(window.S16_HEADER_SEGMENTS, window.__s16Sys.little_endian),
            'maxaddr':                  __exe_view.getUint32(window.S16_HEADER_MAXADDR, window.__s16Sys.little_endian),
        
    //  Next, get the _main offset, this is the entry point,
    //  the address of the first function to be run when
    //  the code is executed - it's an address so 4 bytes.
    //
            'main_offset':              __exe_view.getUint32(window.S16_HEADER_MAIN, window.__s16Sys.little_endian),

    //  Lastly the VTABLE offset, this is an area of memory
    //  in the header where we can define interrupts and
    //  attach them to specific device modules - 4 bytes.
    //
            'vtable_offset':            __exe_view.getUint32(window.S16_HEADER_VTABLE, window.__s16Sys.little_endian),

        };


        let     __memory_model;

        if (_objHeader.model === 1)     __memory_model = "flat";
        if (_objHeader.model === 2)     __memory_model = "dual";
        if (_objHeader.model === 3)     __memory_model = "multi";
        if (_objHeader.model === 4)     __memory_model = "split";

        let     __byte_ordering         = "Big-endian";

        if (window.__s16Sys.little_endian)
            __byte_ordering = "Little-endian";

        window.__s16_verbose(
`  Dumping exe header info:\n
    ID:                 ${_objHeader.id}
    Version:            ${_objHeader.major}.${_objHeader.minor}.${_objHeader.patch}
    Build date:         ${_objHeader.day}/${_objHeader.month}/${_objHeader.year}
    Mode:               ${(_objHeader.mode * 8)}-bit
    Byte-ordering:      ${__byte_ordering}
    Memory model:       ${__memory_model}
    RAM segments:       ${_objHeader.segments}
    Segment size:       ${(_objHeader.maxaddr + 1)} (MAXADDR=${_objHeader.maxaddr})
    Read-only offset:   ${_objHeader.ro_offset}
    Read-write offset:  ${_objHeader.rw_offset}
    Code offset:        ${_objHeader.code_offset}
    _main offset:       ${_objHeader.main_offset}
    V-table offset:     ${_objHeader.vtable_offset}
`
        );

    ///////////////////////////////////////////////////////
    //  Set the mode in __s16Sys.
    //
        window.__s16Sys.__mode = _objHeader.mode;

    ///////////////////////////////////////////////////////
    //  Exe size
    //
    //  One last check - is the file size the size
    //  specified (exe_size) in the header?
    //
    //  There's a tolerance of one byte, this is because
    //  the exe data is encoded to a 16-bit string formt
    //  so occasionally an additional byte is added by
    //  the linker.
    //
        let     __check_size            = true;

        if (_objHeader.exe_size < exe_data.byteLength && (exe_data.byteLength - _objHeader.exe_size) > 1)
            __check_size            = false
        if (_objHeader.exe_size > exe_data.byteLength && (_objHeader.exe_size - exe_data.byteLength) > 1)
            __check_size            = false

        if (__check_size === false)
            window.__s16_error(`Error - the exe file size (${exe_data.byteLength}) doesn't match the value in the header (${_objHeader.exe_size})`);

    ///////////////////////////////////////////////////////
    //  If we get this far we're good to go.
    //
        return _objHeader;
        
    };

