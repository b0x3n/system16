///////////////////////////////////////////////////////////
//  System16/core/Header.mjs                             //
///////////////////////////////////////////////////////////
//
//
//



///////////////////////////////////////////////////////////
//  The Header module.                                   //
///////////////////////////////////////////////////////////
//
    export const    Header              = (

        objExe,
        messenger

    ) =>
    {

        const   __dst_view              = new DataView(objExe.exe_buffer);


///////////////////////////////////////////////////////////
//  __set_header_id()                                    //
///////////////////////////////////////////////////////////
//
        const   __set_header_id         = () =>
        {

            const   __id_str            = global.S16_ID;

            for (let byte_no = 0; byte_no < __id_str.length; byte_no++)
                __dst_view.setUint8(byte_no, __id_str.charCodeAt(byte_no));

        };


///////////////////////////////////////////////////////////
//  __set_header_version()                               //
///////////////////////////////////////////////////////////
//
        const   __set_header_version    = () =>
        {

            __dst_view.setUint8(global.S16_HEADER_MAJOR, global.S16_MAJOR);
            __dst_view.setUint8(global.S16_HEADER_MINOR, global.S16_MINOR);
            __dst_view.setUint8(global.S16_HEADER_PATCH, global.S16_PATCH);
        
        };


///////////////////////////////////////////////////////////
//  __set_header_date()                                  //
///////////////////////////////////////////////////////////
//
        const   __set_header_date       = () =>
        {

            const   __date              = new Date();

            __dst_view.setUint8(global.S16_HEADER_DAY, __date.getUTCDate());
            __dst_view.setUint8(global.S16_HEADER_MONTH, (__date.getUTCMonth() + 1));
            __dst_view.setUint16(global.S16_HEADER_YEAR, __date.getUTCFullYear(), global.little_endian);

        };


///////////////////////////////////////////////////////////
//  __set_header_model()                                 //
///////////////////////////////////////////////////////////
//
        const   __set_header_model      = () =>
        {

            __dst_view.setUint16(global.S16_HEADER_MODEL, objExe.memory_model, global.little_endian);

        };


///////////////////////////////////////////////////////////
//  __set_header_offsets()                               //
///////////////////////////////////////////////////////////
//
        const   __set_header_offsets    = () =>
        {

            __dst_view.setUint32(global.S16_HEADER_RO, objExe.ro_offset, global.little_endian);
            __dst_view.setUint32(global.S16_HEADER_RW, objExe.rw_offset, global.little_endian);
            __dst_view.setUint32(global.S16_HEADER_CODE, objExe.code_offset, global.little_endian);


        };


///////////////////////////////////////////////////////////
//  __set_header_segments()                              //
///////////////////////////////////////////////////////////
//
        const   __set_header_segments   = () =>
        {

            __dst_view.setUint32(global.S16_HEADER_SEGMENTS, objExe.segments, global.little_endian);
            __dst_view.setUint32(global.S16_HEADER_MAXADDR, objExe.maxaddr, global.little_endian);
        
        };


///////////////////////////////////////////////////////////
//  __set_header_mode()                                  //
///////////////////////////////////////////////////////////
//
        const   __set_header_mode           = () =>
        {

            __dst_view.setUint16(global.S16_HEADER_MODE, objExe.mode, global.little_endian);
        
        };


///////////////////////////////////////////////////////////
//  __set_header_endianess()                             //
///////////////////////////////////////////////////////////
//
        const   __set_header_endianess  = () =>
        {

    //  For big-endian, which is the default byte-order,
    //  we store 00 at byte 78 of the header and FF at
    //  byte 79, for little-endian the values are
    //  stored in reverse.
    //
            if (global.little_endian)
            {
                __dst_view.setUint8(global.S16_HEADER_ENDIANESS, 0xFF);
                __dst_view.setUint8((global.S16_HEADER_ENDIANESS + 1), 0x00);
            }
            else
            {
                __dst_view.setUint8(global.S16_HEADER_ENDIANESS, 0x00);
                __dst_view.setUint8((global.S16_HEADER_ENDIANESS + 1), 0xFF);
            }

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise                = () =>
        {

           // __dst_view.setUint32(global.S16_HEADER_EXESIZE, objExe.exe_buffer.byteLength, global.little_endian);
        
            __set_header_id();
            __set_header_version();
            __set_header_date();
            __set_header_model();
            __set_header_offsets();
            __set_header_segments();
            __set_header_mode();
            __set_header_endianess();

            messenger.verbose(` Generated header...\n`);

        };


        __initialise();


        return objExe;

    };

