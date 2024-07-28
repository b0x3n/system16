///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/CPU.js               //
///////////////////////////////////////////////////////////
//
//
//

    import * as GlobalTimer from        "./Timer.js";
    

    import { ALU } from                 "./ALU.js";


    const   S16_DEV_MAX                 = 8;


///////////////////////////////////////////////////////////
//  These bits can be set in the FL register to halt
//  or pause the system.
//
    const   S16_SYSTEM_HALT             = 0b00001000;
    const   S16_SYSTEM_WAIT             = 0b00000100;


///////////////////////////////////////////////////////////
//  The CPU module.                                      //
///////////////////////////////////////////////////////////
//
    export const    CPU                 = (

        objConfigure,
        objDevices,
        messenger,
        ram

    ) =>
    {


        const   __ram                   = objDevices[0].ram;


        const   __display               = objDevices[1];


        let     __segment               = 0;


        const   __opcode_table          = {};

    
        let     __call_depth            = 1;
        let     __int_handler           = false;


        let     __clock_speed           = .5;
        let     __clock_timer_id        = false;

        let     __alu                   = false;
        
        let     __message               = false;


///////////////////////////////////////////////////////////
//  __set_reg()                                          //
///////////////////////////////////////////////////////////
//
        const   __set_reg               = (

            reg,
            value,
            segment                     = 0

        ) =>
        {

            const   __ram_view          = new DataView(__ram[segment]);

            if (reg === 'RT' || reg === 'FL' || reg === 'OI' || reg === 'II')
                __ram_view.setUint8(window.S16_REG[reg], value);
            else
                __ram_view.setUint32(window.S16_REG[reg], value, window.little_endian);

        };


///////////////////////////////////////////////////////////
//  __get_reg()                                          //
///////////////////////////////////////////////////////////
//
        const   __get_reg               = (

            reg,
            segment                     = 0

        ) =>
        {

            const   __ram_view          = new DataView(__ram[segment]);

            if (reg === 'RT' || reg === 'FL' || reg === 'OI' || reg === 'II')
                return __ram_view.getUint8(window.S16_REG[reg]);
            else
                return __ram_view.getUint32(window.S16_REG[reg], window.little_endian);

        };


///////////////////////////////////////////////////////////
//  __reg_writeable()                                    //
///////////////////////////////////////////////////////////
//
        const   __reg_writeable         = reg =>
        {

            if (
                reg === window.S16_REG['CS']    ||
                reg === window.S16_REG['DS']    ||
                reg === window.S16_REG['SS']    ||
                reg === window.S16_REG['IP']    ||
                reg === window.S16_REG['SP']    ||
                reg === window.S16_REG['HB']    ||
                reg === window.S16_REG['HP']    ||
                reg === window.S16_REG['FL']
            )
            {
                console.log(`Register ${reg} is not writeable`);
                return false;
            }

            return true;

        };


///////////////////////////////////////////////////////////
//  __is_writeable()                                     //
///////////////////////////////////////////////////////////
//
        const   __is_writeable          = (

            ram_view,
            operand

        ) =>
        {

            const   __rw_offset         = ram_view.getUint32(window.S16_HEADER_RW, window.little_endian);
            const   __code_offset       = ram_view.getUint32(window.S16_HEADER_CODE, window.little_endian);
            const   __exe_size          = ram_view.getUint32(window.S16_HEADER_EXESIZE, window.little_endian);

    //  If it's a register (these are stored in RAM
    //  between the header and RO sections) then we
    //  need to check which register is being written
    //  to - some cannot be changed directly such as
    //  the CS, DS and SS registers.
    //
            if (operand >= window.S16_REG['CS'] && operand <= window.S16_REG['FX'])
            {
                if (__reg_writeable(operand))
                    return true;

                return false;
            }
    
    //  We can write to the rw section and between the
    //  code section and stack - anywhere else is
    //  read-only.
    //
            if (
                operand < __rw_offset       ||
                operand >= __code_offset
            )
                return false;
            
            return true;

        };


///////////////////////////////////////////////////////////
//  __build_vector_table()                               //
///////////////////////////////////////////////////////////
//
        const   __build_vector_table    = () =>
        {

            const   __ram_view          = new DataView(__ram[__segment]);

            for (let byte_no = 0; byte_no < S16_DEV_MAX; byte_no++)
            {
                __ram_view.setUint8((window.S16_HEADER_VTABLE + byte_no), 0);
                __ram_view.setUint32(((window.S16_HEADER_VTABLE + S16_DEV_MAX + (byte_no * 4))), 0, window.little_endian);
            }

        };


///////////////////////////////////////////////////////////
//  __vector_lookup()                                    //
///////////////////////////////////////////////////////////
//
        const   __vector_lookup         = (
        
            ram_view,
            interrupt
        
        ) =>
        {

    //  We search the first 8 bytes of the table looking
    //  for the matching interrupt handler.
    //
            for (let byte_no = 0; byte_no < S16_DEV_MAX; byte_no++)
            {
                const   __int           = ram_view.getUint8(window.S16_HEADER_VTABLE + byte_no);

                if (__int === interrupt)
                {
                    return {
                        'offset': ram_view.getUint32((window.S16_HEADER_VTABLE + S16_DEV_MAX + (byte_no * 4)), window.little_endian),
                        'index': byte_no
                    };
                }
            }

            return `Error - unknown interrupt '${interrupt}'`;

        };


///////////////////////////////////////////////////////////
//  __execute_dev()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_dev           = (

            ram_view,
            code_line

        ) =>
        {

            if (code_line[0].mnemonic !== global.S16_MNEMONIC_DEV)
                return false;

            const   __intHandler        = __vector_lookup(
                ram_view,
                code_line[3]
            );

            if (typeof __intHandler !== 'string')
                return `Error - interrupt ID ${code_line[2]} previously assigned to device index${__intHandler.index}, offset=${__intHandler.offset}`;

            if (ram_view.getUint32((window.S16_HEADER_VTABLE + S16_DEV_MAX + (code_line[2] * 4)), window.little_endian) !== 0)
                return `Error - Device ${code_line[2]} previously assigned to interrupt=${ram_view.getUint8(window.S16_HEADER_VTABLE + code_line[2])}, offset=${ram_view.getUint32((window.S16_HEADER_VTABLE + S16_DEV_MAX + (code_line[2] * 4)), window.little_endian)}`;

            ram_view.setUint8((window.S16_HEADER_VTABLE + code_line[2]), code_line[3]);
            ram_view.setUint32((window.S16_HEADER_VTABLE + S16_DEV_MAX + (code_line[2] * 4)), code_line[4], window.little_endian);
            
            messenger.verbose(` Set handler in vector table: index=${ram_view.getUint8(window.S16_HEADER_VTABLE + code_line[2])}, offset=${ram_view.getUint32((window.S16_HEADER_VTABLE + S16_DEV_MAX + (code_line[2] * 4)), window.little_endian)}`)

            return true;

        };


