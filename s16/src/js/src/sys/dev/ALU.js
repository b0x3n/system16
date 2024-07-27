///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/ALU.js               //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The ALU module.                                      //
///////////////////////////////////////////////////////////
//
    export const    ALU                 = (

        messenger,
        ram,
        segment,
        get_reg,
        set_reg,
        is_writeable

    ) =>
    {


///////////////////////////////////////////////////////////
//  Mathematical operations.                             //
///////////////////////////////////////////////////////////
//                                                       //
//  Many of these methods work the same way.             //
//                                                       //
//  We typically have two operands, the left operand     //
//  and the right operand, e.g - the add16 instruction:  //
//                                                       //
//      add16 left_operand, right_operand;               //
//                                                       //
//  The left operand should always point to a location   //
//  or register, example:                                //
//                                                       //
//      add16 AX, 10                                     //
//                                                       //
//  AX is the destination address for the result to be   //
//  written to, AX should also contain the value we      //
//  want to add 10 to - we should assign that first:     //
//                                                       //
//      mov16 AX, 20;                                    //
//      add16 AX, 10;                                    //
//                                                       //
//  The result (30) will be stored in AX.                //
//                                                       //
//  We are not limited only to registers, we can use     //
//  labels that point to locations in memory, e.g:       //
//                                                       //
//      .section        rw                               //
//          m16         result = 20;                     //
//                                                       //
//      .section        code                             //
//          function    _addnums                         //
//              add16   result, 10;                      //
//          end                                          //
//                                                       //
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
//  __execute_add()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_add           = (

            ram_view,
            code_line

        ) =>
        {

            const   __dst               = code_line[2];
            const   __rval              = code_line[3];

            let     __lval              = false;

            if (code_line[0].mnemonic === window.S16_MNEMONIC_ADD8)
            {
                if (! is_writeable(ram_view, code_line[2]))
                    return `${code_line[0].mnemonic} - Attempt to write to read-only memory @ ${code_line[2]}`;
    
                __lval                  = ram_view.getUint8(__dst);
                ram_view.setUint8(__dst, (__lval + __rval));
            }
            if (code_line[0].mnemonic === window.S16_MNEMONIC_ADD16)
            {
                if (! is_writeable(ram_view, code_line[2]))
                    return `${code_line[0].mnemonic} - Attempt to write to read-only memory @ ${code_line[2]}`;
    
                __lval                  = ram_view.getUint16(__dst, window.little_endian);
                ram_view.setUint16(__dst, (__lval + __rval), window.little_endian);
            }
            if (code_line[0].mnemonic === window.S16_MNEMONIC_ADD32)
            {
                if (! is_writeable(ram_view, code_line[2]))
                    return `${code_line[0].mnemonic} - Attempt to write to read-only memory @ ${code_line[2]}`;
    
                __lval                  = ram_view.getUint32(__dst, window.little_endian);
                ram_view.setUint32(__dst, (__lval + __rval), window.little_endian);
            }

            if (__lval !== false)
            {
                messenger.verbose(`Executed ${code_line[0].mnemonic} @ ${__dst}: ${__lval} + ${__rval} = (${__lval + __rval})`);    
                __lval = true;
            }

            return __lval;

        };


///////////////////////////////////////////////////////////
//  __execute_sub()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_sub           = (

            ram_view,
            code_line

        ) =>
        {

            const   __dst               = code_line[2];
            const   __rval              = code_line[3];

            let     __lval              = false;

            // if (! is_writeable(code_line[2]))
            //     return `${code_line[0].mnemonic} - Attempt to write to read-only memory @ ${code_line[0]}`;

            if (code_line[0].mnemonic === window.S16_MNEMONIC_SUB8)
            {
                if (! is_writeable(ram_view, code_line[2]))
                    return `${code_line[0].mnemonic} - Attempt to write to read-only memory @ ${code_line[2]}`;
    
                __lval                  = ram_view.getUint8(__dst);
                ram_view.setUint8(__dst, (__lval - __rval));
            }
            if (code_line[0].mnemonic === window.S16_MNEMONIC_SUB16)
            {
                if (! is_writeable(ram_view, code_line[2]))
                    return `${code_line[0].mnemonic} - Attempt to write to read-only memory @ ${code_line[2]}`;
    
                __lval                  = ram_view.getUint16(__dst, window.little_endian);
                ram_view.setUint16(__dst, (__lval - __rval), window.little_endian);
            }
            if (code_line[0].mnemonic === window.S16_MNEMONIC_SUB32)
            {
                if (! is_writeable(ram_view, code_line[2]))
                    return `${code_line[0].mnemonic} - Attempt to write to read-only memory @ ${code_line[2]}`;
    
                __lval                  = ram_view.getUint32(__dst, window.little_endian);
                ram_view.setUint32(__dst, (__lval - __rval), window.little_endian);
            }

            if (__lval !== false)
            {
                messenger.verbose(`Executed ${code_line[0].mnemonic} @ ${__dst}: ${__lval} - ${__rval} = (${__lval - __rval})`);    
                __lval = true;
            }

            return __lval;

        };


