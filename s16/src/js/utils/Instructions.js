///////////////////////////////////////////////////////////
//  system16/s16/src/js/s16/utils/Instructions.js        //
///////////////////////////////////////////////////////////
//
//
//


    import { s16Dev } from              "./../s16/core/ins/s16Dev.js";
    import { s16Call } from             "./../s16/core/ins/s16Call.js";
    import { s16Int } from              "./../s16/core/ins/s16Int.js";
    import { s16Ret } from              "./../s16/core/ins/s16Ret.js";
    import { s16Mov } from              "./../s16/core/ins/s16Mov.js";
    import { s16Pop } from              "./../s16/core/ins/s16Pop.js";
    import { s16Push } from             "./../s16/core/ins/s16Push.js";
    import { s16Cmp } from              "./../s16/core/ins/s16Cmp.js";
    import { s16Jmp } from              "./../s16/core/ins/s16Jmp.js";
    import { s16Calc } from             "./../s16/core/ins/s16Calc.js";
    import { s16Peek } from             "./../s16/core/ins/s16Peek.js";
    import { s16Par } from              "./../s16/core/ins/s16Par.js";
    import { s16Loc } from              "./../s16/core/ins/s16Loc.js";
    import { s16X } from                "./../s16/core/ins/s16X.js";


///////////////////////////////////////////////////////////
//  The Instructions module.                             //
///////////////////////////////////////////////////////////
//
    export const    Instructions        = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {


    ///////////////////////////////////////////////////////
    //  Every module is initialised and stored here.
    //
        const   __modules               =
        [

            s16Dev(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Call(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Int(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Ret(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Mov(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Pop(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Push(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Cmp(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Jmp(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Calc(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Peek(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Par(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16Loc(s16Devices, read_ram, write_ram, get_reg, set_reg),
            s16X(s16Devices, read_ram, write_ram, get_reg, set_reg)
            
        ];


    ///////////////////////////////////////////////////////
    //  Every group of instruction has a corresponding
    //  module that reveals one or more public methods,
    //  e.g the s16Mov module reveals 3 methods:
    //
    //      mov8()
    //      mov16()
    //      mov32()
    //
    //  Every single method will be added to an object
    //  using the opcode to generate a key/index for
    //  quick lookup and execution.
    //
        const   _instruction_set        = {};


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            console.log(`>>> DEVICES:`);
            console.log(s16Devices)

            __modules.forEach(__module =>
            {

    //  Grab the mnemonic info from the module, this
    //  tells us how many methods it reveals and what
    //  the names of those methods are.
    //
                const   __info          = __module.info;

    //  Every entry in the __info array describes a
    //  single method, these need to be added to the
    //  _operations object.
    //
                __info.forEach(_info =>
                {

                    const   __opcode    = _info.opcode;
                    const   __params    = _info.params;
                    const   __mnemonic  = _info.mnemonic;

    //  We add the method, indexing it using a key generated
    //  using the opcode - example, the opcode for the dev
    //  instruction is 10, so to execute a dev instruction
    //  all we do is:
    //
    //      _operations.__in_10.method(code_line);
    //
                    const   __key       = `__in_${__opcode}`;
                
                    _instruction_set[__key] = {
                        'opcode':       __opcode,
                        'params':       __params,
                        'mnemonic':     __mnemonic,
                        'method':       __module[__mnemonic]
                    };

                });

            });

        };


        __initialise();


        return {

            instruction_set:            _instruction_set

        };

    };
