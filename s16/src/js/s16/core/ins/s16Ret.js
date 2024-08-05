///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Ret.js           //
///////////////////////////////////////////////////////////
//
//  Module for the call instruction.
//


    import { s16Pop } from              "./s16Pop.js";


///////////////////////////////////////////////////////////
//  The s16Ret instruction.                              //
///////////////////////////////////////////////////////////
//
    export const    s16Ret              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

    ///////////////////////////////////////////////////////
    //  Makes use of the pop instruction.
    //
        const   __pop                   = s16Pop(
            s16Devices,
            read_ram,
            write_ram,
            get_reg,
            set_reg
        );


        const   _instruction            = "ret";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('ret')

        ];


///////////////////////////////////////////////////////////
//  _ret()                                               //
///////////////////////////////////////////////////////////
//
        const   _ret                    = (
            
            s16Process,
            code_line

        ) =>
        {

        //    set_reg(s16Process.code_segment, 'IP', code_line[6]);

    //  The return value is stored in the RT register.
    //
            set_reg(s16Process.code_segment, 'RT', code_line[6]);

    //  If we're at depth 0 then we're returning from the
    //  first call to _main which means the process
    //  has exited - we store the current RT register
    //  in the process object and terminate the process.
    //
            if (s16Process.call_depth <= 0)
            {
                const   __event             = new CustomEvent(
                    window.__s16Proc.S16_PROCESS_TERMINATE,
                    {
                        detail:
                        {
                            'process_id': s16Process.id
                        }
                    }
                );

                window.__s16_verbose(`Terminating...`);
                s16Process.RT               = get_reg(s16Process.code_segment, 'RT');
                document.dispatchEvent(__event);
            }
            else
            {
    //  The return pointer needs to be popped from
    //  the stack back into the IP register.
    //
                const   __response          = __pop.pop(
                    s16Process,
                    [ 0, 0, 0, 0, 0, 0, window.S16_REG['IP']],
                    window.__s16Sys.__mode
                );

                if (typeof __response === 'string')
                    return __response;

                s16Process.call_depth--;

                const   __call_type     = s16Process.call_type.pop();

                if (__call_type !== 255)
                {
                    return s16Devices[__call_type].interrupt(
                        s16Process,
                        read_ram,
                        write_ram,
                        get_reg,
                        set_reg
                    );
                }

            }

            return true;

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            ret:                        _ret

        };

    };

