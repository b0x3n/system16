///////////////////////////////////////////////////////////
//  System16/s16a/s16a.js                                //
///////////////////////////////////////////////////////////
//
//  Nothing much happens here - the main Controller
//  module is loaded and initialised, it manages
//  everything from here.
//


    import { Controller } from          "./src/Controller.mjs";


    const   Main                        = () =>
    {

        const   _objParameters          =
                                        {
                                            '--asm':
                                            {
                                                'name':             "asm_files",
                                                'data':             []
                                            },
                                            '--obj':
                                            {
                                                'name':             "obj_files",
                                                'data':             []
                                            },
                                            '--out':
                                            {
                                                'name':             "obj_out",
                                                'data':             "s16a.obj"
                                            },
                                            '--depth':
                                            {
                                                'name':             "include_depth",
                                                'data':             0
                                            },
                                            '--max':
                                            {
                                                'name':             "include_max",
                                                'data':             0
                                            },

                                            '-v':
                                            {
                                                'name':             'be_verbose',
                                                'data':             true
                                            },
                                            '-w':
                                            {
                                                'name':             'report_warnings',
                                                'data':             true
                                            },
                                            '-x':
                                            {
                                                'name':             'exit_on_warnings',
                                                'data':             false
                                            },
                                        };


        const   __controller            = Controller(
                                            {
                                                'report_warnings':  _objParameters['report_warnings'],
                                                'exit_on_warnings': _objParameters['exit_on_warnings'],
                                                'be_verbose':       _objParameters['be_verbose'],

                                                'parameters':       _objParameters
                                            }
                                        );

    };


    Main();

