///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Calc.js          //
///////////////////////////////////////////////////////////
//
//  The s16Calc module implements a bunch of mathematical
//  instructions:
//
//      add8, add16, add32
//      sub8, sub16, sub32
//      div8, div16, div32
//      mul8, mul16, mul32
//


///////////////////////////////////////////////////////////
//  The s16Calc module.                                  //
///////////////////////////////////////////////////////////
//
    export const    s16Calc             = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        const   _instruction            = "Math";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('add8'),
            window.S16_MNEMONIC_INFO('add16'),
            window.S16_MNEMONIC_INFO('add32'),

            window.S16_MNEMONIC_INFO('sub8'),
            window.S16_MNEMONIC_INFO('sub16'),
            window.S16_MNEMONIC_INFO('sub32'),

            window.S16_MNEMONIC_INFO('div8'),
            window.S16_MNEMONIC_INFO('div16'),
            window.S16_MNEMONIC_INFO('div32'),

            window.S16_MNEMONIC_INFO('mul8'),
            window.S16_MNEMONIC_INFO('mul16'),
            window.S16_MNEMONIC_INFO('mul32')

        ];


///////////////////////////////////////////////////////////
//  __calc()                                             //
///////////////////////////////////////////////////////////
//
//  All of the mnemonic methods are just wrappers that
//  call __calc().
//
        const   __calc                  = (

            s16Process,
            code_line

        ) =>
        {

            let     __lval_addr         = code_line[6];
            let     __rval              = code_line[7];

    //  The __lval is an address containing the value
    //  we need so we need to figure out what section
    //  it's in.
    //
            let     __lval_segment      = s16Process.code_segment;

            if (__lval_addr >= s16Process.ro_offset && __lval_addr < s16Process.rw_offset)
                __lval_segment          = s16Process.ro_segment;
            if (__lval_addr >= s16Process.rw_offset && __lval_addr < s16Process.code_offset)
                __lval_segment          = s16Process.rw_segment;

            let     __mnemonic          = code_line[4];

    //  Set the appropriate size parameter for the read to
    //  __dst_addr.
    //
            let     __lval_size;

            if (
                (__mnemonic === window.S16_MNEMONIC_ADD8)   ||
                (__mnemonic === window.S16_MNEMONIC_SUB8)   ||
                (__mnemonic === window.S16_MNEMONIC_DIV8)   ||
                (__mnemonic === window.S16_MNEMONIC_MUL8)
            ) __lval_size               = 1;
            if (
                (__mnemonic === window.S16_MNEMONIC_ADD16)   ||
                (__mnemonic === window.S16_MNEMONIC_SUB16)   ||
                (__mnemonic === window.S16_MNEMONIC_DIV16)   ||
                (__mnemonic === window.S16_MNEMONIC_MUL16)
            ) __lval_size               = 2;
            if (
                (__mnemonic === window.S16_MNEMONIC_ADD32)   ||
                (__mnemonic === window.S16_MNEMONIC_SUB32)   ||
                (__mnemonic === window.S16_MNEMONIC_DIV32)   ||
                (__mnemonic === window.S16_MNEMONIC_MUL32)
            ) __lval_size               = 4;

    //  Grab the __lval and do the calculation...
    //
            let     __lval              = read_ram(
                __lval_segment,
                __lval_addr,
                __lval_size
            );

            if (__mnemonic.substr(0, 3) === 'add')
                __lval += __rval;
            if (__mnemonic.substr(0, 3) === 'sub')
                __lval -= __rval;
            if (__mnemonic.substr(0, 3) === 'div')
                __lval /= __rval;
            if (__mnemonic.substr(0, 3) === 'mul')
                __lval *= __rval;

    //  The result is written back to __lval_addr.
    //
            write_ram(
                __lval_segment,
                __lval_addr,
                __lval,
                __lval_size
            );

            return true;

        };


///////////////////////////////////////////////////////////
//  _add8()                                              //
///////////////////////////////////////////////////////////
//
        const   _add8                   = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _add16()                                             //
///////////////////////////////////////////////////////////
//
        const   _add16                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _add32()                                             //
///////////////////////////////////////////////////////////
//
        const   _add32                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _sub8()                                              //
///////////////////////////////////////////////////////////
//
        const   _sub8                   = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _sub16()                                             //
///////////////////////////////////////////////////////////
//
        const   _sub16                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _sub32()                                             //
///////////////////////////////////////////////////////////
//
        const   _sub32                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _div8()                                              //
///////////////////////////////////////////////////////////
//
        const   _div8                   = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _div16()                                             //
///////////////////////////////////////////////////////////
//
        const   _div16                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _div32()                                             //
///////////////////////////////////////////////////////////
//
        const   _div32                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _mul8()                                              //
///////////////////////////////////////////////////////////
//
        const   _mul8                   = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _mul16()                                             //
///////////////////////////////////////////////////////////
//
        const   _mul16                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _mul32()                                             //
///////////////////////////////////////////////////////////
//
        const   _mul32                  = (

            s16Process,
            code_line

        ) =>
        {

            return __calc(
                s16Process,
                code_line
            );

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            add8:                       _add8,
            add16:                      _add16,
            add32:                      _add32,

            sub8:                       _sub8,
            sub16:                      _sub16,
            sub32:                      _sub32,

            div8:                       _div8,
            div16:                      _div16,
            div32:                      _div32,

            mul8:                       _mul8,
            mul16:                      _mul16,
            mul32:                      _mul32

        };

    };

