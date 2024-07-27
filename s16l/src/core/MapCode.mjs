///////////////////////////////////////////////////////////
//  System16/s16l/src/core/MapCode.mjs                   //
///////////////////////////////////////////////////////////
//
//
//


    import { Translator } from          "./Translator.mjs";


///////////////////////////////////////////////////////////
//  The MapCode module.                                  //
///////////////////////////////////////////////////////////
//
    export const    MapCode             = (

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


        let     __code_offset           = objExe.code_offset;


        const   __dst_view              = new DataView(objExe.exe_buffer);


///////////////////////////////////////////////////////////
//  __map_function()                                     //
///////////////////////////////////////////////////////////
//
        const   __map_function          = index =>
        {

            const   __section           = objSections[3].objSection;

            const   __label             = __section.label[index];
            const   __path              = __section.path[index];
            const   __line              = __section.line[index];
            const   __mode              = __section.mode[index];
            const   __type              = __section.type[index];
            const   __size              = __section.size[index];
            const   __data              = __section.data[index].data;

            let     __start_offset      = __code_offset;
            let     __line_offset;

            let     line_no             = 0;

            if (__label === "_main")
                objExe.main_offset = __code_offset;
                //console.log(`--- SET MAIN OFFSET: ${objExe.main_offset}`);
                
            // console.log(__data);
            // process.exit();

            messenger.verbose(`  Mapping function ${__label}:\n`);

            for (line_no = 0; line_no < __data.length; line_no++)
            {
                const   __tokens        = __data[line_no];
                let     __line_size     = 2;

                __line_offset           = __code_offset;

                if (__tokens.length < 3)
                    continue;

    //  We need the opcode...
    //
                let     __opcode        = __tokens[2];

                if (__opcode === 0)
                    break;

                messenger.verbose(`   ${global.S16_MNEMONIC_BY_OPCODE(__opcode).mnemonic} (${__opcode.toString(2)})`);
                    
    //  All opcodes are 2-byte values - the 4 most
    //  significant bits are modifiers, see:
    //
    //      System16/core/defs/Mnemonics.js
    //
    //  For more info.
    //
                for (let token_no = 3, param_no = 0; token_no < __tokens.length; token_no++, param_no++)
                {

                    let __operand       = __tokens[token_no];
                    let __modifier      = '';

                    if (__operand.substr(0, 1) === '#' || __operand.substr(0, 1) === '%')
                    {
                        __tokens[token_no] = __tokens[token_no].substr(1);
                        __modifier = __operand.substr(0, 1);
                        __operand = __operand.substr(1);
                    }
                    
                    if (typeof __operand === 'string')
                    {

                        __translator.translate_token(__tokens, token_no);

                        if (__modifier === global.S16_ADDRMODE_INDIRECT)
                        {
                            __opcode |= global.S16_MOD_INDIRECT[param_no];
                            __operand = __operand.substr(1);
                        }

                        if (__modifier === global.S16_ADDRMODE_LITERAL)
                        {
                            __opcode |= global.S16_MOD_LITERAL[param_no];
                            __operand = __operand.substr(1);
                        }

                    }

                    messenger.verbose(` ${__modifier}${__tokens[token_no]}`);

                }

                const   _objMnemonic    = global.S16_MNEMONIC_BY_OPCODE(__tokens[2]);

                if (_objMnemonic === false)
                    messenger.file_error(__tokens, `Unknown opcode '${__tokens[2]}'`);

                if ((__tokens.length - 3) != _objMnemonic.params.length)
                    messenger.file_error(__tokens, `${__tokens.length} The ${_objMnemonic.mnemonic} requires exactly ${_objMnemonic.params.length} parameters - ${__tokens}`);
            
                __dst_view.setUint16(__code_offset, __opcode, global.little_endian);
                __code_offset += 2;

                for (let param_no = 0; param_no < _objMnemonic.params.length; param_no++)
                {

                    if (typeof __tokens[(param_no + 3)] === 'string')
                        __translator.translate_token(__tokens, (param_no + 3));


                    if (_objMnemonic.params[param_no] === 1)
                    {
                        __dst_view.setUint8(__code_offset++, __tokens[(param_no + 3)])
                        __line_size++;
                    }
                    else if (_objMnemonic.params[param_no] === 2)
                    {
                        __dst_view.setUint16(__code_offset, __tokens[(param_no + 3)], global.little_endian);
                        __code_offset += 2;
                        __line_size += 2;
                    }
                    else if (_objMnemonic.params[param_no] === 4)
                    {
                        __dst_view.setUint32(__code_offset, __tokens[(param_no + 3)], global.little_endian);
                        __code_offset += 4;
                        __line_size += 4;
                    }

                }

                messenger.verbose(` (${__line_size} bytes) @ offset ${__line_offset} (modified opcode ${__opcode.toString(2)})\n`);

            }

            __dst_view.setUint16(__code_offset, 0, global.little_endian);
            __code_offset += 2;

            messenger.verbose(`   end (0) 2 bytes @ offset ${__line_offset}\n  Done mapping ${__label}, ${line_no} total lines, ${__code_offset - __start_offset} total bytes @ offset ${__start_offset}.\n`);

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            // console.log(objSections[1].objSection);
            // console.log(objSections[2].objSection);
            // console.log(objSections[3].objSection);

            const   __dst_view          = new DataView(objExe.exe_buffer);

            messenger.verbose(` Mapping code section...\n`);

            const   __section           = objSections[3].objSection;

    //  Ensure we have a _main function, this is the main
    //  entry point and will be processed first so that
    //  the code offset in the header points to _main.
    //
            const   __main_index        = __section.label.indexOf('_main');
            
            if (__main_index < 0)
                messenger.error(`Error: No _main function exists`);

            __map_function(__main_index);

    //  Map the remaining functions.
    //
            __section.label.forEach((label, index) => {

                if (label === '_main')
                    return;

                __map_function(index);

            });

            // console.log(`\n);`)
            // console.log(objSections[3].objSection.data[1].data);

            messenger.verbose(` Done.\n`);

        };



        __initialise();

    };