///////////////////////////////////////////////////////////
//  __execute_int()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_int           = (
            
            ram_view,
            code_line
        
        ) =>
        {

            const   __operand           = code_line[2];

            let     __return_value      = false;

            if (code_line[0].mnemonic === window.S16_MNEMONIC_INT)
            {
    //  The operand tells us what device we're referring
    //  to - it has to be indexed via the vector table
    //
                let     __intHandler    = __vector_lookup(
                    ram_view,
                    code_line[2]
                );

                if (typeof __intHandler === 'string')
                    return __intHandler;

    //  The index of the interrupt in the vector table
    //  is used to index the actual device module in
    //  objDevices[]
    //
                __int_handler = __intHandler.index;

    //  This is the address of the device handler to
    //  be passed into the __execute_function() method.
    //
    //  The device handler function will run first, then
    //  the device module will be invoked on return.
    //
                const   __dev_handler = __intHandler.offset;

                if (__dev_handler === 0 || __int_handler === 0)
                    return `Error - interrupt '${code_line[2]}' has no handler`;

                messenger.verbose(`Executing interrupt ${code_line[2]} (vector ID ${__dev_handler})`);

                return __execute_function(
                    ram_view,
                   __dev_handler
                );
            }

            return __return_value;

        };


///////////////////////////////////////////////////////////
//  __execute_function()                                 //
///////////////////////////////////////////////////////////
//
        const   __execute_function      = (

            ram_view,
            code_addr

        ) =>
        {

            const   __exe_size          = ram_view.getUint32(window.S16_HEADER_EXESIZE, window.little_endian);

            const   __ip                = __get_reg('IP', __segment);
            let     __sp                = __get_reg('SP', __segment);

            if ((__sp - 4) < __exe_size)
                return `Call error - stack full`;

    //  Push the return address onto the stack.
    //
            ram_view.setUint32(__sp, __ip, window.little_endian);

            __sp -= 4;

            __set_reg('SP', __sp);
            __set_reg('IP', code_addr, __segment);

            __call_depth++;

            messenger.verbose(`>> ${ram_view.getUint32(__sp + 4, window.little_endian)} <<Executed call instruction to address ${code_addr}, return address ${__ip}, call depth = ${__call_depth}, BP == ${__get_reg('BP').toString(16)}`);

            return true;

        };


