///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/code/ins/s16Jmp.js           //
///////////////////////////////////////////////////////////
//
//  The jmp instruction set.
//


    export const    s16Jmp              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        const   _instruction            = "jmp";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO("jmp"),
            window.S16_MNEMONIC_INFO("je"),
            window.S16_MNEMONIC_INFO("jne"),
            window.S16_MNEMONIC_INFO("jge"),
            window.S16_MNEMONIC_INFO("jgt"),
            window.S16_MNEMONIC_INFO("jle"),
            window.S16_MNEMONIC_INFO("jlt")

        ];


///////////////////////////////////////////////////////////
//  _jmp()                                               //
///////////////////////////////////////////////////////////
//
        const   _jmp                    = (

            s16Process,
            code_line

        ) =>
        {

    //  So long as the address we're jumping to is
    //  <= the code offset we're fine.
    //
            const   __jump_address      = code_line[6];

            if (__jump_address < s16Process.code_offset)
                return `${code_line[4]} error: Attempt to jump to an invalid location ${__jump_address}`;

            set_reg(
                s16Process.code_segment,
                'IP',
                __jump_address
            );

            return true;

        };


///////////////////////////////////////////////////////////
//  _je()                                                //
///////////////////////////////////////////////////////////
//
        const   _je                     = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (__flags & window.__s16Eval.S16_EVAL_EQUALTO)
                _jmp(
                    s16Process,
                    code_line
                );

            return true;

        };


///////////////////////////////////////////////////////////
//  _jne()                                               //
///////////////////////////////////////////////////////////
//
        const   _jne                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (! (__flags & window.__s16Eval.S16_EVAL_EQUALTO))
                _jmp(
                    s16Process,
                    code_line
                );

            return true;

        };


///////////////////////////////////////////////////////////
//  _jgt()                                               //
///////////////////////////////////////////////////////////
//
        const   _jgt                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (__flags & window.__s16Eval.S16_EVAL_GREATERTHAN)
                _jmp(
                    s16Process,
                    code_line
                );

            return true;

        };


///////////////////////////////////////////////////////////
//  _jge()                                               //
///////////////////////////////////////////////////////////
//
        const   _jge                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (
                (__flags & window.__s16Eval.S16_EVAL_GREATERTHAN)   ||
                (__flags & window.__s16Eval.S16_EVAL_EQUALTO)
            )
                _jmp(
                    s16Process,
                    code_line
                );

            return true;

        };


///////////////////////////////////////////////////////////
//  _jlt()                                               //
///////////////////////////////////////////////////////////
//
        const   _jlt                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (__flags & window.__s16Eval.S16_EVAL_LESSTHAN)
                _jmp(
                    s16Process,
                    code_line
                );

            return true;

        };


///////////////////////////////////////////////////////////
//  _jle()                                               //
///////////////////////////////////////////////////////////
//
        const   _jle                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (
                (__flags & window.__s16Eval.S16_EVAL_LESSTHAN)   ||
                (__flags & window.__s16Eval.S16_EVAL_EQUALTO)
            )
                _jmp(
                    s16Process,
                    code_line
                );

            return true;

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            jmp:                        _jmp,
            je:                         _je,
            jne:                        _jne,
            jgt:                        _jgt,
            jge:                        _jge,
            jlt:                        _jlt,
            jle:                        _jle

        };

    };

