///////////////////////////////////////////////////////////
//  System16/s16l/src/core/Linker.mjs                    //
///////////////////////////////////////////////////////////
//
//
//


    import * as fs from                 'fs';


    import * as GlobalSections from     "./../../../core/defs/Sections.js";
    import * as GlobalExeHeader from    "./../../../core/defs/ExeHeader.js";


///////////////////////////////////////////////////////////
//  Import required modules from:
//
//      System16/core/
//
    import { LoadFile } from            "./../../../core/LoadFile.mjs";
    import { Merger } from              "./../../../core/Merger.mjs";
    import { Section } from             "./../../../core/Section.mjs";


///////////////////////////////////////////////////////////
//  Import s16l modules from:
//
//      System16/s16l/src/core/
//
    import { ExeBuilder } from          "./ExeBuilder.mjs";

    import { Registers } from           "./Registers.js";


///////////////////////////////////////////////////////////
//  The Linker module.                                   //
///////////////////////////////////////////////////////////
//
    export const    Linker              = (

        objConfigure,
        messenger

    ) =>
    {


        let     _total_length           = 0;
        let     _total_entries          = 0;


        const   __sect                  = global.S16A_SECTION;


        const   __objSections           = [];


        const   __merger                = Merger(
                                            objConfigure,
                                            messenger
                                        );


        let     _objExe                 = {};


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            __objSections[__sect('header')] = [];
            __objSections[__sect('ro')]     = Section();
            __objSections[__sect('rw')]     = Section();
            __objSections[__sect('code')]   = Section();
            __objSections[__sect('env')]    = Section();

        };


///////////////////////////////////////////////////////////
//  __dump_file_info()                                   //
///////////////////////////////////////////////////////////
//
        const   __dump_file_info        = (
            
            objFileInfo,
            objSections
        
        ) =>
        {

            let     __total_entries     = 0
            let     __total_length      = 0;

            messenger.verbose(`  File ${objFileInfo.path}:\n`);

            for (let section_no = 1; section_no < 5; section_no++)
            {
                const   __section_name  = global.S16A_SECTIONS[section_no];

                const   __entries       = objSections[section_no].objSection.label.length;
                const   __length        = objSections[section_no].objSection.section_length;

                let     __pad           = '     ';

                messenger.verbose(`   Section ${__section_name}:`);

                if (section_no === 4)
                    __pad += ' ';

                if (section_no > 0 && section_no < 3)
                    __pad += '  ';

                __total_length += __length;
                __total_entries += __entries;
    
                messenger.verbose(`${__pad}${__entries} total entries, ${__length} total bytes\n`);
            }

            _total_length += __total_length;
            _total_entries += __total_entries;

            messenger.verbose(`  ${objFileInfo.path}: ${__total_entries} total entries, ${__total_length} bytes\n`)

        };


///////////////////////////////////////////////////////////
//  __check_exe_size()                                   //
///////////////////////////////////////////////////////////
//
        const   __check_exe_size        = () =>
        {

            if (_objExe.exe_buffer.byteLength % 2)
            {
                let     __newbuf        = new ArrayBuffer(_objExe.exe_buffer.byteLength + 1);
                let     __src           = new DataView(_objExe.exe_buffer);
                let     __dst           = new DataView(__newbuf);

                let     __byte_no;

                for (__byte_no = 0; __byte_no < _objExe.exe_size; __byte_no++)
                    __dst.setUint8(__byte_no, __src.getUint8(__byte_no));
                __dst.setUint8(__byte_no, 0);

                _objExe.exe_buffer      = __newbuf;
            }

        };


///////////////////////////////////////////////////////////
//  __set_header_options()                               //
///////////////////////////////////////////////////////////
//
        const   __set_header_options    = () =>
        {

            let     __mode              = __objSections[0].label.indexOf('mode');
            let     __model             = __objSections[0].label.indexOf('model');
            let     __segments          = __objSections[0].label.indexOf('segments');
            let     __maxaddr           = __objSections[0].label.indexOf('maxaddr');

            if (__mode >= 0)
                global.__s16_mode       = __objSections[0].data[__mode];
            if (__model >= 0)
                global.__s16_model      = __objSections[0].data[__model];
            if (__segments >= 0)
                global.__s16_segments   = __objSections[0].data[__segments];
            if (__maxaddr >= 0)
                global.__s16_maxaddr    = __objSections[0].data[__maxaddr];

        };


///////////////////////////////////////////////////////////
//  _link()                                              //
///////////////////////////////////////////////////////////
//
        const   _link                   = obj_files =>
        {

            for (let file_no = 0; file_no < obj_files.length; file_no++)
            {

                const   _obj_file       = obj_files[file_no];

                messenger.verbose(` Loading file ${_obj_file}...\n`);
                
                const   _objFileInfo    = LoadFile(
                                            _obj_file,
                                            messenger
                                        );

                if (typeof _objFileInfo === 'string')
                    messenger.error(_objFileInfo);

                const   __objSrc        = JSON.parse(_objFileInfo.data)

                if (objConfigure.be_verbose)
                    __dump_file_info(
                        _objFileInfo,
                        __objSrc
                    );

                __merger.merge_sections(
                    __objSections,
                    __objSrc
                );

            }

            __set_header_options();

            if (obj_files.length > 1)
                messenger.verbose(` Merged ${obj_files.length} object files: ${_total_entries} total entries, ${_total_length} total bytes\n`)
            else
                messenger.verbose(` Nothing to merge...\n`);
            
            _objExe                     = ExeBuilder(
                                            objConfigure,
                                            __objSections,
                                            messenger
                                        );

            messenger.verbose(` s16 executable linked successfully:\n`);
            
            if (global.little_endian === true)
                messenger.verbose(`  Byte order: little-endian\n`);
            else
                messenger.verbose(`  Byte order: big-endian\n`);

            messenger.verbose(`  File size: ${_objExe.exe_buffer.byteLength} bytes\n`);
            messenger.verbose(`  Writing file: ${objConfigure.exe_out}\n`);


    ///////////////////////////////////////////////////////
    //  Populate the registers in the header before
    //  the write.
    //
            const   __registers         = Registers(_objExe);
            
            function ab2str(buf) {
                return String.fromCharCode.apply(null, new Uint16Array(buf));
            }

            __check_exe_size();
              
            const   __str = ab2str(_objExe.exe_buffer);

            fs.writeFileSync(objConfigure.exe_out, __str);

            messenger.verbose(` Exe written successfully\n`);

        };


        __initialise();


        return {

            link:                       _link,

            objExe:                     _objExe

        };

    };