///////////////////////////////////////////////////////////
//  __execute_call()                                     //
///////////////////////////////////////////////////////////
//
        const   __execute_call          = (

            ram_view,
            code_line

        ) =>
        {

            if (code_line[0].mnemonic !== 'call')
                return false;

    //  The operand should point to a memory location
    //  >= than the code offset.
    //
            if (code_line[2] < ram_view.getUint32((window.S16_HEADER_CODE), window.little_endian))
                return `Call error - can't execute data or header sections`;

            return __execute_function(
                ram_view,
                code_line[2]
            );

        };


///////////////////////////////////////////////////////////
//  __function_return()                                  //
///////////////////////////////////////////////////////////
//
        const   __function_return       = (

            ram_view,
            code_line

        ) =>
        {

            let     __sp                = __get_reg('SP');

            if (__int_handler)
                objDevices[__int_handler].interrupt(ram, __segment);

    //  Pop the return address from the stack into the
    //  IP register.
    //
            if ((__sp + 4) > 0xFFFF && __call_depth > 1)
                return `STACK`;
            else if (__call_depth > 1)
            {
                __sp += 4;
                __set_reg('SP', __sp);
                __set_reg('IP', ram_view.getUint32(__sp, window.little_endian));
            }    

            messenger.verbose(`Executed return to ${__get_reg('IP')}`);

            __call_depth--;

            if (__int_handler)
            {
                __int_handler = false;
                return true;
            }

            return false;

        };


///////////////////////////////////////////////////////////
//  __execute_return()                                   //
///////////////////////////////////////////////////////////
//
        const   __execute_return        = (

            ram_view,
            code_line

        ) =>
        {

            if (typeof code_line === 'undefined')
                return __function_return(ram_view);
            
            if (code_line[0].mnemonic !== window.S16_MNEMONIC_RET)
                return false;

            __set_reg('RT', code_line[2], __segment);

            return __function_return(ram_view);

        };


