///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/code/ins/s16X.js             //
///////////////////////////////////////////////////////////
//
//  The x instruction set.
//


///////////////////////////////////////////////////////////
//  The x instruction.                                   //
///////////////////////////////////////////////////////////
//
    export const    s16X                = (

        objDevices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        const   _instruction            = "x";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('xe'),
            window.S16_MNEMONIC_INFO('xne'),
            window.S16_MNEMONIC_INFO('xge'),
            window.S16_MNEMONIC_INFO('xle'),
            window.S16_MNEMONIC_INFO('xgt'),
            window.S16_MNEMONIC_INFO('xlt'),

        ];


///////////////////////////////////////////////////////////
//  _xe()                                                //
///////////////////////////////////////////////////////////
//
//  The x instructions are similar to the conditional
//  jump statements only we execute the following line
//  of code instead of jump if the condition is true,
//  example:
//
//      cmp16   val_1, val_2
//      xe      call    function_1
//
//  This will execute the call instruction if val_1
//  and val_2 are equal.
//
        const   _xe                     = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

    //  In this case if the condition is not true we set
    //  the S16_STATUS_SKIPPING status for the process, this
    //  tells s16Cpu to skip the next instruction.
    //
            if (! (__flags & window.__s16Eval.S16_EVAL_EQUALTO))
                s16Process.status       = window.__s16Proc.S16_STATUS_SKIPPING;

            return true;

        };


///////////////////////////////////////////////////////////
//  _xne()                                               //
///////////////////////////////////////////////////////////
//
        const   _xne                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (__flags & window.__s16Eval.S16_EVAL_EQUALTO)
                s16Process.status       = window.__s16Proc.S16_STATUS_SKIPPING;

            return true;

        };


///////////////////////////////////////////////////////////
//  _xge()                                               //
///////////////////////////////////////////////////////////
//
        const   _xge                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (
                (! (__flags & window.__s16Eval.S16_EVAL_GREATERTHAN))   &&
                (! (__flags & window.__s16Eval.S16_EVAL_EQUALTO))
            )
                s16Process.status       = window.__s16Proc.S16_STATUS_SKIPPING;

            return true;
            
        };


///////////////////////////////////////////////////////////
//  _xgt()                                               //
///////////////////////////////////////////////////////////
//
        const   _xgt                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (! (__flags & window.__s16Eval.S16_EVAL_GREATERTHAN))
                s16Process.status       = window.__s16Proc.S16_STATUS_SKIPPING;

            return true;
            
        };


///////////////////////////////////////////////////////////
//  _xle()                                               //
///////////////////////////////////////////////////////////
//
        const   _xle                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (
                (! (__flags & window.__s16Eval.S16_EVAL_LESSTHAN))   &&
                (! (__flags & window.__s16Eval.S16_EVAL_EQUALTO))
            )
                s16Process.status       = window.__s16Proc.S16_STATUS_SKIPPING;

            return true;
            
        };


///////////////////////////////////////////////////////////
//  _xlt()                                               //
///////////////////////////////////////////////////////////
//
        const   _xlt                    = (

            s16Process,
            code_line

        ) =>
        {

            const   __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

            if (! (__flags & window.__s16Eval.S16_EVAL_LESSTHAN))
                s16Process.status       = window.__s16Proc.S16_STATUS_SKIPPING;

            return true;
            
        };


        return {

            instruction:                _instruction,
            info:                       _info,

            xe:                         _xe,
            xne:                        _xne,
            xge:                        _xge,
            xgt:                        _xgt,
            xle:                        _xle,
            xlt:                        _xlt

        };

    };

