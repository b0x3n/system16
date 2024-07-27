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
    global.S16_MNEMONIC_WAIT            = 'wait';


    global.S16_MNEMONIC_MOV8            = 'mov8';
    global.S16_MNEMONIC_MOV16           = 'mov16';
    global.S16_MNEMONIC_MOV32           = 'mov32';


    global.S16_MNEMONIC_PUSH8           = 'push8';
    global.S16_MNEMONIC_PUSH16          = 'push16';
    global.S16_MNEMONIC_PUSH32          = 'push32';

    global.S16_MNEMONIC_POP8            = 'pop8';
    global.S16_MNEMONIC_POP16           = 'pop16';
    global.S16_MNEMONIC_POP32           = 'pop32';


    global.S16_MNEMONIC_ADD8            = 'add8';
    global.S16_MNEMONIC_ADD16           = 'add16';
    global.S16_MNEMONIC_ADD32           = 'add32';

    global.S16_MNEMONIC_SUB8            = 'sub8';
    global.S16_MNEMONIC_SUB16           = 'sub16';
    global.S16_MNEMONIC_SUB32           = 'sub32';


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


    global.S16_MNEMONICS                =
    {


///////////////////////////////////////////////////////////
//  The dev/call/int/return
//
        [global.S16_MNEMONIC_DEV]:      {
                                            'opcode':       0x0A,
                                            'params':       [ 1, 4, 4 ]
                                        },
        [global.S16_MNEMONIC_CALL]:     {
                                            'opcode':       0x1A,
                                            'params':       [ 4 ]
                                        },
        [global.S16_MNEMONIC_INT]:      {
                                            'opcode':       0x1B,
                                            'params':       [ 1 ]
                                        },
        [global.S16_MNEMONIC_RET]:      {
                                            'opcode':       0x1C,
                                            'params':       [ 1 ]
                                        },
        [global.S16_MNEMONIC_WAIT]:     {
                                            'opcode':       0x1D,
                                            'params':       [ 4 ]
                                        },
                                        

///////////////////////////////////////////////////////////
//  mov instructions.
//
        [global.S16_MNEMONIC_MOV8]:     {
                                            'opcode':       0x20,
                                            'params':       [ 1, 1 ]
                                        },
        [global.S16_MNEMONIC_MOV16]:    {
                                            'opcode':       0x21,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_MOV32]:    {
                                            'opcode':       0x22,
                                            'params':       [ 4, 4 ]
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
                                            'params':       [ 1 ]
                                        },
        [global.S16_MNEMONIC_POP16]:    {
                                            'opcode':       0x2E,
                                            'params':       [ 2 ]
                                        },
        [global.S16_MNEMONIC_POP32]:    {
                                            'opcode':       0x2F,
                                            'params':       [ 4 ]
                                        },


///////////////////////////////////////////////////////////
//  Mathematical operations
//
        [global.S16_MNEMONIC_ADD8]:     {
                                            'opcode':       0x40,
                                            'params':       [ 1, 1 ]
                                        },
        [global.S16_MNEMONIC_ADD16]:    {
                                            'opcode':       0x41,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_ADD32]:    {
                                            'opcode':       0x42,
                                            'params':       [ 4, 4 ]
                                        },

        [global.S16_MNEMONIC_SUB8]:     {
                                            'opcode':       0x43,
                                            'params':       [ 1, 1 ]
                                        },
        [global.S16_MNEMONIC_SUB16]:    {
                                            'opcode':       0x44,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_SUB32]:    {
                                            'opcode':       0x45,
                                            'params':       [ 4, 4 ]
                                        },


///////////////////////////////////////////////////////////
//  Evaluation/comparison instructions
//
        [global.S16_MNEMONIC_CMP8]:     {
                                            'opcode':       0x50,
                                            'params':       [ 1, 1 ]
                                        },
        [global.S16_MNEMONIC_CMP16]:    {
                                            'opcode':       0x51,
                                            'params':       [ 2, 2 ]
                                        },
        [global.S16_MNEMONIC_CMP32]:    {
                                            'opcode':       0x52,
                                            'params':       [ 4, 4 ]
                                        },


///////////////////////////////////////////////////////////
//  Jump instructions
//
        [global.S16_MNEMONIC_JMP]:      {
                                            'opcode':       0x60,
                                            'params':       [ 4 ]
                                        },
        [global.S16_MNEMONIC_JE]:       {
                                            'opcode':       0x61,
                                            'params':       [ 4 ]
                                        },
        [global.S16_MNEMONIC_JNE]:      {
                                            'opcode':       0x62,
                                            'params':       [ 4 ]
                                        },
        [global.S16_MNEMONIC_JGE]:      {
                                            'opcode':       0x63,
                                            'params':       [ 4 ]
                                        },
        [global.S16_MNEMONIC_JLE]:      {
                                            'opcode':       0x64,
                                            'params':       [ 4 ]
                                        },
        [global.S16_MNEMONIC_JGT]:      {
                                            'opcode':       0x65,
                                            'params':       [ 4 ]
                                        },
        [global.S16_MNEMONIC_JLT]:      {
                                            'opcode':       0x66,
                                            'params':       [ 4 ]
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
//  Let's talk about-ing...opcode modifiers!
//
//  Are these a thing? I dunno, I made 'em up - these bits
//  are set in the opcode to specify how an operand is to
//  be handled.
//
//  All instructions are 16-bit, the lest-significant
//  byte stores the actual opcode, e.g mov32 is 0x0022 or
//  0000 0000 0010 0010 in binary.
//
//  If we find an instruction like:
//
//      mov32   AX, #BX
//
//  We are using two different addressing modes:
//
//      AX      - direct addressing mode
//      #BX     - indirect
//
//  In the case of AX - AX is a register but it's also
//  a location in RAM (the register buffer is stored
//  in RAM) so the reference AX translates to the
//  actual address of AX in the register buffer.
//
//  Thus, no modifier is required, we are saying "move
//  operand 2 into the address of AX", essentially,
//  we could just as easily hard-code the literal
//  address of the AX register (84), it's basically
//  the same thing:
//
//      mov32   84, #BX
//
//  In the case of #BX we're using the # modifier
//  which tells s16 that we're not interested in the
//  address of BX, we don't want to put the address
//  of BX in AX, but that BX contains an address
//  that points to the value we want, in this case
//  we set a modifier in the mov32 opcode:
//
//      0100 0000 0010 0010
//       |
//       +--- operand 2 is an indirect reference
//
//  If we want to move a literal value that isn't the
//  the address of anything we use the % modifier:
//
//      mov32   AX, %20
//      mov8    BX, #AX
//
//  Here we put the literal value 20 into the AX
//  register with a mov32, the opcode would be:
//
//      0000 0100 0010 0010
//            |
//            +--- Operand 2 is a literal value
//
//  In the following line we are essentially moving
//  the value at address 20 (whatever that may be)
//  into BX - the opcode would look like this:
//
//      0100 0000 0010 0000
//
//  This means to move a value from a register to
//  another location we use the % modifier:
//
//      AX      - Translates to the address of AX
//      %AX     - The value of AX
//      #AX     - The value at the address pointed to
//                by AX
//
//  So doing something like:
//
//      mov8    #AX, %BX
//
//  Would generate an opcode like:
//
//      1000 0100 0010 0000
//
//  Naturally, this system won't work for instructions
//  with more than 4 parameters - luckily, there are
//  none!
//
//  Anyway - enough rambling, the modifiers are defined
//  as 4-element arrays to made the modification for each
//  possible operand easier, see:
//
//      System/s16l/src/code/MaoCode.mjs
//
//  For more info.
//

    global.S16_MOD_INDIRECT             =
    [

        0b1000000000000000,
        0b0100000000000000,
        0b0010000000000000,
        0b0001000000000000

    ];

        global.S16_ADDRMODE_INDIRECT    = '#';


    global.S16_MOD_LITERAL              =
    [

        0b0000100000000000,
        0b0000010000000000,
        0b0000001000000000,
        0b0000000100000000

    ];

        global.S16_ADDRMODE_LITERAL     = '%'
