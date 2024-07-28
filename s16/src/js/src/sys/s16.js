///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/s16/js                   //
///////////////////////////////////////////////////////////
//
//
//

    import * as GlobalHeader from       "../sys/dev/defs/ExeHeader.js";
    import * as GlobalRegisters from    "../sys/dev/defs/Registers.js";
    import * as GlobalMnemonics from    "../sys/dev/defs/Mnemonics.js";


    import { Messenger } from           "./../Messenger.js";


    import { CPU } from                 "./dev/CPU.js";
    import { RAM } from                 "./dev/RAM.js";
    import { Display } from             "./dev/Display.js";
    import { Keyboard } from            "./dev/Keyboard.js";


    import { Loader } from              "./dev/core/Loader.js";


///////////////////////////////////////////////////////////
//  The s16 module.                                      //
///////////////////////////////////////////////////////////
//
    export const    s16                 = (

        objConfigure                    = {
        
///////////////////////////////////////////////////////////
//  Terminal configuration.
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

            'debug':                    false,
            'be_verbose':               true

        
        }

    ) =>
    {

        const   __messenger             = Messenger(objConfigure);


        __messenger.verbose(`s16 initialising...`);


        const   __ram                   = RAM(
                                            objConfigure,
                                            __messenger
                                        );


        const   __display               = Display(
                                            objConfigure,
                                            __messenger
                                        );


        let     __keyboard              = Keyboard(
                                            objConfigure,
                                            __messenger
                                        );


        const   __loader                = Loader(
                                            objConfigure,
                                            __messenger,
                                            __ram
                                        );


        let     _segment                = 0;


        let     _process                = CPU(
                                            objConfigure,
                                            [
                                                __ram,
                                                __display,
                                                __keyboard
                                            ],
                                            __messenger,
                                            __ram
                                        );


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

    //  Initialise the "devices", see:
    //
    //      System16/s16/src/js/src/sys/dev/
    //
            __ram.initialise_ram(16, 0xFFFF);
            __display.initialise_display();
        
            __messenger.verbose(`s16 ready, attempting to load exe...`);

            __loader.load_file(
                window.s16_exe_path,
                function (data) 
                {
    //  Boot - load the executable into segment
    //  0 of RAM.
    //
                    __messenger.verbose(` Loaded s16 executable (${data.byteLength} bytes): ` + data);
                    __loader.load_exe(
                        data,
                        0
                    );

    //  TODO: Header check
    //
                    _process.run(0);

                },
                function (err)
                {
                    console.log(`error: ` + err.error.msg());
                }
            );

        };


        __initialise();


        return {

        };

    };

