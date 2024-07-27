///////////////////////////////////////////////////////////
//  System/s16l/src/core/ExeBuilder.mjs                  //
///////////////////////////////////////////////////////////
//
//
//


    import * as GlobalRegisters from    "../../../core/defs/Registers.js";
    import * as GlobalMnemonics from    "../../../core/defs/Mnemonics.js";
    import * as GlobalHeader from       "../../../core/defs/ExeHeader.js";


    import { Header } from              "../../../core/Header.mjs";


    import { MapData } from             "./MapData.mjs";
    import { MapCode } from             "./MapCode.mjs";


///////////////////////////////////////////////////////////
//  The ExeBuilder module.                               //
///////////////////////////////////////////////////////////
//
    export const    ExeBuilder          = (

        objConfigure,
        objSections,
        messenger

    ) =>
    {

  
///////////////////////////////////////////////////////////
//  _objExe
//
        let     _objExe                 = {
            'exe_buffer':               false,
            'memory_model':             0,
            'segments':                 0,
            'segment_size':             0,
            'header_size':              0,
            'exe_size':                 0,
            'ro_offset':                0,
            'rw_offset':                0,
            'code_offset':              0
        };


        let     __exe_view;


///////////////////////////////////////////////////////////
//  __dump_mem()                                         //
///////////////////////////////////////////////////////////
//
        const   __dump_mem              = (

            mode                        = false

        ) =>
        {

            const   __exe_view          = new DataView(_objExe.exe_buffer);

            const   __ro_offset         = _objExe.ro_offset;
            const   __rw_offset         = _objExe.rw_offset;
            const   __code_offset       = _objExe.code_offset;

            const   __exe_size          = _objExe.exe_size;

            let     __chunk             = 0;
            let     __cols              = 8;

            if (mode === 2)
                __cols = 4;

            for (let exe_offset = __ro_offset; exe_offset < __exe_size; exe_offset++, __chunk++)
            {

                if (exe_offset === __ro_offset)
                {
                    messenger.verbose(`  read-only data map (offset ${__ro_offset}, ${__rw_offset - _objExe.header_size} bytes):`);
                    __chunk = 0;
                }

                if (exe_offset === __rw_offset)
                {
                    messenger.verbose(`\n  read-write data map (offset ${__rw_offset}, ${__code_offset - __rw_offset} bytes):`);
                    __chunk = 0;
                }

                if (exe_offset === __code_offset)
                {
                    messenger.verbose(`\n  code data map (offset ${__code_offset}, ${__exe_size - __code_offset} bytes):`);
                    __chunk = 0;
                }

                if (! (__chunk % __cols))
                    messenger.verbose(`\n   `);

                const   __byte_val = __exe_view.getUint8(exe_offset);

                if (! mode)
                {
                    messenger.verbose(`${__byte_val}`);
                    messenger.verbose('     '.substr(__byte_val.toString().length));
                }
                else
                {
                    messenger.verbose(`${__byte_val.toString(mode)}`);
                    if (mode === 16)
                        messenger.verbose('     '.substr(__byte_val.toString(mode).length));
                    else
                        messenger.verbose('                  '.substr(__byte_val.toString(mode).length));
                }
            }

            messenger.verbose(`\n`);

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

    //  See:
    //
    //      System16/core/defs/Registers.js
    //
    //  And:
    //
    //      System16/core/defs/ExeHeader.js
    //
    //  For more info on the global's used below.
    //
            _objExe.memory_model        = global.S16_MODEL;
            _objExe.header_size         = (global.S16_REGBUF_OFFSET + global.S16_REGBUF_LENGTH);
            _objExe.segments            = global.S16_SEGMENTS_DEFAULT;
            _objExe.maxaddr             = global.S16_MAXADDR_DEFAULT;
            _objExe.ro_offset           = (_objExe.header_size);
            _objExe.rw_offset           = (_objExe.ro_offset + objSections[1].objSection.section_length);
            _objExe.code_offset         = (_objExe.rw_offset + objSections[2].objSection.section_length);
            _objExe.exe_size            = (_objExe.code_offset + objSections[3].objSection.section_length);

            _objExe.exe_buffer          = new ArrayBuffer(_objExe.exe_size);

            __exe_view                  = new DataView(_objExe.exe_buffer);

            messenger.verbose(`Building s16 executable ${objConfigure.exe_out}...\n`);

    //  Generate the header section - see:
    //
    //      System16/core/Header.mjs
    //
            const   __header            = Header(
                                            _objExe, 
                                            messenger
                                        );

    //  Generate the data section - see:
    //
    //      System16/s16l/src/core/MapData.mjs
    //
            const   __mapData           = MapData(
                                            _objExe,
                                            objSections,
                                            messenger
                                        );

    //  Generate the code section - see:
    //
    //      System16/s16l/src/core/MapCode.mjs
    //
            const   __mapCode           = MapCode(
                                            _objExe,
                                            objSections,
                                            messenger
                                        );
        
            __exe_view.setUint32(global.S16_HEADER_MAIN, _objExe.main_offset, global.little_endian);

            messenger.verbose(` Dumping bytecode...\n`);

            __dump_mem(16);

            messenger.verbose(`  Dumped ${_objExe.exe_size - _objExe.header_size} total bytes\n`);

        };


        __initialise();


        return _objExe;

    };