///////////////////////////////////////////////////////////
//  __execute_mov()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_mov           = (

            ram_view,
            code_line

        ) =>
        {

            let     __return_value      = false;

            if (code_line[0].mnemonic === window.S16_MNEMONIC_MOV8)
            {
                if (! __is_writeable(ram_view, code_line[2]))
                    return `Attempt to write to a read-only location: ${__get_reg('IP')} ${code_line[2]}, ${code_line[3]}`;
        
                ram_view.setUint8(code_line[2], code_line[3]);
                __return_value = true;
            }
            if (code_line[0].mnemonic === window.S16_MNEMONIC_MOV16)
            {
                if (! __is_writeable(ram_view, code_line[2]))
                    return `Attempt to write to a read-only location: ${__get_reg('IP')} ${code_line[2]}, ${code_line[3]}`;
        
                ram_view.setUint16(code_line[2], code_line[3], window.little_endian);
                __return_value = true;
            }
            if (code_line[0].mnemonic === window.S16_MNEMONIC_MOV32)
            {
                if (! __is_writeable(ram_view, code_line[2]))
                    return `Attempt to write to a read-only location: ${__get_reg('IP')} ${code_line[2]}, ${code_line[3]}`;
        
                ram_view.setUint32(code_line[2], code_line[3], window.little_endian);
                __return_value = true;
            }

            if (__return_value)
                messenger.verbose(`Executed ${code_line[0].mnemonic}`);

            return __return_value;

        };


///////////////////////////////////////////////////////////
//  __execute_push()                                     //
///////////////////////////////////////////////////////////
//
        const   __execute_push          = (

            ram_view,
            code_line

        ) =>
        {

            const   __exe_size          = ram_view.getUint32(window.S16_HEADER_EXESIZE, window.little_endian);

            let     __sp                = __get_reg('SP', __segment);
            let     __mnemonic          = code_line[0].mnemonic;

            messenger.verbose(` Executed ${__mnemonic} (${__sp} = ${code_line[2]})`)

            if (__sp < __exe_size)
                return `Call error - stack full`;
        
            if (__mnemonic === window.S16_MNEMONIC_PUSH8)
                ram_view.setUint8(__sp, code_line[2]);
            if (__mnemonic === window.S16_MNEMONIC_PUSH16)
                ram_view.setUint16(__sp, code_line[2], window.little_endian);
            if (__mnemonic === window.S16_MNEMONIC_PUSH32)
                ram_view.setUint32(__sp, code_line[2], window.little_endian);

            if (__mnemonic === window.S16_MNEMONIC_PUSH8)
                __sp -= 1;
            else if (__mnemonic === window.S16_MNEMONIC_PUSH16)
                __sp -= 2;
            else if (__mnemonic === window.S16_MNEMONIC_PUSH32)
                __sp -= 4;    
            else
                return false;

            __set_reg('SP', __sp, __segment);

            return true;

        };


///////////////////////////////////////////////////////////
//  __execute_pop()                                      //
///////////////////////////////////////////////////////////
//
        const   __execute_pop           = (

            ram_view,
            code_line

        ) =>
        {

            const   __exe_size          = ram_view.getUint32(window.S16_HEADER_EXESIZE, window.little_endian);

            let     __sp                = __get_reg('SP', __segment);
            let     __mnemonic          = code_line[0].mnemonic;
            
            if (__mnemonic === window.S16_MNEMONIC_POP8)
                __sp += 1;
            if (__mnemonic === window.S16_MNEMONIC_POP16)
                __sp += 2;
            if (__mnemonic === window.S16_MNEMONIC_POP32)
                __sp += 4;    

            if (__sp > 0xFFFF)
                return `Cannot pop - bottom of stack reached`;

            if (__mnemonic === window.S16_MNEMONIC_POP8)
            {
                if (! __is_writeable(ram_view, code_line[2]))
                    return `Attempt to write to a read-only location: ${__get_reg('IP')} ${code_line[2]}, ${code_line[3]}`;
        
                ram_view.setUint8(code_line[2], ram_view.getUint16(__sp, window.little_endian));
            }
            else if (__mnemonic === window.S16_MNEMONIC_POP16)
            {
                if (! __is_writeable(ram_view, code_line[2]))
                    return `Attempt to write to a read-only location: ${__get_reg('IP')} ${code_line[2]}, ${code_line[3]}`;
        
                ram_view.setUint16(code_line[2], ram_view.getUint16(__sp, window.little_endian), window.little_endian);
            }    
            else if (__mnemonic === window.S16_MNEMONIC_POP32)
            {
                if (! __is_writeable(ram_view, code_line[2]))
                    return `Attempt to write to a read-only location: ${__get_reg('IP')} ${code_line[2]}, ${code_line[3]}`;
        
                ram_view.setUint32(code_line[2], ram_view.getUint32(__sp, window.little_endian), window.little_endian);
            }
            else
                return false;

            __set_reg('SP', __sp, __segment);

            messenger.verbose(`Executed ${__mnemonic} (${__sp.toString(2)} = ${code_line[2].toString(2)})`)

            return true;

        };

          
