///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/core/ins/s16Mov.js           //
///////////////////////////////////////////////////////////
//
//  Module for the mov instruction.
//



///////////////////////////////////////////////////////////
//  The s16Mov instruction.                              //
///////////////////////////////////////////////////////////
//
    export const    s16Mov              = (

        s16Devices,
        read_ram,
        write_ram,
        get_reg,
        set_reg

    ) =>
    {


    ///////////////////////////////////////////////////////
    //  Instruction name - this is not the same as a
    //  mnemonic, it's a group id for a set of mnemonics,
    //  e.g "mov" comprises 3 mnemonics/instructions:
    //
    //      mov8
    //      mov16
    //      mov32
    //
        const   _instruction            = "mov";
        

    ///////////////////////////////////////////////////////
    //  Info for all of the instructions that belong to
    //  this group.
    // 
        const   _info                   =
        [

            window.S16_MNEMONIC_INFO('mov8'),
            window.S16_MNEMONIC_INFO('mov16'),
            window.S16_MNEMONIC_INFO('mov32')

        ];


///////////////////////////////////////////////////////////
//  _mov()                                               //
///////////////////////////////////////////////////////////
//
        const   _mov                    = (

            s16Process,
            code_line,
            size

        ) =>
        {

            let     __dst_offset        = code_line[6];
            let     __src_offset        = code_line[7];

            let     __dst_segment       = s16Process.code_segment;
            let     __src_segment       = s16Process.code_segment;

            if (__dst_offset >= s16Process.ro_offset && __dst_offset < s16Process.rw_offset)
                __dst_segment = s16Process.ro_segment;
            if (__dst_offset >= s16Process.rw_offset && __dst_offset < s16Process.code_offset)
                __dst_segment = s16Process.rw_segment;

            // if (__src_offset >= s16Process.ro_offset && __src_offset < s16Process.rw_offset)
            //     __src_offset = s16Process.ro_segment;
            // if (__src_offset >= s16Process.rw_offset && __dst__src_offset_offset < s16Process.code_offset)
            //     __src_offset = s16Process.rw_segment;

            // const   __src_data          = read_ram(
            //     __src_segment,
            //     __src_offset,
            //     size
            // );

            if (size > window.__s16Sys.__mode)  
                size = window.__s16Sys.__mode;

console.log(`>>>>>>>>>>>>>>>>>>>>... ${code_line[4]} write to ${__dst_offset}, value = ${code_line[7]}`)
            write_ram(
                __dst_segment,
                __dst_offset,
                code_line[7],
                size
            );
            
        };


///////////////////////////////////////////////////////////
//  _mov8()                                              //
///////////////////////////////////////////////////////////
//
//  For every entry added to _info there should be a
//  function. The function can be named anything but
//  the public reference must match the mnemonic
//  instruction.
//
        const   _mov8                   = (

            s16Process,
            code_line

        ) =>
        {

            _mov(
                s16Process,
                code_line,
                1
            );

            return true;

        };


///////////////////////////////////////////////////////////
//  _mov16()                                             //
///////////////////////////////////////////////////////////
//
        const   _mov16                  =  (

            s16Process,
            code_line
            
        ) =>
        {

            _mov(
                s16Process,
                code_line,
                2
            );

            return true;

        };


///////////////////////////////////////////////////////////
//  _mov32()                                             //
///////////////////////////////////////////////////////////
//
//  For every mnemonic there should be a function. The
//  function can be named anything but the public
//  reference must match the mnemonic.
//
        const   _mov32                  =  (

            s16Process,
            code_line
            
        ) =>
        {

            _mov(
                s16Process,
                code_line,
                4
            );

            return true;

        };


        return {

            instruction:                _instruction,
            info:                       _info,

            mov8:                       _mov8,
            mov16:                      _mov16,
            mov32:                      _mov32

        };

    };