///////////////////////////////////////////////////////////
//  Logical operations.                                  //
///////////////////////////////////////////////////////////
//                                                       //
//  Logical operations will make comparisons and set     //
//  or unset bits in the FL (flags) register based on    //
//  the outcome of the comparison.                       //
//                                                       //
//  The frist 3 bits of flags are used to indicate the   //
//  the results of any logical evaluation:               //
//                                                       //
//      FL          0  0  0  0  0  0  0  0               //
//                  |  |  |                              //
//      Less than --+  |  +-- Greater than               //
//                     |                                 //
//                  Equal to                             //
//                                                       //
//  If we do a comparison, e.g:                          //
//                                                       //
//      cmp32   100, 200;                                //
//                                                       //
//  The appropriate flags will be set to describe the    //
//  outcome. We're asking to compare the right value     //
//  against the left - 200 is greater than 100 so the    //
//  first two bits of FL will be 0 and the third bit     //
//  will be 1:                                           //
//                                                       //
//      FL          0  0  1  0  0  0  0  0               //
//                                                       //
//  We can then make choices based on this result, for   //
//  example, we can do a jne (jump if not equal) to      //
//  execute a specific block of code:                    //
//                                                       //
//      cmp32   100, 200;                                //
//      jne     __address_label;                         //
//                                                       //
//  Or we could use jgt (jump if grater than). The jump  //
//  instructions will check which bits are set in FL     //
//  and act accordingly.                                 //
//                                                       //
//    Instruction    Equivalent    Flags                 //
//                                                       //
//      je             ==            0 1 0 0 0 0 0 0     //
//      jne            !=            0 0 0 0 0 0 0 0     //
//      jlt            <             1 0 0 0 0 0 0 0     //
//      jgt            >             0 0 1 0 0 0 0 0     //
//      jle            <=            1 1 0 0 0 0 0 0     //
//      jge            >=            0 1 1 0 0 0 0 0     //
//                                                       //
//  The above table shows what flags/bits need to be     //
//  set for a particular jump instruction to work.       //
//                                                       //
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
//  __execute_cmp()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_cmp           = (

            ram_view,
            code_line

        ) =>
        {

            const   __lval              = code_line[2];
            const   __rval              = code_line[3];

            let     __flags             = get_reg('FL', segment);

            if (
                code_line[0].mnemonic !== window.S16_MNEMONIC_CMP8     &&
                code_line[0].mnemonic !== window.S16_MNEMONIC_CMP16    &&
                code_line[0].mnemonic !== window.S16_MNEMONIC_CMP32
            )
                return false;

    //  Unset the first 3 bits in flags.2
    //
            __flags = __flags & (~0b11100000);

    //  Evaluate...
    //
            if (__rval === __lval)
                __flags = __flags |= 0b01000000;
            if (__rval < __lval)
                __flags = __flags |= 0b10000000;
            if (__rval > __lval)
                __flags = __flags |= 0b00100000;

    //  Set the flags in the FL register.
            set_reg('FL', __flags, segment);

            messenger.verbose(`Executed ${code_line[0].mnemonic} on ${__lval}, ${__rval} - FLAGS = ${__flags.toString(2)}`)

            return true;

        };


///////////////////////////////////////////////////////////
//  __execute_jmp()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_jmp           = (

            ram_view,
            code_line

        ) =>
        {

            const   __addr              = code_line[2];
            const   __flags             = get_reg('FL');

            let     __outcome           = "false";

            if (
                code_line[0].mnemonic !== window.S16_MNEMONIC_JMP   &&
                code_line[0].mnemonic !== window.S16_MNEMONIC_JE    &&
                code_line[0].mnemonic !== window.S16_MNEMONIC_JNE   &&
                code_line[0].mnemonic !== window.S16_MENMONIC_JLT   &&
                code_line[0].mnemonic !== window.S16_MNEMONIC_JLE   &&
                code_line[0].mnemonic !== window.S16_MENMONIC_JGT   &&
                code_line[0].mnemonic !== window.S16_MNEMONIC_JGE
            )
                return false;

            // if (__addr < window.S16_HEADER_CODE || __addr >= window.S16_HEADER_EXESIZE)
            //     return `${code_line[0].mnemonic} - Attempt to execute code at ${code_line[2]}`;
    
            if (code_line[0].mnemonic === window.S16_MNEMONIC_JMP)
                __outcome = "true";
            else
            {
                if (code_line[0].mnemonic === window.S16_MNEMONIC_JE && (__flags & 0b01000000))
                    __outcome = "true";
                if (code_line[0].mnemonic === window.S16_MNEMONIC_JNE && ! (__flags & 0b01000000))
                    __outcome = "true";
                if (code_line[0].mnemonic === window.S16_MNEMONIC_JLT && (__flags & 0b10000000))
                    __outcome = "true";
                if (code_line[0].mnemonic === window.S16_MNEMONIC_JLE && (__flags & 0b11000000))
                    __outcome = "true";
                if (code_line[0].mnemonic === window.S16_MNEMONIC_JGT && (__flags & 0b00100000))
                    __outcome = "true";
                if (code_line[0].mnemonic === window.S16_MNEMONIC_JGE && (__flags & 0b01100000))
                    __outcome = "true";
            }

            if (__outcome === "true")
                set_reg('IP', __addr);

            messenger.verbose(`Executed ${code_line[0].mnemonic} - evaluated as ${__outcome}, IP = ${get_reg('IP')}`);

            return true;

        };
        

///////////////////////////////////////////////////////////
//  Bitwise operations.                                  //
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
//  _execute_line()                                      //
///////////////////////////////////////////////////////////
//
        const   _execute_line           = (

            code_line,
            segment_id                  = false

        ) =>
        {

            const   __ram_view          = new DataView(ram[segment]);
            let     __return_value      = false;

            if (code_line[0] === 0)
                return false;
            
            if (segment_id !== false)
                segment = segment_id;


///////////////////////////////////////////////////////////
//  Mathematical operations.
//

            __return_value              = __execute_add(__ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

            __return_value              = __execute_sub(__ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;


///////////////////////////////////////////////////////////
//  Logical operations.
//

            __return_value              = __execute_cmp(__ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

            __return_value              = __execute_jmp(__ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;


///////////////////////////////////////////////////////////
//  Bitwise operations.
//


            return __return_value;

        };


        return {

            execute_line:               _execute_line

        };

    };

