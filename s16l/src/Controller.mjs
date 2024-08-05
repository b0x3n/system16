///////////////////////////////////////////////////////////
//  System16/s16l/src/Controller.mjs                     //
///////////////////////////////////////////////////////////
//
//
//

    global.__s16_linker_mode            = true;


///////////////////////////////////////////////////////////
//  If this is false we use big-endian byte-ordering, we
//  can specify --byte-order 'little-endian' at the
//  command line to set this to true.
//
    global.little_endian                = false;


    import * as GlobalRegisters from    "../../core/defs/Registers.js";
    import * as GlobalMnemonics from    "../../core/defs/Mnemonics.js";


///////////////////////////////////////////////////////////
//  Import shared modules from System16/core/
//
    import { Messenger } from           "./../../core/Messenger.mjs";
    import { Parameters } from          "./../../core/Parameters.mjs";


///////////////////////////////////////////////////////////
//  Import s16l modules from:
//
//      System16/s16l/src/core/
//
    import { Linker } from              "./core/Linker.mjs";


///////////////////////////////////////////////////////////
//  The Controller module                                //
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


        const   __linker                = Linker(
                                            objConfigure,
                                            __messenger
                                        );


        let     __obj_files;


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            if (objConfigure.obj_files.length === 0)
                __messenger.error(`Error: No input files`);

            if (! objConfigure.hasOwnProperty('byte_order'))
                objConfigure['byte_order'] = "big-endian";
            // else
            // {
            //    if (objConfigure['byte_order'] !== 'big-endian' && objConfigure['byte_order'] !== 'little-endian')
            // }

            if (objConfigure['byte_order'] === 'big-endian')
                global.little_endian = false;
            else if (objConfigure['byte_order'] === 'little-endian')
                global.little_endian = true;
            else
                __messenger.error(`Error - '${objConfigure['byte_order']} is not a valid parameter for the --byte-order option`);

            __obj_files = objConfigure.obj_files;

            __messenger.verbose(`Linking ${__obj_files.length} object files...\n`);

            __linker.link(__obj_files);

            __messenger.verbose(`Done.`);
        
        };


        __initialise();


    };

