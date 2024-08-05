///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Peek.js          //
///////////////////////////////////////////////////////////
//
//  The peek instruction.
//


///////////////////////////////////////////////////////////
//  The s16Peek instruction module.                      //
///////////////////////////////////////////////////////////
//
    export const    s16Peek             = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        const   _instruction            = "peek";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('peek')

        ];


///////////////////////////////////////////////////////////
//  _peek()                                              //
///////////////////////////////////////////////////////////
//
        const   _peek                   = (

            s16Process,
            code_line

        ) =>
        {

            let     __dst_offset        = code_line[6];
            let     __segment           = code_line[7];
            let     __offset            = code_line[8];
            let     __size              = code_line[9];

    //  Some basic access and bounds checking...
    //
            if (__size > window.__s16Sys.__mode)
                return `peek error: Can't read ${__size} bytes, running in ${window.__s16Sys.__mode * 8}-bit mode`;
            if (__size !== 1 && __size !== 2 && __size !== 4)
                return `peek error: Invalid size property ${__size} - size must be 1, 2 or 4`;

    //  If we're in protected mode then we can only read
    //  from segments that belong to this process.
    //
            if (typeof window.__s16Sys.__protected !== 'undefined')
            {
                if (
                    (__segment !== s16Process.code_segment)     &&
                    (__segment !== s16Process.ro_segment)       &&
                    (__segment !== s16Process.rw_segment)       &&
                    (__segment !== s16Process.stack_segment)
                )

                return `peek error: Access violation - attempt to access segment ${__segment}`;
            }

            if (__segment >= s16Process.exe_header.segments)
                return `peek error: Segment ${__segment} doesn't exist`;

            console.log(`Peeking from ${__segment}:${__offset} - size = ${__size}`)
    //  Grab the value.
    //
            const   __peek_value        = read_ram(
                __segment,
                __offset,
                __size
            );

    //  What segment is __peek_value being stored in?
    //
            let     __dst_segment       = s16Process.code_segment;

            if (__dst_offset >= s16Process.ro_offset && __dst_offset < s16Process.rw_offset)
                __dst_segment          = s16Process.ro_segment;
            if (__dst_offset >= s16Process.rw_offset && __dst_offset < s16Process.code_offset)
                __dst_segment          = s16Process.rw_segment;
console.log(`Peek write to ${__dst_segment}:${__dst_offset} - value = ${__peek_value}, size = ${__size}`)
    //  Store the value - all done.
    //
            write_ram(
                __dst_segment,
                __dst_offset,
                __peek_value,
                window.__s16Sys.__mode
            );

            return true;

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            peek:                       _peek

        };

    };

