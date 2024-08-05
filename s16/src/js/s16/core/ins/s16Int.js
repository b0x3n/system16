///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Int.js           //
///////////////////////////////////////////////////////////
//
//  Module for the int instruction.
//


///////////////////////////////////////////////////////////
//  The int instruction makes use of call.               //
///////////////////////////////////////////////////////////
//
    import { s16Call } from             "./s16Call.js";


    export const    s16Int              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {


        const   __call                  = s16Call(
            s16Devices,
            read_ram,
            write_ram,
            get_reg,
            set_reg
        );


        const   _instruction            = "int";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('int')

        ];


///////////////////////////////////////////////////////////
//  _int()                                               //
///////////////////////////////////////////////////////////
//
        const   _int                    = (

            s16Process,
            code_line

        ) =>
        {

            let     __handler_addr      = false;
            let     __device_index      = 0;

    //  First thing is to find the interrupt ID in the
    //  vector table...
    //
            for (__device_index = 0; __device_index < 8; __device_index++)
            {
                const   __interrupt_id  = read_ram(
                    s16Process.code_segment,
                    (window.S16_HEADER_VTABLE + __device_index),
                    1
                );

                if (__interrupt_id === code_line[6])
                {
                    __handler_addr      = read_ram(
                        s16Process.code_segment,
                        ((window.S16_HEADER_VTABLE + 8) + (__device_index * 4)),
                        window.__s16Sys.__mode
                    );

                    break;
                }
            }

            if (__handler_addr === false)
                return `int error: Interrupt ID ${code_line[6]} not defined`;

    //  Now we issue a call instruction, in this case
    //  we pass an additional value, the devide index.
    //
    //  See the s16Call module for more info.
    //
            __call.call(
                s16Process,
                [ 0, 0, 0, 0, 0, 0, __handler_addr ],
                __device_index
            );

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            int:                        _int

        };



    };

