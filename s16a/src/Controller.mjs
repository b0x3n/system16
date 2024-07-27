///////////////////////////////////////////////////////////
//  System16/s16a/src/Controller.mjs                     //
///////////////////////////////////////////////////////////
//
//
//


    import * as fs from                 'fs';


///////////////////////////////////////////////////////////
//  Import shared modules from System16/core/
//
    import { Messenger } from           "./../../core/Messenger.mjs";
    import { Parameters } from          "./../../core/Parameters.mjs";
    import { Merger } from              "./../../core//Merger.mjs";


///////////////////////////////////////////////////////////
//  Import s16a modules from System16/s16a/src/core/
// 
    import { Preprocessor } from        "./core/Preprocessor.mjs";


///////////////////////////////////////////////////////////
//  The main Controller module.                          //
///////////////////////////////////////////////////////////
//
    export const    Controller          = (

        objConfigure

    ) =>
    {

    
///////////////////////////////////////////////////////////
//  The Messenger module manages output - this
//  includes errors, warnings and verbose, see:
//
//      System16/core/Messenger.mjs
//
//  For more info.
//
        const   __messenger             = Messenger(
                                            objConfigure
                                        );


///////////////////////////////////////////////////////////
//  The Parameters module will manage and process the
//  command-line arguments, returning an object, see:
//
//      System16/core/Parameters.mjs
//
//  For more info.
//
        const   __parameters            = Parameters(
                                            objConfigure,
                                            __messenger
                                        );


///////////////////////////////////////////////////////////
//  The Preprocessor module - this will generate object
//  files, see:
//
//      System16/s16a/src/core/Preprocessor.mjs
//
//  For more information.
//
//  In simple terms, this module preprocesses and
//  assembles the code into an object (objSections)
//  which it returns a handle to.
//
        const   __preprocessor          = Preprocessor(
                                            objConfigure,
                                            __messenger
                                        );


///////////////////////////////////////////////////////////
//  
        const   __merger                = Merger(
                                            objConfigure,
                                            __messenger
                                        );


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

    //  Make sure we have something to assemble/merge.
    //  
            if (! objConfigure.asm_files.length)
            {
                if (! objConfigure.obj_files.length)
                    __messenger.error(`Error: No input files`);
                if (objConfigure.obj_files.length === 1)
                    __messenger.error(`Error: Attempt to merge a single object file`);
            }
            
            if (objConfigure.asm_files.length)
                __preprocessor.preprocess();

    //  The Preprocessor returns objSections - this contains
    //  all of the input files with their individual sections
    //  assembled and preprocessed:
    //
    //      _objSections[0].objSection      - Header data
    //      _objSections[1].objSection      - Read-only data
    //      _objSections[2].objSection      - Read-write data
    //      _objSections[3].objSection      - Code section
    //      _objSections[4].objSection      - Env section
    //
    //  If we have any --obj input files these can now be
    //  loaded and merged with the data in _objSections.
    //

            if (objConfigure.obj_files.length)
                __merger.merge(
                    __preprocessor.objSections,
                    objConfigure.asm_files,
                    objConfigure.obj_files
                );

            let     __total_size        = 0;

            __messenger.verbose(` Assembled object:\n`);
            __messenger.verbose(`  Header:           ${__preprocessor.objSections[0].length} total entries.\n`);
           
            for (let section_no = 1; section_no < 5; section_no++)
            {
                const   __section_name  = global.S16A_SECTIONS[section_no];

                const   __entries       = __preprocessor.objSections[section_no].objSection.label.length;
                const   __length        = __preprocessor.objSections[section_no].objSection.section_length;

                let     __pad           = '     ';

                __messenger.verbose(`  Section ${__section_name}:`);

                if (section_no === 4)
                    __pad += ' ';

                if (section_no > 0 && section_no < 3)
                    __pad += '  ';

                __total_size += __length;

                __messenger.verbose(`${__pad}${__entries} total entries, ${__length} total bytes\n`);
            }

            const   _objectOut = JSON.stringify(__preprocessor.objSections);
            
            __messenger.verbose(` Total code size: ${__total_size} bytes, total object file size: ${_objectOut.length}\n`);
            __messenger.verbose(` Writing object file ${objConfigure.obj_out}...\n`);

            fs.writeFileSync(
                objConfigure.obj_out,
                _objectOut
            );

            __messenger.verbose(`Done.\n`);

        };


        __initialise();


    };

