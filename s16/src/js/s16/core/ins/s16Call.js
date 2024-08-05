///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Call.js          //
///////////////////////////////////////////////////////////
//
//  Module for the call instruction.
//


    import { s16Push } from             "./s16Push.js";


///////////////////////////////////////////////////////////
//  The s16Call instruction.                             //
///////////////////////////////////////////////////////////
//
    export const    s16Call             = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

    ///////////////////////////////////////////////////////
    //  Makes use of the push instruction set.
    //
        const   __push                  = s16Push(
            s16Devices,
            read_ram,
            write_ram,
            get_reg,
            set_reg
        );


        const   _instruction            = "call";


        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('call')

        ];


///////////////////////////////////////////////////////////
//  _call()                                              //
///////////////////////////////////////////////////////////
//
        const   _call                   = (
            
            s16Process,
            code_line,
            handler_id                  = 255

        ) =>
        {

    //  We need to do a few things here, first we need
    //  to push the current IP onto the stack.
    //
    //  We just pass an empty array with element 6
    //  specifying the current instruction pointer.
    //
            __push.push(
                s16Process,
                [ 0, 0, 0, 0, 0, 0, get_reg(s16Process.code_segment, 'IP') ],
                2
            );


    //  Now we set the IP register to the specified
    //  address in code_line[6].
    //
            set_reg(s16Process.code_segment, 'IP', code_line[6]);


    //  We need to increase the current call_depth value
    //  in the s16Process object - this keeps track of
    //  function nesting.
    //
            s16Process.call_depth++;

    //  The handler ID is set to 255 for a regular
    //  call - the s16Int module uses call as a dependency,
    //  if an int instruction is executed it will call
    //  this method and pass a handler_id that is the
    //  index of the device module to interrupt.
    //
    //  We check and pop this on the return - if it's
    //  255 we simply return, if it's a value < 255
    //  then it should be a device index in the range
    //  0-7 inclusive.
    //
            s16Process.call_type.push(handler_id);
            
            return true;

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            call:                       _call

        };

    };