///////////////////////////////////////////////////////////
//  __execute_line()                                     //
///////////////////////////////////////////////////////////
//
        const   __execute_line          = (
        
            ram_view,
            code_line
        
        ) =>
        {

            let     __return_value      = true;

    //  What instruction do we have? All of the calls
    //  made here work in the same way - we catch the
    //  __return_value - if it's true then we know
    //  the operation was performed successfully.
    //
    //  If it returns a string thee was an error.
    //
    //  If it returns false it's not the opcode we're
    //  looking for. Example, if code_line contains a jmp
    //  instruction then the call to __alu.execute_line()
    //  should return true because the jmp instruction is
    //  part of the ALU module. If __alu returns a string
    //  then we know it's the right call but that there
    //  was an error.
    //
    //  If it's a mov instruction the call to the __alu
    //  will return false because mov isn't part of that
    //  module.
    //
    //  In short - if any call returns true or a string
    //  we can bail and return that true or string value
    //  to the caller.
    //
    //  If any call returns false we know it isn't what
    //  we're looking for so we try the next.
    //
            __return_value              = __alu.execute_line(code_line, __segment);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

    //  Interrupt?
    //
            __return_value              = __execute_int(ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

    //  Is it a call instruction?
    //
            __return_value              = __execute_call(ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

    //  Is it a return?
    //
            __return_value              = __execute_return(ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

    //  Is it a dev instruction? This allows us to assign
    //  handlers for device interrupts.
    //
            __return_value              = __execute_dev(ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

    //  Is it a push instruction?
    //
            __return_value              = __execute_push(ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

    //  Is it a pop instruction?
    //
            __return_value              = __execute_pop(ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

    //  Is it a mov instruction?
    //
            __return_value              = __execute_mov(ram_view, code_line);

            if (__return_value === true || typeof __return_value === 'string')
                return __return_value;

            return __return_value;

        };


///////////////////////////////////////////////////////////
//  __fetch_line()                                       //
///////////////////////////////////////////////////////////
//
        const   __fetch_line            = () =>
        {

            const   __flags             = __get_reg('FL');

            if (__call_depth <= 0)
                return false;

    //  We loop continuously until we find the end of
    //  the function (opcode will be 0).
    //
            const   __ram_view      = new DataView(__ram[__segment]);

    //  Fetch the next instruction/opcode (2 bytes).
    //
            const   __ip            = __get_reg('IP', __segment);
            
    //  Get the entire instruction (2 bytes) and the
    //  individual components (modifier & opcode).
    //
            const   __instruction   = __ram_view.getUint16(__ip, window.little_endian);
            let     __modifier      = __ram_view.getUint8(__ip);
            let     __opcode        = __ram_view.getUint8(__ip + 1);

            if (window.little_endian)
            {
                __modifier = __opcode;
                __opcode = __ram_view.getUint8(__ip);
            }

            if (__flags & S16_SYSTEM_WAIT)
                    return true;
            
            let     __line_size     = 2;

            if (__opcode === 0)
            {
                __call_depth--;
                return false;
            }

    //  Get the params table for this instruction.
    //
            const   __opcode_id     = `__op_${__opcode}`;
            const   __objMnemonic   = window.S16_OPCODES[__opcode_id];
            let     __params        = __objMnemonic['params'];

            let     __operand;
            let     __operands      = [];
            
    //  Cycle through the __params table - the value
    //  of each element in __params tells us the
    //  size the operand should be.
    //
    //  Any parameters will be modified if necessary
    //  then pushed to the __operands array for
    //  the execution.
    //
            for (let param_no = 0; param_no < __params.length; param_no++)
            {

                const   __param     = __params[param_no];

                if (__param === 1)
                    __operand = __ram_view.getUint8((__ip + __line_size));
                else if (__param === 2)
                    __operand = __ram_view.getUint16((__ip + __line_size), window.little_endian);
                else
                    __operand = __ram_view.getUint32((__ip + __line_size), window.little_endian);

    //  Any modifiers set?
    //
                if (__modifier)
                {

                    if (
                        (__modifier & window.S16_MOD_LITERAL[param_no]) ||
                        (__modifier & window.S16_MOD_INDIRECT[param_no])
                    )
                    {
                        if (__param === 1)
                            __operand = __ram_view.getUint8(__operand);
                        if (__param === 2)
                            __operand = __ram_view.getUint16(__operand, window.little_endian);
                        if (__param === 4)
                            __operand = __ram_view.getUint32(__operand, window.little_endian);
                    }

                    if (__modifier & window.S16_MOD_INDIRECT[param_no])
                    {
                        if (__param === 1)
                            __operand = __ram_view.getUint8(__operand);
                        if (__param === 2)
                            __operand = __ram_view.getUint16(__operand, window.little_endian);
                        if (__param === 4)
                            __operand = __ram_view.getUint32(__operand, window.little_endian);
                    }
                }

                __operands.push(__operand);
                __line_size += __param;

            }

            __set_reg('IP', (__ip + __line_size), __segment);

            messenger.verbose(` ${__opcode} (${__objMnemonic.mnemonic}) ${__operands} @ offset ${__ip}`);
            messenger.verbose(` IP = ${__get_reg('IP').toString(16)}, RT = ${__get_reg('RT').toString(16)}, FLAGS = ${__get_reg('FL').toString(2)}, BP = ${__get_reg('BP').toString(16)}, SP = ${__get_reg('SP').toString(16)}`);

            return [ __objMnemonic, __opcode, ...__operands ];

        };


///////////////////////////////////////////////////////////
//  __initialise_registers()                             //
///////////////////////////////////////////////////////////
//
        const   __initialise_registers  = ram_view =>
        {
            
            messenger.verbose(` Initialising registers...`);

    //  Set up the registers for execution.
    //
            __set_reg('BP', 0xFFFC, 0);
            __set_reg('IP', ram_view.getUint32(window.S16_HEADER_MAIN, window.little_endian), 0);
            __set_reg('SP', 0xFFFC, 0);

            __set_reg('CS', 0, 0);
            __set_reg('DS', 0, 0);
            __set_reg('SS', 0, 0);

            __set_reg('HB', ram_view.getUint32(window.S16_HEADER_EXESIZE, window.little_endian), 0);
            __set_reg('HP', ram_view.getUint32(window.S16_HEADER_EXESIZE, window.little_endian), 0);

            __set_reg('IO', 0, 0);
            __set_reg('II', 0, 0);

            __set_reg('RT', 0, 0);
            __set_reg('FL', 0, 0);

            __set_reg('AX', 0, 0);
            __set_reg('BX', 0, 0);
            __set_reg('CX', 0, 0);
            __set_reg('DX', 0, 0);
            __set_reg('EX', 0, 0);
            __set_reg('FX', 0, 0);

            messenger.verbose(` Done`);
            messenger.verbose(` Offset of _main: ${__get_reg('IP')}`);

        };


///////////////////////////////////////////////////////////
//  __fetch_and_execute()                                //
///////////////////////////////////////////////////////////
//
        const   __fetch_and_execute     = ram_view =>
        {

            let     __code_line;
            let     __return_value;
    
    //  Grab the next line of code along with parameters,
    //  the __fetch_line() method will return an array
    //  containing our instruction & operands.
    //
            __code_line = __fetch_line();

            if (__code_line === true)
                return true;

    //  False is returned when we come to the end of
    //  the current function.
    //
            if (__code_line === false)
            {
                if (__call_depth <= 0)
                {
    //  _main sits at depth 0 - so if we land here
    //  that means the program terminated normally.
    //
                    window.clearInterval(__clock_timer_id);
                    __clock_timer_id = false;

                    return false;
                }

                return true;
            }

    //  Execute the fetched line.
    //
            __return_value = __execute_line(
                ram_view,
                __code_line
            );

            if (typeof __return_value === 'string')
            {
    //  A returned string is an error message - we bail
    //  and disable execution.
    //
                window.clearInterval(__clock_timer_id);
                __clock_timer_id = false;

                return __return_value;
            }

            return true;

        };


///////////////////////////////////////////////////////////
//  __run()                                              //
///////////////////////////////////////////////////////////
//
        const   _run                    = segment =>
        {

            const   __ram_view          = new DataView(__ram[__segment]);

            __segment = segment;

            __initialise_registers(__ram_view);
            __build_vector_table();

            objDevices[2].initialise(
                __ram_view,
                __get_reg,
                __set_reg
            );

            if (
                objConfigure.hasOwnProperty('debug') && 
                objConfigure['debug'] === 'step'
            )
            {

    ///////////////////////////////////////////////////////
    //  Run in debug mode - haven't tested this much and
    //  made some changes since - might not work...
    //
    //  Was implemented early on so I could step through
    //  and execute code one line at a time.
    //
    //  Will come back to this.
    //
                let __running = true;

                messenger.verbose(` Running in debug (step) mode - click to continue`);

                $(window).on('click', () => {
                    if (__get_reg('FL') & S16_SYSTEM_HALT)
                        return;

                    if (__running === false)
                    {
                        __set_reg('IP', __ram_view.getUint32(window.S16_HEADER_MAIN), __segment, window.little_endian);
                        __running = true;
                    }

                    const   __code_line = __fetch_line();

                    if (__code_line === false)
                    {
                        if (__call_depth <= 0)
                        {
                            __running = false;
                            return messenger.verbose(` Program exited normally (return value ${__get_reg('RT')})\n Click to reset\n`);
                        }
                    }

                    const   __return_value = __execute_line(
                        __ram_view,
                        __code_line
                    );

                    if (typeof __return_value === 'string')
                        return messenger.error(__return_value);

                    messenger.verbose(` Click to continue`);
                });
            }
            else
            {
    //  Fetch-execute loop - continues until __code_line
    //  returns false.
    //
                __clock_timer_id = window.setInterval(() => {

                    let     __flags         = __get_reg('FL');

                    if (__flags & S16_SYSTEM_HALT)
                    {
                        window._clearInterval(__clock_timer_id);
                        return;
                    }

                    const   __return_value = __fetch_and_execute(__ram_view);

                    if (typeof __return_value === 'string')
                    {
                        __flags |= S16_SYSTEM_HALT;
                        __set_reg('FL', __flags);
                        messenger.error(__return_value);
                        return;
                    }

                    if (! __return_value)
                    {
                        (__call_depth > 0) ?
                            messenger.verbose(`Function exited normally (RT=${__get_reg('RT')})`)
                        :
                            messenger.verbose(`System halted normally (RT=${__get_reg('RT')})`);

                        return;
                    }
                    
                }, __clock_speed);

            }

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            __alu                       = ALU(
                messenger,
                __ram,
                __segment,
                __get_reg,
                __set_reg,
                __is_writeable
            );

        };


        __initialise();


        return {

            run:                        _run

        };

    };

