///////////////////////////////////////////////////////////
//  System16/core/Parameters.mjs                         //
///////////////////////////////////////////////////////////
//
//  Processes and sorts command-line options.
//


///////////////////////////////////////////////////////////
//  The Parameters module.                               //
///////////////////////////////////////////////////////////
//
    export const    Parameters          = (

        objConfigure,
        messenger

    ) =>
    {
        
        let     __collect_name          = false;


///////////////////////////////////////////////////////////
//  __default_parameters()                               //
///////////////////////////////////////////////////////////
//
        const   __default_parameters    = () =>
        {

            Object.keys(objConfigure['parameters']).forEach(parameter =>
            {

                if (parameter === '__collect__')
                {
                    if (! Array.isArray(objConfigure['parameters'][parameter].data))
                        messenger.error(`Warning in Parameters.__default_parameters(): The __collect__ data should be an array`);
                    
                    objConfigure['parameters'][parameter].data = [];
                    __collect_name = objConfigure['parameters'][parameter].name;
                }

                objConfigure[objConfigure['parameters'][parameter].name] = objConfigure['parameters'][parameter].data;

            });

        };


///////////////////////////////////////////////////////////
//  __process_option()                                   //
///////////////////////////////////////////////////////////
//
        const   __process_option        = (

            argv,
            argc

        ) =>
        {

    //  Options require the following argument as a
    //  parameter.
    //
            if ((argc + 1) >= argv.length)
                messenger.error(`Error: The ${argv[argc]} option requires a parameter`);

            const   __option_name = objConfigure['parameters'][argv[argc]].name;

            if (typeof objConfigure[__option_name] === 'number')
                objConfigure[__option_name] = parseInt(argv[++argc]);

            else if (Array.isArray(objConfigure[__option_name]))
            {
                const   __argc = argc++;

                while (argc < argv.length)
                {
                    if (argv[argc].substr(0, 1) === '-')
                    {
                        if ((argc - 1) === __argc)
                            messenger.error(`Error: The ${argv[__argc]} option requires at least one parameter`);

                        return --argc;
                    }

                    objConfigure[__option_name].push(argv[argc++]);
                }
            }
            
            else
                objConfigure[__option_name] = argv[++argc];

            return argc;

        };


///////////////////////////////////////////////////////////
//  __process_switch()                                   //
///////////////////////////////////////////////////////////
//
        const   __process_switch        = argv =>
        {

            const   __option_name = objConfigure['parameters'][argv].name;

            objConfigure[__option_name] = (! objConfigure[__option_name]);

        };


///////////////////////////////////////////////////////////
//  __process_parameters()                               //
///////////////////////////////////////////////////////////
//
        const   __process_parameters    = () =>
        {

            const   argv                = process.argv;
            
            for (let argc = 2; argc < argv.length; argc++)
            {

    //  We're looking for any argument that matches one
    //  of the keys in the objConfigure.parameters object.
    //
                if (! objConfigure['parameters'].hasOwnProperty(argv[argc]))
                {
    //  If it's not a recognised option then it's assumed
    //  to be an input file, it's collected.
    //
                    if (! __collect_name)
                        messenger.error(`Unknown option: ${argv[argc]}`);

                    objConfigure[__collect_name].push(argv[argc]);
                    continue;
                }

    //  We know it matches one of the defined parameters,
    //  if argv[argc] has a -- prefix it's assumed to be
    //  an option that requires a parameter:
    //
                else if (argv[argc].substr(0, 2) === '--')
                {
                    argc = __process_option(argv, argc);
                    continue;
                }

    //  Otherwise it's assumed to be a switch that toggles
    //  a boolean value.
    //
                else
                    __process_switch(argv[argc]);

            }

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

    //  objConfigure should have a 'parametes' property
    //  and it should be an object.
    //
            if (! objConfigure.hasOwnProperty('parameters'))
                messenger.error(`Error in Parameters.__initialise(): objConfigure has no 'parameters' property`);

            if (typeof objConfigure['parameters'] !== 'object')
                messenger.error(`Error in Parameters.__initialise(): objConfigure.parameters is not an object`);

            __default_parameters();

            __process_parameters();

        };


        __initialise();


    };
