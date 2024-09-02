///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/s16Cpu.js               //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  Import any required utilities here.                  //
///////////////////////////////////////////////////////////
//
    import { ConsoleView } from         "./../../utils/ConsoleView.js";


///////////////////////////////////////////////////////////
//  The s16Cpu module                                    //
///////////////////////////////////////////////////////////
//
    export const    s16Cpu              = (

        s16Ram,
        s16Devices,
        s16Process

    ) =>
    {


    ///////////////////////////////////////////////////////
    //  This is used to drop information in the console
    //  only if be_verbose is enabled in objConfigure -
    //  see:
    //
    //      System16/s16/src/js/s16/utils/ConsoleView.js
    //
        let     __console;


    ///////////////////////////////////////////////////////
    //  All instruction modules are pre-loaded and stored
    //  as an object, a reference to the instruction set
    //  is in the setProcess object - we'll create a
    //  reference to that array for easy access.
    //
        const   __instructions          = s16Process.instructions;


    ///////////////////////////////////////////////////////
    //  Basic setup - create local pointers to segment
    //  and offset addresses of all sections as specified
    //  in the header - this just keeps things nice and
    //  simple.
    //
        const   __ro_segment            = s16Process.ro_segment;
        const   __rw_segment            = s16Process.rw_segment;
        const   __code_segment          = s16Process.code_segment;
        const   __stack_segment         = s16Process.stack_segment;

        const   __ro_offset             = s16Process.exe_header.ro_offset;
        const   __rw_offset             = s16Process.exe_header.rw_offset;
        const   __code_offset           = s16Process.exe_header.code_offset;


    ///////////////////////////////////////////////////////
    //  The core controller adds some I/O methods to
    //  the s16Process object.
    //
        const   __read_ram              = s16Process.read_ram;
        const   __write_ram             = s16Process.write_ram;

        const   __get_reg               = s16Process.get_reg;
        const   __set_reg               = s16Process.set_reg;


    ///////////////////////////////////////////////////////
    //  Numeric output format - can be 2 (binary), 10
    //  (decimal) or 16 (hex).
    //
        let     __format                = window.__s16Defs.S16_NUMBER_FORMAT;


///////////////////////////////////////////////////////////
//  __resolve_segment()                                  //
///////////////////////////////////////////////////////////
//
        const   __resolve_segment       = address =>
        {

            if (address >= __ro_offset && address < __rw_offset)
                return __ro_segment;
            if (address >= __rw_offset && address < __code_offset)
                return __rw_segment;
            
            return __code_segment;

        };


///////////////////////////////////////////////////////////
//  __fetch_next_line()                                  //
///////////////////////////////////////////////////////////
//
        const   __fetch_next_line       = () =>
        {
            
            const   __ip                = __get_reg(__code_segment, 'IP');

            let     __modifiers         = __read_ram(__code_segment, __ip, 1);
            let     __opcode            = __read_ram(__code_segment, (__ip + 1), 1);

            const   __modifiers_swap    = __modifiers;

            if (window.__s16Sys.little_endian)
            {
                __modifiers             = __opcode;
                __opcode                = __modifiers_swap
            }

    //  The window.S16_OPCODES object is used to lookup
    //  the instruction - it returns information about
    //  each instruction, see:
    //
    //      System16/s16/src/js/s16/defs/s16Mnemonics.js
    //
            //const   __opcode_info       = window.S16_OPCODES[`__op_${__opcode.toString()}`];

            // const   __opcode_info
            // if (typeof __opcode_info === 'undefined')
            //     return window.__s16_error(`Uknown opcode ${__opcode.toString(__format)} at offset ${__ip.toString(__format)} - can't continue`);

    //  Attempt to lookup the opcode in the __instructions
    //  set:
    //
            const   __opcode_key        = `__in_${__opcode.toString()}`;

            if (! __instructions.hasOwnProperty(__opcode_key))
                return window.__s16_error(`Uknown opcode ${__opcode.toString(__format)} at offset ${__ip.toString(__format)} - can't continue`);

            const   __instruction       = __instructions[__opcode_key];

    ///////////////////////////////////////////////////////
    //  The _code_line array will be returned in an
    //  object along with the __instruction.method
    //  required to actually execute it.
    //
    //  _code_line contains not only the instruction and
    //  operands but also some meta-data for a debugger
    //  if one is listening.
    //
    //  The first 6 entries in the _code_line are:
    //
    //      _code_line[0] = IP (instruction pointer).
    //      _code_line[1] = modifiers.
    //      _code_line[2] = size of the line, including
    //                      the size of all operands.
    //      _code_line[3] = The __params array.
    //      _code_line[4] = Opcode mnemonic.
    //      _code_line[5] = Opcode.
    //
    //  The remaining operands for the opcode are in
    //  _code_line[6] and upwards.
    //
    //  So a line at offset 1000 like:
    //
    //      mov32   AX, 100;
    //
    //  Would generate:
    //
    //      _code_line[0] = 1000   - IP/line offset
    //      _code_line[1] = 0      - No modifiers
    //      _code_line[2] = 10     - Line is 10 bytes
    //      _code_line[3] = params - The __params array
    //      _code_line[4] = mov32  - Mnemonic
    //      _code_line[5] = 32     - Opcode for mov32
    //      _code_line[6] = 36     - Address of AX
    //      _code_line[7] = 100    - Numeric operand
    //
            const   _code_line          =
            [
                __ip,
                __modifiers,
                0,
                __instruction.params,
                __instruction.mnemonic,
                __opcode
            ];
            
    ///////////////////////////////////////////////////////
    //  Calculate the line size - the opcode and modifier
    //  take up the first two bytes.
    //
            const   __params            = __instruction.params;
            let     __line_size         = 2;

            for (let param_no = 0; param_no < __params.length; param_no++)
            {
    //  Each __param tells us teh size of the expected
    //  operand in bytes - we just add it to __line_size
    //  and push the operand onto the _code_line array.
    //
                let     __param         = __params[param_no];
                // let     __size          = __param;

                // if (__size > window.__s16Sys.__mode)
                //     __size = window.__s16Sys.__mode;

                const   __operand       = __read_ram(__code_segment, (__ip + __line_size), __param)
                
                _code_line.push(__operand);
                __line_size += __param;
            }

            _code_line[2]               = __line_size;

    //  Update the IP register to point to the next
    //  instruction.
    //
            __set_reg(__code_segment, 'IP', (__ip + __line_size));
            s16Process.current_line++;

            return {
                'method':               __instruction.method,
                'code_line':            _code_line
            };

        };


///////////////////////////////////////////////////////////
//  __decode_line()                                      //
///////////////////////////////////////////////////////////
//
        const   __decode_line       = code_line =>
        {

    //  We handle addressing modes - direct and indirect,
    //  by setting modifiers in the opcode - example, if
    //  we take the mov32 instruction, the opcode is
    //  34 but the opcode is 2-bytes, the first byte
    //  would be the instruction 34, the second the
    //  modifiers:
    //
    //      00100010    --opcode
    //      00000000    --modifiers
    //
    //  These are set by the linker when it's mapping out
    //  the s16 executable file, so if we take a line
    //  such as:
    //
    //      mov32   AX, BX;
    //
    //  AX and BX translate to offsets in the header
    //  where the AX and BX registers are located,
    //  AX is at address 156 and BX is as 160, so
    //  the line translates to:
    //
    //      34  0  156, 160;
    //       |  |
    //       |  +--- modifiers
    //       +------ opcode
    //
    //  No modifiers are applied, these are immediate
    //  values - move the value 160 to location 156.
    //
    //  If we do:
    //
    //      mov32   AX, %BX;
    //
    //  This is direct addressing mode, %BX resolves
    //  to the value stored at address 160 (the value
    //  in the BX register) - this sets a modifier so
    //  the CPU module knows how to handle it, we get:
    //
    //      34   0100 0000   156, 160
    // 
    //  Showing the modifiers in binary - bit 2 of the
    //  first nibble is set to tell the CPU that operand
    //  2 points to an address stored at location 160
    //  (BX) not the literal value 160.
    //
    //  Each nibble allows us to set a single modifier
    //  for up to 4 parameters which is fine as 4 no
    //  instruction requires more than 4 operands.
    //
    //  If we do:
    //
    //      mov32   %AX, #BX;
    //
    //  We're using both direct and indirect modes, we
    //  get:
    //
    //      34  1000 0100   156, 160;
    //
    //  The first bit in the first nibble is set to 1, 
    //  so the CPU knows we don't want to put a value
    //  in address 156, we want to get the value at
    //  address 156 and use that as the address to
    //  store our value, so if AX contains the value
    //  200 we're moving a value to address 200 - AX
    //  is basically a pointer.
    //
    //  #BX is using indirect addressing mode, we want
    //  to get the value of BX (value stored at offset
    //  160) and then use that as a pointer to another
    //  location.
    //
            let     __modifiers         = code_line[1];
            const   __params            = code_line[3];

            for (let param_no = 0; param_no < __params.length; param_no++)
            {
                let     __param         = __params[param_no];
                let     __operand       = code_line[(6 + param_no)];

    //  Simple enough - if the operand is using direct
    //  addressing we do the translation once, if it's
    //  indirect we do the translation twice.
    //
    //  For more info see:
    //
    //      System16/s16/src/js/s16/defs/s16Mnemonics.js
    //
                if (
                    __modifiers & window.S16_MOD_DIRECT[param_no]       ||
                    __modifiers & window.S16_MOD_INDIRECT[param_no]
                )
                {
                    const   __segment       = __resolve_segment(__operand);
                    let     __addr_param    = __param;

    //  We need to promote the value to whatever
    //  __mdoe is (1, 2 or 4) since it's an address.
    //
                    if (__modifiers & window.S16_MOD_INDIRECT[param_no])
                        __addr_param = window.__s16Sys.__mode;

                    code_line[(6 + param_no)] = __read_ram(
                        __segment,
                        __operand,
                        __addr_param
                    );

                    __operand = code_line[(6 + param_no)];
                }

                if (__modifiers & window.S16_MOD_INDIRECT[param_no])
                {
                    const   __segment       = __resolve_segment(__operand);

                    code_line[(6 + param_no)] = __read_ram(
                        __segment,
                        __operand,
                        __param
                    );
                }

            }

            return code_line;

        };


///////////////////////////////////////////////////////////
//  __execute_line()                                     //
///////////////////////////////////////////////////////////
//
        const   __execute_line      = (
        
            instruction,
            decoded_line
        
        ) =>
        {

            const   __response      = instruction(
                s16Process,
                decoded_line
            );

            if (typeof __response === 'string')
                window.__s16_error(__response);

    //  Keep track of the number of cycles this process
    //  executes - we do this here because a fetched
    //  or decoded line might not be executed. We also
    //  keep track of the number of lines the process
    //  executes.
    //
            s16Process.total_cycles++;

            return true;

        };


///////////////////////////////////////////////////////////
//  __execute_cycle()                                    //
///////////////////////////////////////////////////////////
//
        const   __execute_cycle         = () =>
        {

            window.__s16_verbose(`Executing cycle on process ${s16Process.id}`);


    ///////////////////////////////////////////////////////
    //  Fetch.
    //
    //  First we fetch the next line of code for this
    //  process...
    //
            const   _objCodeLine        = __fetch_next_line();

            const   _instruction        = _objCodeLine['method'];
            const   _code_line          = _objCodeLine['code_line'];

            if (_code_line === false || typeof _code_line === 'undefined')
            {
                window.__s16Sys.S16_SYSTEM_RUN = false;
                return false;
            }

            if (_code_line[4] === 0)
                return false;


            if (s16Process.status === window.__s16Proc.S16_STATUS_SKIPPING)
            {
                s16Process.status = window.__s16Proc.S16_STATUS_RUNNING;
                return true;
            }

            // if (
            //     window.__s16Config.hasOwnProperty('be_verbose') &&
            //     window.__s16Config['be_verbose']
            // )
            //     __console.generate_report('fetch', __code_segment, _code_line);


    ///////////////////////////////////////////////////////
    //  Decode.
    //
    //  Next, we decode the line in preparation for
    //  execution.
    //
            const   _decoded_line       = __decode_line(_code_line);

            if (
                window.__s16Config.hasOwnProperty('be_verbose') &&
                window.__s16Config['be_verbose']
            )
                __console.generate_report('decode', __code_segment, _decoded_line);


    ///////////////////////////////////////////////////////
    //  Execute.
    //
    //  Execute the line and return.
    //
            const   __execute_return = __execute_line(
                _instruction,
                _decoded_line
            );
             
            // if (
            //     window.__s16Config.hasOwnProperty('be_verbose') &&
            //     window.__s16Config['be_verbose']
            // )
            //     __console.generate_report('execute', __code_segment, _code_line);

            
    ///////////////////////////////////////////////////////
    //  If we have a debugger attached we pass the line
    //  to it before execution - any debugger module will
    //  need to reveal a public method called get_line().
    //
            if (s16Process.debug)
                s16Process.debug(
                    _code_line,
                    _decoded_line
                );

            return __execute_return;

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            __console                   = ConsoleView(
                                            __get_reg,
                                            __set_reg
                                        );


            // __set_reg(__code_segment, 'ROS', s16Process.ro_segment);
            // __set_reg(__code_segment, 'RWS', s16Process.rw_segment);
            // __set_reg(__code_segment, 'CS', s16Process.code_segment);
            // __set_reg(__code_segment, 'SS', s16Process.stacl_segment);

            // __set_reg(__code_segment, 'ROO', s16Process.ro_offset);
            // __set_reg(__code_segment, 'RWO', s16Process.rw_offset);
            // __set_reg(__code_segment, 'CO', s16Process.code_segment);

            __write_ram(__code_segment, 90, s16Process.ro_segment, 4);
            __write_ram(__code_segment, 94, s16Process.rw_segment, 4);
            __write_ram(__code_segment, 98, s16Process.code_segment, 4);
            __write_ram(__code_segment, 102, s16Process.stack_segment, 4);
            
            __write_ram(__code_segment, 106, s16Process.ro_offset, 4);
            __write_ram(__code_segment, 110, s16Process.rw_offset, 4);
            __write_ram(__code_segment, 114, s16Process.code_offset, 4);

            __set_reg(__code_segment, 'IP', s16Process.exe_header.main_offset);

    //
    //  Initialise a listener for the S16_SYSTEM_CYCLE
    //  event - see:
    //
    //      System16/s16/src/js/s16/defs/s16Sys.js
    //
    //  For more information.
    //
            document.addEventListener(
                window.__s16Sys.S16_SYSTEM_CYCLE,
                objDetail =>
                {
                    if (s16Process.status !== window.__s16Proc.S16_STATUS_RUNNING)
                        return;

    //  This event may trigger a fetch-execute cycle
    //  for this process, it depends on the priority
    //  level - priority tells us how many cycles a
    //  process should skip.
    //
    //  This means that 0 is the highest priority
    //  since 0 cycles will be skipped, if you want
    //  a program to run half the speed you'd set
    //  the priority to 1.
    //
    //  In any case = the total_cycles count is
    //  returned in objDetail.
    //
                    if (s16Process.priority)
                    {
    //  The process executed on a cycle when its
    //  ticks counter is 0.
    //
                        if (! s16Process.ticks)
                            __execute_cycle();

                        (s16Process.ticks >= s16Process.priority)
                        ?
                            s16Process.ticks = 0
                        :
                            s16Process.ticks++;
                    }
                    else
                        __execute_cycle();
                }
            );

        };


        __initialise();


        return {

        };

    };
