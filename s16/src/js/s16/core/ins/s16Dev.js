///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ops/s16Dev.js           //
///////////////////////////////////////////////////////////
//
//  Module for the dev instruction.
//
//  All of the modules in the ops/ directory follow the
//  same structure/format - for more detailed comments
//  see the module for the mov set of instructions.
//



///////////////////////////////////////////////////////////
//  The s16Dev instruction.                              //
///////////////////////////////////////////////////////////
//
    export const    s16Dev              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        const   _instruction            = "dev";
        
        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('dev'),

        ];
        

///////////////////////////////////////////////////////////
//  _dev()                                               //
///////////////////////////////////////////////////////////
//
        const   _dev                    = (
        
            s16Process,
            code_line
        
        ) =>
        {

    //  Our parameters start at element 6 of the code_line
    //  array, we need three for the dev instruction:
    //
    //      <device_id>, <interrupt_id>, <function_address>
    //
    //  The device_id refers to one of the devices in the
    //  s16Devices array that is passed  to the s16Core
    //  module, the default order being:
    //
    //      s16Devices =
    //      [
    //          s16Ram,
    //          s16Display
    //          s16Keyboard
    //      ]
    //
    //  So we can assign an interrupt ID to a device and
    //  aassign a default handler that will be invoked
    //  any time that device is interrupted - e.g:
    //
    //      dev     1, 10, __display_handler;
    //
    //  Now when we call:
    //
    //      int     10;
    //
    //  The __display_handler function (if it exists) will
    //  be executed BEFORE the display module carries out
    //  whatever operation we want.
    //
    //  You can't interrupt ram, so you can't do:
    //
    //      dev     0, <number>, __function_name;
    //
    //  But you can do it for up to 8 additional device
    //  modules in the s16Devices array.
    //

            let     __device_index      = code_line[6];
            let     __device_interrupt  = code_line[7];
            let     __device_handler    = code_line[8];

    //  This information is written to the vector table
    //  at offset 50 in the header - each entry is 5
    //  bytes and we can have up to 8 devices, so 40
    //  bytes is the size of the table.
    //
    //  The table looks like this:
    //
    //      offset 50 - the interrupt ID for device 1
    //      offset 51 - the interrupt ID for device 2
    //      offset 52 - the interrupt ID for device 3
    //      offset 53 - the interrupt ID for device 4
    //      offset 54 - the interrupt ID for device 5
    //      offset 55 - the interrupt ID for device 6
    //      offset 56 - the interrupt ID for device 7
    //      offset 57 - the interrupt ID for device 8
    //
    //  The interrupt ID's are indexed in bytes 50-57
    //  with each ID consuming a single byte.
    //
    //  The function offsets are at offset 58-89:
    //
    //      offset 58 - address of handler for device 0
    //      offset 62 - address of handler for device 1
    //      offset 66 - address of handler for device 2
    //      offset 70 - address of handler for device 3
    //      offset 74 - address of handler for device 4
    //      offset 78 - address of handler for device 5
    //      offset 82 - address of handler for device 6
    //      offset 86 - address of handler for device 7
    //
            if (__device_index < 1 || __device_index > 8)
                return `dev error: device index ${__device_index} out of range - the range is 1-8, inclusive`;

    //  We use device indexes in the range 1-8, this is
    //  because the s16Ram device module is at index 0
    //  of the s16Devices array - but we can't assign
    //  an interrupt to RAM so our real index is
    //  (__device_index - 1)
    //
            __device_index--;

    //  We can only assign an interrupt to a particular
    //  device module once, we can't change it or unset
    //  it unless we explicitly do it in the assembly
    //   code.
    //
            const   __check_index       = read_ram(
                s16Process.code_segment,
                (window.S16_HEADER_VTABLE + __device_index),
                window.__s16Sys.__mode
            );

            if (__check_index > 0)
                return `dev error: Device at index ${__device_index} already assigned ID ${__check_index}`;

    //  The interrupt ID must be in the inclusive range
    //  1-255, it must also be unique meaning no other
    //  device may be using the same interrupt.
    //
            for (let offset = 0; offset < 8; offset++)
            {
                const   __interrupt     = read_ram(
                    s16Process.code_segment,
                    (window.S16_HEADER_VTABLE + offset),
                    1
                );

                if (__interrupt === __device_interrupt)
                    return `dev error: Can't assign ID ${__device_interrupt} to device ${__device_index} - interrupt ID already assigned to device ${(offset + 1)}`
            }

    //  All good - we can write the function offset to
    //  the table.
    //
            const   __handler_offset    = ((__device_index * 4) + (window.S16_HEADER_VTABLE + 8));
            
            write_ram(
                s16Process.code_segment,
                (window.S16_HEADER_VTABLE + __device_index),
                __device_interrupt,
                1
            );

            write_ram(
                s16Process.code_segment,
                __handler_offset,
                __device_handler,
                window.__s16Sys.__mode
            );

            return true;

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            dev:                        _dev

        };

    };

