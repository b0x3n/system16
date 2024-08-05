///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Push.js          //
///////////////////////////////////////////////////////////
//
//  Module for the push instruction.
//


///////////////////////////////////////////////////////////
//  The s16Push instruction.                             //
///////////////////////////////////////////////////////////
//
    export const    s16Push             = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        const   _instruction            = "push";

        
        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('push8'),
            window.S16_MNEMONIC_INFO('push16'),
            window.S16_MNEMONIC_INFO('push32')

        ];


///////////////////////////////////////////////////////////
//  _push()                                              //
///////////////////////////////////////////////////////////
//
        const   _push                   = (
        
            s16Process,
            code_line,
            size
        
        ) =>
        {

    ///////////////////////////////////////////////////////
    //  Some additional setup here - since we're dealing
    //  with the stack it's useful to set the stack
    //  segment and top.
    //
    //  The segment parameter passed to the instruction
    //  methods points to the code segment, if we're
    //  running on a split memory model the stack will
    //  have its own segment...
    //
            const   __stack_segment     = s16Process.stack_segment;
            const   __code_segment      = s16Process.code_segment;

            let     __stack_top         = 0;
            
    //  When stack has its own segment the top of the
    //  stack is 0 - when the stack and code share
    //  a segment the top of the stack is in the HP
    //  register.
    //
            if (__stack_segment === __code_segment)
                __stack_top             = get_reg(__code_segment, 'HP');

            const   __sp                = get_reg(__code_segment, 'SP');

    //  Bounds check.
    //
            if ((__sp - size) < __stack_top)
                return `push8 error: Stack top ${__stack_top} exceeded`;

    //  All good, we can write the byte(s)!
    //
            write_ram(
                __stack_segment,
                (__sp - size),
                code_line[6],
                size
            );

    //  Lastly - we update the stack pointer.
    //
            set_reg(__code_segment, 'SP', (__sp - size));

            return true;

        };


///////////////////////////////////////////////////////////
//  _push8()                                             //
///////////////////////////////////////////////////////////
//
        const   _push8                  = (
        
            s16Process,
            code_line
        
        ) =>
        {

            return _push(
                s16Process,
                code_line,
                1
            );

        };


///////////////////////////////////////////////////////////
//  _push16()                                            //
///////////////////////////////////////////////////////////
//
        const   _push16                 = (
        
            s16Process,
            code_line
        
        ) =>
        {

            return _push(
                s16Process,
                code_line,
                2
            );

        };


///////////////////////////////////////////////////////////
//  _push32()                                            //
///////////////////////////////////////////////////////////
//
        const   _push32                 = (
        
            s16Process,
            code_line
        
        ) =>
        {

            return _push(
                s16Process,
                code_line,
                4
            );

        };


        return {

            intruction:                 _instruction,
            info:                       _info,

            push:                       _push,

            push8:                      _push8,
            push16:                     _push16,
            push32:                     _push32

        };


    };

