///////////////////////////////////////////////////////////
//  System16/core/defs/Mnemonics.js                      //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  These are used as keys to create the global
//  S16_MNEMONICS object.
//

    global.S16_MNEMONIC_DEV             = 'dev';
    global.S16_MNEMONIC_CALL            = 'call';
    global.S16_MNEMONIC_INT             = 'int';
    global.S16_MNEMONIC_RET             = 'ret';


    global.S16_MNEMONIC_MOV8            = 'mov8';
    global.S16_MNEMONIC_MOV16           = 'mov16';
    global.S16_MNEMONIC_MOV32           = 'mov32';


    global.S16_MNEMONIC_PUSH8           = 'push8';
    global.S16_MNEMONIC_PUSH16          = 'push16';
    global.S16_MNEMONIC_PUSH32          = 'push32';

    global.S16_MNEMONIC_POP8            = 'pop8';
    global.S16_MNEMONIC_POP16           = 'pop16';
    global.S16_MNEMONIC_POP32           = 'pop32';


    global.S16_MNEMONIC_PEEK            = 'peek';

    global.S16_MNEMONIC_PAR8            = 'par8';
    global.S16_MNEMONIC_PAR16           = 'par16';
    global.S16_MNEMONIC_PAR32           = 'par32';


    global.S16_MNEMONIC_ADD8            = 'add8';
    global.S16_MNEMONIC_ADD16           = 'add16';
    global.S16_MNEMONIC_ADD32           = 'add32';

    global.S16_MNEMONIC_SUB8            = 'sub8';
    global.S16_MNEMONIC_SUB16           = 'sub16';
    global.S16_MNEMONIC_SUB32           = 'sub32';

    global.S16_MNEMONIC_DIV8            = 'div8';
    global.S16_MNEMONIC_DIV16           = 'div16';
    global.S16_MNEMONIC_DIV32           = 'div32';

    global.S16_MNEMONIC_MUL8            = 'mul8';
    global.S16_MNEMONIC_MUL16           = 'mul16';
    global.S16_MNEMONIC_MUL32           = 'mul32';


    global.S16_MNEMONIC_CMP8            = 'cmp8';
    global.S16_MNEMONIC_CMP16           = 'cmp16';
    global.S16_MNEMONIC_CMP32           = 'cmp32';


    global.S16_MNEMONIC_JMP             = 'jmp';
    global.S16_MNEMONIC_JE              = 'je';
    global.S16_MNEMONIC_JNE             = 'jne';
    global.S16_MNEMONIC_JGE             = 'jge';
    global.S16_MNEMONIC_JLE             = 'jle';
    global.S16_MNEMONIC_JGT             = 'jgt';
    global.S16_MNEMONIC_JLT             = 'jlt';


    global.S16_MNEMONIC_XE              = 'xe';
    global.S16_MNEMONIC_XNE             = 'xne';
    global.S16_MNEMONIC_XGE             = 'xge';
    global.S16_MNEMONIC_XLE             = 'xle';
    global.S16_MNEMONIC_XGT             = 'xgt';
    global.S16_MNEMONIC_XLT             = 'xlt';


    global.S16_MNEMONICS                =
    {


///////////////////////////////////////////////////////////
//  The dev/call/int/return
//
        [global.S16_MNEMONIC_DEV]:      {
                                            'opcode':       0x0A,
                                            'params':       [ 1, 1, 2 ]
                                        },
        [global.S16_MNEMONIC_CALL]:     {
                                            'opcode':       0x1A,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_INT]:      {
                                            'opcode':       0x1B,
                                            'params':       [ 1 ]
                                        },
        [global.S16_MNEMONIC_RET]:      {
                                            'opcode':       0x1C,
                                            'params':       [ 1 ]
                                        },
                                        

///////////////////////////////////////////////////////////
//  mov instructions.
//
        [global.S16_MNEMONIC_MOV8]:     {
                                            'opcode':       0x20,
                                            'params':       [ 2, 1 ]
                                        },
        [global.S16_MNEMONIC_MOV16]:    {
                                            'opcode':       0x21,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_MOV32]:    {
                                            'opcode':       0x22,
                                            'params':       [ 2, 4 ]
                                        },


///////////////////////////////////////////////////////////
//  Push and pop instructions
//
        [global.S16_MNEMONIC_PUSH8]:    {
                                            'opcode':       0x2A,
                                            'params':       [ 1 ]
                                        },
        [global.S16_MNEMONIC_PUSH16]:   {
                                            'opcode':       0x2B,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_PUSH32]:   {
                                            'opcode':       0x2C,
                                            'params':       [ 4 ]
                                        },

        [global.S16_MNEMONIC_POP8]:    {
                                            'opcode':       0x2D,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_POP16]:    {
                                            'opcode':       0x2E,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_POP32]:    {
                                            'opcode':       0x2F,
                                            'params':       [ 2 ]
                                        },

    //  
        [global.S16_MNEMONIC_PEEK]:     {
                                            'opcode':       0x30,
                                            'params':       [ 2, 2, 2, 1 ]
                                        },
        // [global.S16_MNEMONIC_PAR16]:    {
        //                                     'opcode':       0x31,
        //                                     'params':       [ 2, 4 ]
        //                                 },
        // [global.S16_MNEMONIC_PAR32]:    {
        //                                     'opcode':       0x32,
        //                                     'params':       [ 4, 4 ]
        //                                 },

        [global.S16_MNEMONIC_PAR8]:     {
                                            'opcode':       0x31,
                                            'params':       [ 2, 1 ]
                                        },

        [global.S16_MNEMONIC_PAR16]:    {
                                            'opcode':       0x32,
                                            'params':       [ 2, 2 ]
                                        },

        [global.S16_MNEMONIC_PAR32]:    {
                                            'opcode':       0x33,
                                            'params':       [ 2, 4 ]
                                        },


///////////////////////////////////////////////////////////
//  Mathematical operations
//
        [global.S16_MNEMONIC_ADD8]:     {
                                            'opcode':       0x40,
                                            'params':       [ 2, 1 ]
                                        },
        [global.S16_MNEMONIC_ADD16]:    {
                                            'opcode':       0x41,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_ADD32]:    {
                                            'opcode':       0x42,
                                            'params':       [ 2, 4 ]
                                        },

        [global.S16_MNEMONIC_SUB8]:     {
                                            'opcode':       0x43,
                                            'params':       [ 2, 1 ]
                                        },
        [global.S16_MNEMONIC_SUB16]:    {
                                            'opcode':       0x44,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_SUB32]:    {
                                            'opcode':       0x45,
                                            'params':       [ 2, 4 ]
                                        },

        [global.S16_MNEMONIC_DIV8]:     {
                                            'opcode':       0x46,
                                            'params':       [ 2, 1 ]
                                        },
        [global.S16_MNEMONIC_DIV16]:    {
                                            'opcode':       0x47,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_DIV32]:    {
                                            'opcode':       0x48,
                                            'params':       [ 2, 4 ]
                                        },

        [global.S16_MNEMONIC_MUL8]:     {
                                            'opcode':       0x49,
                                            'params':       [ 2, 1 ]
                                        },
        [global.S16_MNEMONIC_MUL16]:    {
                                            'opcode':       0x50,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_MUL32]:    {
                                            'opcode':       0x51,
                                            'params':       [ 2, 4 ]
                                        },


///////////////////////////////////////////////////////////
//  Evaluation/comparison instructions
//
        [global.S16_MNEMONIC_CMP8]:     {
                                            'opcode':       0x5A,
                                            'params':       [ 1, 1 ]
                                        },
        [global.S16_MNEMONIC_CMP16]:    {
                                            'opcode':       0x5B,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_CMP32]:    {
                                            'opcode':       0x5C,
                                            'params':       [ 4, 4 ]
                                        },


///////////////////////////////////////////////////////////
//  Jump instructions
//
        [global.S16_MNEMONIC_JMP]:      {
                                            'opcode':       0x60,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_JE]:       {
                                            'opcode':       0x61,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_JNE]:      {
                                            'opcode':       0x62,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_JGE]:      {
                                            'opcode':       0x63,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_JLE]:      {
                                            'opcode':       0x64,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_JGT]:      {
                                            'opcode':       0x65,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_JLT]:      {
                                            'opcode':       0x66,
                                            'params':       [ 2 ]
                                        },


    ///////////////////////////////////////////////////////
    //  Execute - this allows you to execute a line of
    //  code based on the outcome of an expression, e.g:
    //
    //      cmp32   val1, val2;
    //      xe      call function_name
    //
    //  This means you can execute an instruction based
    //  on an evaluation - we have the same variants as
    //  with the jmp instruction:
    //
    //      xe      - equal to
    //      xne     - not equal to
    //      xlt     - less than
    //      xgt     - greater than
    //      xle     - less than or equal to
    //      xge     - greater than or equal to
    //
        [global.S16_MNEMONIC_XE]:       {
                                            'opcode':       0x70,
                                            'params':       []
                                        },
        [global.S16_MNEMONIC_XNE]:      {
                                            'opcode':       0x71,
                                            'params':       []
                                        },
        [global.S16_MNEMONIC_XGE]:      {
                                            'opcode':       0x72,
                                            'params':       []
                                        },
        [global.S16_MNEMONIC_XLE]:      {
                                            'opcode':       0x73,
                                            'params':       []
                                        },
        [global.S16_MNEMONIC_XGT]:      {
                                            'opcode':       0x74,
                                            'params':       []
                                        },
        [global.S16_MNEMONIC_XLT]:      {
                                            'opcode':       0x75,
                                            'params':       []
                                        }
    };


///////////////////////////////////////////////////////////
//  Will return mnemonic information based on the opcode.
//
    global.S16_MNEMONIC_BY_OPCODE       = opcode =>
    {

        let     _objMnemonic            = false;


        Object.keys(global.S16_MNEMONICS).forEach((key, index) => {

            if (_objMnemonic)
                return;

            if (global.S16_MNEMONICS[key].opcode === opcode)
                _objMnemonic = {
                    'mnemonic':         key,
                    'opcode':           opcode,
                    'params':           global.S16_MNEMONICS[key].params
                };

        });

        return _objMnemonic;

    };


///////////////////////////////////////////////////////////
//  Operand modifiers.
//
    global.S16_MOD_DIRECT               =
    [

        0b1000000000000000,
        0b0100000000000000,
        0b0010000000000000,
        0b0001000000000000

    ];

        global.S16_ADDRMODE_DIRECT      = '%';


    global.S16_MOD_INDIRECT             =
    [

        0b0000100000000000,
        0b0000010000000000,
        0b0000001000000000,
        0b0000000100000000

    ];

        global.S16_ADDRMODE_INDIRECT    = '#'
