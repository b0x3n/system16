///////////////////////////////////////////////////////////
//  System16/s16l/src/core/MapData.mjs                   //
///////////////////////////////////////////////////////////
//
//
//


    import * as GlobalMemtypes from     "../../../core/defs/Memtypes.js";


    import { Translator } from          "./Translator.mjs";


///////////////////////////////////////////////////////////
//  The MapData module.                                  //
///////////////////////////////////////////////////////////
//
    export const    MapData             = (

        objExe,
        objSections,
        messenger

    ) =>
    {


        const   __translator            = Translator(
                                            objExe,
                                            objSections,
                                            messenger
                                        );


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            let     __data_offset       = objExe.ro_offset;
            const   __data_view         = new DataView(objExe.exe_buffer);

            messenger.verbose(` Mapping ro (read-only) section)...\n`);

            for (let section_no = 1; section_no < 3; section_no++)
            {

                if (section_no === 2)
                {
                    messenger.verbose(` Done.\n`)
                    messenger.verbose(` Mapping rw (read-write) section)...\n`);
                }

                const   _section        = objSections[section_no].objSection;

                _section.offsets    = [];

                _section.label.forEach((label, index) => {

                    const   __path      = _section.path[index];
                    const   __line      = _section.line[index];
                    const   __type      = _section.type[index];
                    const   __size      = _section.size[index];
                    const   __data      = _section.data[index];
                    const   __length    = _section.length[index];

                    let     __start_offset;

                    _section.offsets.push(__data_offset);

                    for (let param_no = 0; param_no < __data.length; param_no++)
                    {

                        if (! param_no)
                            __start_offset = __data_offset;

                        if (typeof __data[param_no] === 'string' && ! /^[0-9]+$/.test(__data[param_no]))
                        {
                            const   __tokens = [ __path, __line, __data[param_no] ];

                            __translator.translate_token(
                                __tokens,
                                2
                            );

                            __data[param_no] = __tokens[2]
                        }

                        if (__type === global.S16_MEMTYPE_M8)
                        {
                            __data_view.setUint8(__data_offset, __data[param_no]);
                            __data_offset += 1;
                        }
                        else if (__type === global.S16_MEMTYPE_M16)
                        {
                            __data_view.setUint16(__data_offset, __data[param_no], global.little_endian);
                            __data_offset += 2;
                            continue;
                        }
                        else
                        {
                            __data_view.setUint32(__data_offset, __data[param_no], global.little_endian);
                            __data_offset += 4;
                            continue;
                        }

                    }
                    
                    messenger.verbose(`   Wrote ${__type} ${label}[${__size}] (${__length} bytes): ${__data} @ offset ${__start_offset}\n`);

                });

            }

            messenger.verbose(` Done.\n`);

        };


        __initialise();

    };

