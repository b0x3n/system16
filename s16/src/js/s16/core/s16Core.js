///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/s16Core.js              //
///////////////////////////////////////////////////////////
//
//  The s16 core controller.
//

   
///////////////////////////////////////////////////////////
//  Import required scripts from defs                    //
///////////////////////////////////////////////////////////
//
    import * as s16Registers from       "./../defs/s16Registers.js";
    import * as s16Mnemonics from       "./../defs/s16Mnemonics.js";


///////////////////////////////////////////////////////////
//  Import core modules.                                 //
///////////////////////////////////////////////////////////
//
    import { s16Clock } from            "./../core/s16Clock.js";
    import { s16Cpu } from              "./../core/s16Cpu.js";

    import { s16Header } from           "./s16Header.js";


///////////////////////////////////////////////////////////
//  Import device modules.                               //
///////////////////////////////////////////////////////////
//

    import { s16Ram } from              "./../dev/s16Ram.js";
    import { s16Display } from          "./../dev/s16Display.js";
    import { s16Keyboard } from         "./../dev/s16Keyboard.js";


    import { Instructions } from        "./../../utils/Instructions.js";
    

///////////////////////////////////////////////////////////
//  The s16Core module.                                  //
///////////////////////////////////////////////////////////
//
    export  const   s16Core             = () =>
    {


///////////////////////////////////////////////////////////
//  Initialise device modules.                           //
///////////////////////////////////////////////////////////
//
        let     __s16Ram                = s16Ram();
        let     __s16Display            = s16Display();
        let     __s16Keyboard           = s16Keyboard();


        const   __s16Devices            =
                                        [
                                            __s16Display,
                                            __s16Keyboard
                                        ];


        const   __processes             = [];
        const   __s16Cpu                = [];


        let     __total_cycles          = 0;


///////////////////////////////////////////////////////////
//  Instructions                                         //
///////////////////////////////////////////////////////////
//
//
//
        let     _instructions;


///////////////////////////////////////////////////////////
//  __read_ram()                                         //
///////////////////////////////////////////////////////////
//
        const   __read_ram              = (

            segment,
            offset,
            size

        ) =>
        {

            if (size !== 1 && size !== 2 && size !== 4)
                return window.__s16_error(`Error in __read_ram(): size must be either 1, 2 or 4 bytes`);

            if (size === 1)
                return __s16Ram.read_m8(segment, offset);
            if (size === 2)
                return __s16Ram.read_m16(segment, offset);
            if (size === 4)
                return __s16Ram.read_m32(segment, offset);

        };


///////////////////////////////////////////////////////////
//  __write_ram()                                        //
///////////////////////////////////////////////////////////
//
        const   __write_ram             = (

            segment,
            offset,
            value,
            size

        ) =>
        {

            if (size !== 1 && size !== 2 && size !== 4)
                return window.__s16_error(`Error in __write_ram(): size must be either 1, 2 or 4 bytes`);
            
            if (size === 1)
                return __s16Ram.write_m8(segment, offset, value);
            if (size === 2)
                return __s16Ram.write_m16(segment, offset, value);
            if (size === 4)
                return __s16Ram.write_m32(segment, offset, value);

        };


///////////////////////////////////////////////////////////
//  __is_reg_8()                                         //
///////////////////////////////////////////////////////////
//
        const   __is_reg_8              = reg_name =>
        {

            const   __reg_8             =
            [
                'II', 'OI', 'RT', 'FL'
            ];

            if (__reg_8.indexOf(reg_name) >= 0)
                return true;

            return false;

        };


///////////////////////////////////////////////////////////
//  __get_reg()                                          //
///////////////////////////////////////////////////////////
//
        const   __get_reg               = (
        
            segment,
            reg_name
        
        ) =>
        {

            const   __reg_index         = window.S16_REG[reg_name];

            if (typeof __reg_index === 'undefined')
                return window.__s16_error(`__get_reg(): Invalid register name '${reg_name}'`)

    //  The mode specifies what address mode we're running
    //  in - there are 3 options:
    //
    //      8       8-bit mode - registers and therefore
    //              addresses are 8-bit.
    //
    //      16      16-bit mode - registers and addresses
    //              are 16-bit.
    //
    //      32      Have a guess...
    //
    //  This can be set in the header section of the
    //  assembly source file using the 'mode' option:
    //
    //      .section header
    //          mode    m8;     // 8-bit mode
    //          mode    m16;    // 16-bit mode
    //          mode    m32;    // 32-bit mode
    //
            let __size                  = window.__s16Sys.__mode;
            
            if (__is_reg_8(reg_name))
                __size                  = 1;
            
            return __read_ram(
                segment,
                __reg_index,
                __size
            );

        };


///////////////////////////////////////////////////////////
//  __set_reg()                                          //
///////////////////////////////////////////////////////////
//
        const   __set_reg               = (

            segment,
            reg_name,
            value

        ) =>
        {

            const   __reg_index         = window.S16_REG[reg_name];

            if (__reg_index < 0)
                return window.__s16_error(`__set_reg(): Invalid register name '${reg_name}'`)

            let __size                  = window.__s16Sys.__mode;
            
            if (__is_reg_8(reg_name))
                __size                  = 1;

            return __write_ram(
                segment,
                __reg_index,
                value,
                __size
            );
            
        };


///////////////////////////////////////////////////////////
//  __count_used_segments()                              //
///////////////////////////////////////////////////////////
//
        const   __count_used_segments   = () =>
        {

            let     __segments          = 0;

            __processes.forEach(__process => {
                __segments += __process.segments + __process.allocated;
            });

            window.__s16_verbose(`There are ${__segments} RAM segments currently in use`);

            return __segments;

        };


///////////////////////////////////////////////////////////
//  __disable_clock()                                    //
///////////////////////////////////////////////////////////
//
        const   __disable_clock         = () =>
        {

            if (window.__s16Sys.S16_SYSTEM_CLOCK_TIMERID)
                clearInterval(window.__s16Sys.S16_SYSTEM_CLOCK_TIMERID);
        
            return window.__s16Sys.S16_SYSTEM_CLOCK_TIMERID = false;

        };


///////////////////////////////////////////////////////////
//  __enable_clock()                                     //
///////////////////////////////////////////////////////////
//
        const   __enable_clock          = () =>
        {

            window.__s16Sys.S16_SYSTEM_CLOCK_TIMERID = setInterval(() =>
            {
    ///////////////////////////////////////////////////////
    //  If the system has halted we disable the clock and
    //  do nothing.
    //
                if (window.__s16Sys.S16_SYSTEM_RUN === false)
                    return __disable_clock();

    ///////////////////////////////////////////////////////
    //  We need to trigger all of the __s16Cpu[] modules
    //  into fetching and executing the next line of
    //  code - they all listen for a S16_SYSTEM_CYCLE
    //  event, see:
    //
    //      System16/s16/src/js/s16/defs/s16Sys.js
    //
    //  For more information.
    //
                const   __exec_cycle    = new CustomEvent(
                    window.__s16Sys.S16_SYSTEM_CYCLE,
                    {
                        detail:
                        {
                            'total_cycles': __total_cycles
                        }
                    }
                );

                document.dispatchEvent(__exec_cycle);

                __total_cycles++;

            }, window.__s16Sys.S16_SYSTEM_CLOCK_SPEED);

        };


///////////////////////////////////////////////////////////
//  __load_process()                                     //
///////////////////////////////////////////////////////////
//
        const   __load_process          = (

            exe_path,
            exe_data,
            objHeader,
            debug                       = false

        ) =>
        {

    ///////////////////////////////////////////////////////
    //  Memory models:
    //
    //  This allows us to specify how many segments a
    //  process has (up to 4) and how they are used.
    //
    //   flat       1     - The data, code and stack all
    //                      live in a single segment.
    //   dual       2     - The code and stack live in the
    //                      segment 0, the data in the
    //                      segment 1.
    //   multi      3     - The code and stack will be in
    //                      the segment 0, the ro data
    //                      in segment 1 and the rw data
    //                      segment 2.
    //   split      4     - Code will be in segment 0,
    //                      the stack in segment 1, the
    //                      ro data in segment 2 and the
    //                      rw data in segment 3.
    //
    //  In all cases, unused memory in any section may
    //  be used to allocate heap memory.
    //
    //  Naturally when I say "Code will be in segment 0,
    //  stack in segment 1", etc - I'm talking relative
    //  to the actual segment index that the first
    //  segment is allocated to.
    //
            const   __memory_model      = objHeader.model;

    //  A single process can use up to 4 segments, we
    //  need to know how many segments have been
    //  allocated to other processes...
    //
            const   __segments_used     = __count_used_segments();

    //  Model tells us how many segments we need, are
    //  there enough?
    //
            if ((__segments_used + __memory_model) > objHeader.segments)
                return window.__s16_error(
                    `Can't execute process ${exe_path} - requires ${__memory_model} segments (${(objHeader.segments - __processes.length)} segments remaining)`
                );

    //  Does the exe size exceed the segment size?
    //
            if (exe_data.byteLength > (objHeader.max_addr + 1))
                return window.__s16_error(
                    `Can't execute process ${exe_path} - requires ${exe_data.byteLength} bytes (segment size ${(objHeader.__max_addr + 1)} bytes)`
                );

    //  All good, the data and code can be copied to
    //  RAM for execution.
    //
            let     __header_size       = objHeader.ro_offset;
            let     __ro_size           = (objHeader.rw_offset - objHeader.ro_offset);
            let     __rw_size           = (objHeader.code_offset - objHeader.rw_offset);
            let     __code_size         = (objHeader.exe_size - objHeader.code_offset);
            let     __exe_size          = objHeader.exe_size;

            let     __segment_offset    = __processes.length;

            window.__s16_verbose(`New process: allocating ${__memory_model} segments to process # ${__processes.length} (${exe_path})`);

    //  Assume a flat model.
    //
            let     __ro_segment        = __segment_offset;
            let     __rw_segment        = __segment_offset;
            let     __code_segment      = __segment_offset;
            let     __stack_segment     = __segment_offset;


    //  Dual - ro and rw are together in another segment.
    //
            if (__memory_model === 2)
            {
                __ro_segment            = (__segment_offset + 1);
                __rw_segment            = (__segment_offset + 1);
            }

    //  Multi - ro and rwo each have their own segment.
    //
            if (__memory_model === 3)
            {
                __ro_segment            = (__segment_offset + 1);
                __rw_segment            = (__segment_offset + 2);
            }

    //  Split - the ro, rw, code and stack all have their
    //  own segment.
    //
            if (__memory_model === 4)
            {
                __ro_segment            = (__segment_offset + 1);
                __rw_segment            = (__segment_offset + 2);
                __stack_segment         = (__segment_offset + 3);
            }
            
            const   __process_count     = __processes.length;

            __processes.push(
                {

    ///////////////////////////////////////////////////////
    //  Process information - most of this is ripped
    //  directly from or calculated using values in
    //  the header.
    //
    //  We get a reference to the header object, too -
    //  some values are referenced here for quick and
    //  easy access.
    //
                    'exe_path':         exe_path,
                    'exe_data':         exe_data,
                    'exe_header':       objHeader,
                    'id':               __process_count,
                    'debug':            debug,
                    'segments':         __memory_model,
                    'allocated':        0,
                    'segment_offset':   __segment_offset,
                    'ro_segment':       __ro_segment,
                    'rw_segment':       __rw_segment,
                    'code_segment':     __code_segment,
                    'stack_segment':    __stack_segment,
                    'ro_size':          __ro_size,
                    'rw_size':          __rw_size,
                    'code_size':        __code_size,

    ///////////////////////////////////////////////////////
    //  Process stats.
    //
                    'total_cycles':     0,
                    'priority':         0,
                    'ticks':            0,
                    'current_line':     0,
                    'ip':               objHeader.main_offset,
                    'warnings':         [],
                    'errors':           [],
                    'call_depth':       0,
                    'call_type':        [],
                    'status':           window.__s16Proc.S16_STATUS_RUNNING,

    ///////////////////////////////////////////////////////
    //  I/O handlers.
    //
                    'read_ram':         __read_ram,
                    'write_ram':        __write_ram,
                    'is_reg_8':         __is_reg_8,
                    'get_reg':          __get_reg,
                    'set_reg':          __set_reg,

    ///////////////////////////////////////////////////////
    //  Every process gets a reference to the instruction
    //  set returned by the Instructions module - see
    //  the __initialise() method at the bottom of
    //  module for more information.
    //
                    'instructions':     _instructions.instruction_set

                }
            );

    //  The header and code sections always go in
    //  segment 0.
    //
            window.__s16_verbose(`Loading header (${__header_size} bytes) in segment ${__code_segment} @ 0-${__header_size}`);
            __s16Ram.load(__code_segment, 0, exe_data, 0, __header_size);
            
            window.__s16_verbose(`Loading code (${__code_size} bytes) in segment ${__code_segment} @ ${objHeader.code_offset}-${(objHeader.code_offset + __code_size)}`);
            __s16Ram.load(__code_segment, objHeader.code_offset, exe_data, objHeader.code_offset, __code_size);

            window.__s16_verbose(`Loading ro (${__ro_size} bytes) in segment ${__ro_segment} @ ${objHeader.ro_offset}-${(objHeader.ro_offset + __ro_size)}`);
            __s16Ram.load(__ro_segment, objHeader.ro_offset, exe_data, objHeader.ro_offset, __ro_size);
            
            window.__s16_verbose(`Loading rw (${__rw_size} bytes) in segment ${__rw_segment} @ ${objHeader.rw_offset}-${(objHeader.rw_offset + __rw_size)})`);
            __s16Ram.load(__rw_segment, objHeader.rw_offset, exe_data, objHeader.rw_offset, __rw_size);
            
    //  The stack is created and managed at runtime,
    //  there's nothing to copy there.
    //
            window.__s16_verbose(`Stack segment: ${__stack_segment}`);

    //  Lastly, if this is process 0 we run the system
    //  by enabling the clock and setting the global
    //  window.__s16Sys.S16_SYSTEM_RUN to true.
    //
            if (__process_count === 0)
            {
                window.__s16Sys.S16_SYSTEM_RUN = true;
                __enable_clock();
            }

            __s16Cpu.push(
                s16Cpu(
                    __s16Ram,
                    __s16Devices,
                    __processes[__process_count]
                )
            );

            return true;

        };


///////////////////////////////////////////////////////////
//  __create_process()                                   //
///////////////////////////////////////////////////////////
//
        const   __create_process        = (

            exe_path,
            exe_data

        ) =>
        {

    ///////////////////////////////////////////////////////
    //  First - we need to read the file header, it tells
    //  us a lot of information about the executable,
    //  like what mode (8, 16 or 32-bit) to run in,
    //  etc.
    //
            const   __s16_header        = s16Header(exe_data);

            
    ///////////////////////////////////////////////////////
    //  If this is the boot process then we need to first
    //  initialise the s16Ram module.
    //
    //  The exe header should specify how many segments
    //  and the max_addr.
    //
            if (__processes.length === 0)
            {
                window.__s16Sys.__segments = __s16_header.segments;
                window.__s16Sys.__maxaddr = __s16_header.maxaddr;

                __s16Ram.initialise(
                    window.__s16Sys.__segments,
                    window.__s16Sys.__maxaddr
                );

                window.__s16_verbose(
                    `Allocated system RAM...\n\tSegments:       ${window.__s16Sys.__segments}\n\tSegment size:   ${window.__s16Sys.__maxaddr + 1}`
                );
            }

            __load_process(
                exe_path,
                exe_data,
                __s16_header
            );

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            // __s16Display                = s16Display();
            // __s16Keyboard               = s16Keyboard();

    ///////////////////////////////////////////////////////
    //  The Instructions module (utils) will pre-load and
    //  initialise the instruction modules in:
    //
    //      System16/s16/src/js/s16/core/ins/
    //
    //  All instructions are returned in instruction_set,
    //  the module will generate handlers for every
    //  opcode - e.g, the dev instruction has an opcode
    //  of 10, the _instruction_set array will contain
    //  an object with the key __in_10 (instruction 10).
    //
    //  See the Instructions.js module:
    //
    //      System16/s16/src/js/s16/utils.Instructions.js
    //
    //  The important thing is that each process will be
    //  given a reference to the instruction_set object.
    //
            _instructions               = Instructions(
                __s16Devices,
                __read_ram,
                __write_ram,
                __get_reg,
                __set_reg
            );

    //  Initialise is only executed when the system boots
    //  up - so we know we need to load the boot_exe
    //  into RAM and run it.
    //
    //  The data should be in window.__s16Sys.boot_exe.
    //
            __create_process(
                window.__s16Sys.exe_path,
                window.__s16Sys.exe_data
            );
            

            document.addEventListener(
                window.__s16Proc.S16_PROCESS_TERMINATE,
                objDetail => {
                    const   __process_id = objDetail.detail['process_id'];

                    window.__s16_verbose(`Terminating process ${__process_id}`)
                    delete  __s16Cpu[__process_id];

                    __processes[__process_id].status = window.__s16Proc.S16_STATUS_TERMINATED;
                    __s16Cpu[__process_id] = __processes.RT;
                }
            );


            $('header').on('click', () => {
                window.__s16Sys.S16_SYSTEM_RUN = false;
            });

        };


        __initialise();


        return {

        };

    };
