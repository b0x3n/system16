///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/s16.js                       //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  Load utils.                                          //
///////////////////////////////////////////////////////////
//
//  Some simple helper utilities - these aren't part of
//  the s16 system, they're used to do generic things
//  like report errors, load files, etc.
//
    import { Messenger } from           "./../utils/Messenger.js";
    import { LoadFile } from            "./../utils/LoadFile.js";


///////////////////////////////////////////////////////////
//  Import global definitions                            //
///////////////////////////////////////////////////////////
//
//  Strictly speaking, none of these are "global" in the
//  true sense. They're just modules that define values
//  and objects that are used throughout the application.
//
//  These exist to be passed around and used!
//
    import { s16Defs } from             "./defs/s16Defs.js";
    import { s16Sys } from              "./defs/s16Sys.js";
    import { s16Proc } from             "./defs/s16Proc.js";
    import { s16Eval } from             "./defs/s16Eval.js";


///////////////////////////////////////////////////////////
//  Load s16 core modules.                               //
///////////////////////////////////////////////////////////
//
    import { s16Core } from             "./core/s16Core.js";


///////////////////////////////////////////////////////////
//  The s16 module.                                      //
///////////////////////////////////////////////////////////
//
    export const   s16                  = (

        objConfigure                    = {

    ////////////////////////////////////////////////////////
    //  Default error reporting config.
    //
            'report_warnings':          true,
            'exit_on_warnings':         false,
            'be_verbose':               true,

    ///////////////////////////////////////////////////////
    //  Debugger settings.
    //
            'debugger_on':              false,
            'debugger_mode':            false,
    
    ///////////////////////////////////////////////////////
    //  Default system config.
    //
            'max_segments':             16,
            'segment_size':             65536,
            'max_processes':            16,
            
    ///////////////////////////////////////////////////////
    //  Display configuration.
    //
            'font-family':              'vt323, monospace',
            'font-size':                '22px',
            'target-id':                'display',
            'terminal-id':              'terminal',
            'terminal-class':           'terminal',
            'cell-class':               'cell',
            'test-cell':                'test_cell',
            'color':                    'rgba(132, 240, 160, 1)',
            'flicker':                  true,
            'blink':                    1000,

        }

    ) =>
    {


        const   __messenger             = Messenger(
                                            objConfigure
                                        );

        let     __s16_core              = false;


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
//  Not much happening, some initial setup and load the
//  boot exe before the core controller module (s16Core)
//  is initialised.
//
        const   __initialise            = () =>
        {

    ///////////////////////////////////////////////////////
    //  Make the objConfigure object globally available.
    //
            window.__s16Config          = objConfigure;

    ///////////////////////////////////////////////////////
    //  The objects loaded from:
    //
    //      System16/src/js/s16/defs/
    //
    //  Are made global.
    //
            window.__s16Defs            = s16Defs;
            window.__s16Sys             = s16Sys;
            window.__s16Proc            = s16Proc;
            window.__s16Eval            = s16Eval;

    ///////////////////////////////////////////////////////
    //  The Messenger error, warning and verbose methods
    //  are made globally available.
    //
            window.__s16_error          = __messenger.error;
            window.__s16_warning        = __messenger.warning;
            window.__s16_verbose        = __messenger.verbose;

            window.__s16_verbose(`Attempting to load boot exe from ${window.s16_boot_url}...\n`);

    ///////////////////////////////////////////////////////
    //  Set event handlers for error and warning, see the
    //  Messenger utility:
    //
    //      System16/src/js/s16/utils/Messenger.js
    //
            window.__s16_got_error      = objError =>
            {
    //  A non-recoverable error - this terminates the
    //  system.
    //
                s16Sys.S16_SYSTEM_ERROR = objError.detail.message;
                s16Sys.S16_SYSTEM_RUN = false;
            };

            window.__s16_got_warning    = objWarning =>
            {
                if (window.__s16Config.hasOwnProperty('exit_on_warnings'))
                {
                    s16Sys.S16_SYSTEM_WARNING = objWarning.detail.message;

    //  If exit_on_warnings is true then a warning is
    //  treated the same as a fatal error.
    //
                    if (window.__s16Config['exit_on_warnings'] === true)
                        s16Sys.S16_SYSTEM_RUN = false;
                }
            }

    //  Set up the event handlers and notify __messneger.
    //
            document.addEventListener(s16Defs.S16_ERROR_MSG, window.__s16_got_error);
            document.addEventListener(s16Defs.S16_WARNING_MSG, window.__s16_got_warning);

            __messenger.error_event(s16Defs.S16_ERROR_MSG);
            __messenger.warning_event(s16Defs.S16_WARNING_MSG);

    //  The boot process must be loaded for execution, the
    //  LoadFile module is used to grab the file from the
    //  server...without this we can't proceed.
    //
    //  The index.html will define:
    //
    //      window.s16_boot_url
    //
    //  Giving us the URL we need to grab the data.
    //
            const __objExe              = LoadFile(
                window.s16_boot_url,
                __s16_boot,
                __s16_boot_fail
            );

        };


///////////////////////////////////////////////////////////
//  __s16_boot()                                         //
///////////////////////////////////////////////////////////
//
        const   __s16_boot              = objExe =>
        {
            
            window.__s16_verbose(`Got exe data, ${objExe.exe_data.byteLength} bytes`);

            window.__s16Sys.exe_path    = objExe.exe_path;
            window.__s16Sys.exe_data    = objExe.exe_data;

    //  We have an executable, the s16Core module can
    //  now be initialised and will take over from here.
    //
            __s16_core                  = s16Core()

        };


///////////////////////////////////////////////////////////
//  __s16_boot_fail()                                    //
///////////////////////////////////////////////////////////
//
        const   __s16_boot_fail         = error_msg =>
        {

            window.__s16_error(`There was an error fetching the file ${window.s16_boot_url}:`, error_msg);

        };


        __initialise();

    };

