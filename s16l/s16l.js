///////////////////////////////////////////////////////////
//  System16/s16a/s16l.js                                //
///////////////////////////////////////////////////////////
//
//
//


    import { Controller } from          "./src/Controller.mjs";


    const   Main                        = () =>
    {

        const   _objParameters          =
                                        {
                                            '__collect__':
                                            {
                                                'name':             "obj_files",
                                                'data':             []
                                            },
                                            '--out':
                                            {
                                                'name':             "exe_out",
                                                'data':             "out.s16"
                                            },
                                            '--max':
                                            {
                                                'name':             "include_max",
                                                'data':             0
                                            },
                                            '--byte-order':
                                            {
                                                'name':             "byte_order",
                                                'data':             "big-endian"
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
                                            }
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

