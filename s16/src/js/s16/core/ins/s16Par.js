///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Pqr.js           //
///////////////////////////////////////////////////////////
//
//  The par instruction.
//


///////////////////////////////////////////////////////////
//  The s16Peek instruction.                             //
///////////////////////////////////////////////////////////
//
    export const    s16Par= (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {


        const   _instruction            = "par";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('par8'),
            window.S16_MNEMONIC_INFO('par16'),
            window.S16_MNEMONIC_INFO('par32'),

        ];


///////////////////////////////////////////////////////////
//  __par()                                              //
///////////////////////////////////////////////////////////
//
        const   __par                   = (

            s16Process,
            code_line,
            size

        ) =>
        {

            const   __bp                = get_reg(
                s16Process.code_segment,
                'BP'
            );

            const   __dst_offset        = code_line[6];
            const   __offset            = code_line[7];

            if (size > window.__s16Sys.__mode)
                return `par error: can't write to ${size * 8}-bit address in ${window.__s16Sys.__mode}-bit mode`;

            let     __dst_segment       = s16Process.code_segment;

            if (__dst_offset >= s16Process.ro_offset && __dst_offset < s16Process.rw_offset)
                __dst_segment           = s16Process.ro_segment;
            if (__dst_offset >= s16Process.rw_offset && __dst_offset < s16Process.code_offset)
                __dst_segment           = s16Process.rw_segment;

            // if (size > window.__s16Sys.__mode)
            //     size = window.__s16Sys.__mode;
    //  __bp points to the old base pointer, __bp + 4
    //  points to the return address, so we add 4
    //  to the offset to reference the first parameter.
    //
            const   __par_value         = read_ram(
                s16Process.code_segment,
                (__bp + __offset + 4),
                size
            );

            write_ram(
                __dst_segment,
                __dst_offset,
                __par_value,
                size
            );

            return true;

        };


///////////////////////////////////////////////////////////
//  _par8()                                              //
///////////////////////////////////////////////////////////
//
        const   _par8                   = (

            s16Process,
            code_line

        ) =>
        {

            return __par(
                s16Process,
                code_line,
                1
            );

        };


///////////////////////////////////////////////////////////
//  _par16()                                             //
///////////////////////////////////////////////////////////
//
        const   _par16                  = (

            s16Process,
            code_line

        ) =>
        {

            return __par(
                s16Process,
                code_line,
                2
            );

        };


///////////////////////////////////////////////////////////
//  _par32()                                             //
///////////////////////////////////////////////////////////
//
        const   _par32                  = (

            s16Process,
            code_line

        ) =>
        {

            return __par(
                s16Process,
                code_line,
                4
            );

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            par8:                       _par8,
            par16:                      _par16,
            par32:                      _par32

        };

    };

