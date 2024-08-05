///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/int/s16Cmp.js           //
///////////////////////////////////////////////////////////
//
//  The cmp instruction set.
//



///////////////////////////////////////////////////////////
//  The s16Cmp instruction.                              //
///////////////////////////////////////////////////////////
//
    export const    s16Cmp              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        const   _instruction            = "cmp";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO("cmp8"),
            window.S16_MNEMONIC_INFO("cmp16"),
            window.S16_MNEMONIC_INFO("cmp32")

        ];


///////////////////////////////////////////////////////////
//  _cmp()                                               //
///////////////////////////////////////////////////////////
//
        const   _cmp                    = (

            s16Process,
            code_line

        ) =>
        {

    //  We set a bit in flags to indicate the outcome
    //  of a comparison - see:
    //
    //      System16/s16/src/js/s16/defs/s16Eval.js
    //
    //  For more info.
    //
            let     __flags             = get_reg(
                s16Process.code_segment,
                'FL'
            );

    //  Clear the first 3 bits.
    //
            __flags &= (~window.__s16Eval.S16_EVAL_RESET);

    //  Now set the appropriate bit based on the outcome
    //  of the evaluation...we are comparing the right
    //  operand to the left, this matters:
    //
    //      cmp32   left, right;
    //      jlt     function_name;
    //
    //  Here, we jump to function_name if right is less
    //  than left - this is why I'm now comparing operand
    //  2 (code_line[7]) to operand 1 (code_line[6]).
    //
            if (code_line[7] === code_line[6])
                __flags |= window.__s16Eval.S16_EVAL_EQUALTO;
            if (code_line[7] < code_line[6])
                __flags |= window.__s16Eval.S16_EVAL_LESSTHAN;
            if (code_line[7] > code_line[6])
                __flags |= window.__s16Eval.S16_EVAL_GREATERTHAN;

            set_reg(
                s16Process.code_segment,
                'FL',
                __flags
            );

        };


///////////////////////////////////////////////////////////
//  _cmp()                                               //
///////////////////////////////////////////////////////////
//
//  In the case of cmp - we don't care about the size
//  of the operands because nothing is being written
//  anywhere - the 8, 16 and 32 postfix simply tells
//  the fetcher the size of the operands - we don't
//  need to care since they're now tokenised in an
//  array - so the _cmp8, _cmp16 and _cmp32 methods
//  are just wrappers or aliases for _cmp.
//
        const   _cmp8                   = (

            s16Process,
            code_line

        ) =>
        {

            _cmp(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _cmp16()                                              //
///////////////////////////////////////////////////////////
//  
        const   _cmp16                  = (

            s16Process,
            code_line

        ) =>
        {

            _cmp(
                s16Process,
                code_line
            );

        };


///////////////////////////////////////////////////////////
//  _cmp32()                                             //
///////////////////////////////////////////////////////////
//
        const   _cmp32                  = (

            s16Process,
            code_line

        ) =>
        {

            _cmp(
                s16Process,
                code_line
            );

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            cmp8:                       _cmp8,
            cmp16:                      _cmp16,
            cmp32:                      _cmp32

        };
        
    };

