///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Loc.js           //
///////////////////////////////////////////////////////////
//
//  The loc instruction set.
//


///////////////////////////////////////////////////////////
//  The s16Loc instruction.                              //
///////////////////////////////////////////////////////////
//
    export const    s16Loc              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {


        const   _instruction            = "loc";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('loc8'),
            window.S16_MNEMONIC_INFO('loc16'),
            window.S16_MNEMONIC_INFO('loc32'),

        ];


///////////////////////////////////////////////////////////
//  __par()                                              //
///////////////////////////////////////////////////////////
//
        const   __loc                   = (

            s16Process,
            code_line,
            size

        ) =>
        {

            const   __sp                = get_reg(
                s16Process.code_segment,
                'SP'
            );

            const   __dst_offset        = code_line[6];
            const   __offset            = code_line[7];

            if (size > window.__s16Sys.__mode)
                return `loc error: can't write to ${size * 8}-bit address in ${window.__s16Sys.__mode}-bit mode`;

            let     __dst_segment       = s16Process.code_segment;

            if (__dst_offset >= s16Process.ro_offset && __dst_offset < s16Process.rw_offset)
                __dst_segment           = s16Process.ro_segment;
            if (__dst_offset >= s16Process.rw_offset && __dst_offset < s16Process.code_offset)
                __dst_segment           = s16Process.rw_segment;

            const   __par_value         = read_ram(
                s16Process.code_segment,
                (__sp + __offset),
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
//  _loc8()                                              //
///////////////////////////////////////////////////////////
//
        const   _loc8                   = (

            s16Process,
            code_line

        ) =>
        {

            return __loc(
                s16Process,
                code_line,
                1
            );

        };


///////////////////////////////////////////////////////////
//  _loc16()                                             //
///////////////////////////////////////////////////////////
//
        const   _loc16                  = (

            s16Process,
            code_line

        ) =>
        {

            return __loc(
                s16Process,
                code_line,
                2
            );

        };


///////////////////////////////////////////////////////////
//  _loc32()                                             //
///////////////////////////////////////////////////////////
//
        const   _loc32                  = (

            s16Process,
            code_line

        ) =>
        {

            return __loc(
                s16Process,
                code_line,
                4
            );

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            loc8:                       _loc8,
            loc16:                      _loc16,
            loc32:                      _loc32

        };

    };

