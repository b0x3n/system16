///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Pop.js           //
///////////////////////////////////////////////////////////
//
//  Module for the pop instruction.
//


///////////////////////////////////////////////////////////
//  The s16Pop instruction.                              //
///////////////////////////////////////////////////////////
//
    export const    s16Pop              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {

        
        const   _instruction            = "pop";

        
        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('pop8'),
            window.S16_MNEMONIC_INFO('pop16'),
            window.S16_MNEMONIC_INFO('pop32')

        ];


///////////////////////////////////////////////////////////
//  _pop()                                               //
///////////////////////////////////////////////////////////
//
        const   _pop                    = (
        
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
    //  ...yes, I did just copy & paste s16Push, so
    //  what?
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
            if (__sp > (s16Process.exe_header.maxaddr - size))
                return `push8 error: Stack base ${s16Process.exe_header.maxaddr} exceeded`;

    //  All good, we can write the byte(s)!
    //
            const   __popped_value      = read_ram(
                __stack_segment,
                __sp,
                size
            );

    //  Update the stack pointer.
    //
            set_reg(__code_segment, 'SP', (__sp + size));

            let     __write_segment     = __code_segment;

            if (code_line[6] >= s16Process.ro_offset && code_line[6] < s16Process.rw_offset)
                __write_segment         = s16Process.ro_segment;
            if (code_line[6] >= s16Process.rw_offset && code_line[6] < s16Process.code_offset)
                __write_segment         = s16Process.rw_segment;
            
            write_ram(
                __write_segment,
                code_line[6],
                __popped_value,
                size
            );

        };


///////////////////////////////////////////////////////////
//  _pop8()                                              //
///////////////////////////////////////////////////////////
//
        const   _pop8                   = (
        
            s16Process,
            code_line
        
        ) =>
        {

            return _pop(
                s16Process,
                code_line,
                1
            );

        };


///////////////////////////////////////////////////////////
//  _pop16()                                             //
///////////////////////////////////////////////////////////
//
        const   _pop16                  = (
        
            s16Process,
            code_line
        
        ) =>
        {

            return _pop(
                s16Process,
                code_line,
                2
            );

        };


///////////////////////////////////////////////////////////
//  _pop32()                                             //
///////////////////////////////////////////////////////////
//
        const   _pop32                  = (
        
            s16Process,
            code_line
        
        ) =>
        {

            return _pop(
                s16Process,
                code_line,
                4
            );

        };


        return {

            intruction:                 _instruction,
            info:                       _info,

            pop:                        _pop,
            
            pop8:                       _pop8,
            pop16:                      _pop16,
            pop32:                      _pop32

        };


    };

