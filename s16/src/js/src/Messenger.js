///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/Messenger.js                 //
///////////////////////////////////////////////////////////
//
//  Basic routines for managing errors/warnings and
//  verbose output.
//


///////////////////////////////////////////////////////////
//  The Messenger module.                                //
///////////////////////////////////////////////////////////
//
    export const    Messenger           = (

        objConfigure

    ) =>
    {


///////////////////////////////////////////////////////////
//  Default output streams for the _error(), _warning()
//  and _verbose() methods.
//
        const   DEFAULT_ERROR_STREAM        = console.error;
        const   DEFAULT_WARNING_STREAM      = console.error;
        const   DEFAULT_VERBOSE_STREAM      = console.log;


///////////////////////////////////////////////////////////
//  Output streams.
//
        let     __error_stream              = DEFAULT_ERROR_STREAM;
        let     __warning_stream            = DEFAULT_WARNING_STREAM;
        let     __verbose_stream            = DEFAULT_VERBOSE_STREAM;


///////////////////////////////////////////////////////////
//  __check_option()                                     //
///////////////////////////////////////////////////////////
//
//  Checks if option_name is set in objConfigure, if
//  it doesn't exist then it sets it with default_value.
//
        const   __check_option          = (

            option_name,
            default_value

        ) =>
        {

            if (! objConfigure.hasOwnProperty(option_name))
                objConfigure[option_name] = default_value;

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

    //  Set any options not set in objConfigure with
    //  default values.
    //
            __check_option('report_warnings', true);
            __check_option('exit_on_warnings', true);
            __check_option('be_verbose', true);

            // __check_option('error_stream', DEFAULT_ERROR_STREAM);
            // __check_option('warning_stream', DEFAULT_WARNING_STREAM);
            // __check_option('verbose_stream', DEFAULT_VERBOSE_STREAM);

    //  Set the output streams.
    //
            if (objConfigure.hasOwnProperty('error_stream'))
                __error_stream = objConfigure.error_stream;
            if (objConfigure.hasOwnProperty('warningstream'))
                __warning_stream = objConfigure.warning_stream;
            if (objConfigure.hasOwnProperty('verbose_stream'))
                __verbose_stream = objConfigure.verbose_stream;

        };


///////////////////////////////////////////////////////////
//  _error()                                             //
///////////////////////////////////////////////////////////
//
//  Errors are always dumped to the __error_stream and
//  the process will terminate.
//
        const   _error                  = error_message =>
        {

            // if (__error_stream === process.stdout || __error_stream === process.stderr)
            //     __error_stream.write(error_message);
            // else
                __error_stream(error_message);

            //process.exit(1);

            return false;

        };


///////////////////////////////////////////////////////////
//  _warning()                                           //
///////////////////////////////////////////////////////////
//
//  Warnings are only reported if the report_warnings
//  property of objConfgure is set to true.
//
//  If exit_on_warnings is set to true, the process will
//  exit only if report_warnings is also true - we don't
//  want to terminate and leave the user guessing.
//
        const   _warning                = warning_message =>
        {

            if (objConfigure.report_warnings)
            {
                // if (__warning_stream === process.stdout || __warning_stream === process.stderr)
                //     __warning_stream.write(warning_message);
                // else
                    __warning_stream(warning_message);

                // if (objConfigure.exit_on_warnings)
                //     process.exit(1);
            }

            return false;

        };


///////////////////////////////////////////////////////////
//  _verbose()                                           //
///////////////////////////////////////////////////////////
//
//  Only outputs is objConfigure.be_verbose is true, 
//  never exits.
//
        const   _verbose                = verbose_message =>
        {

            if (objConfigure.be_verbose)
            {
                // if (__verbose_stream === process.stdout || __verbose_stream === process.stderr)
                //     __verbose_stream.write(verbose_message);
                // else
                    __verbose_stream(verbose_message);
            }

        };


///////////////////////////////////////////////////////////
//  _file_error()                                        //
///////////////////////////////////////////////////////////
//
//  This is used by the s16a and s16l applications to
//  report file errors.
//
//  See:
//
//      System16/s16a/src/core/Tokeniser.mjs
//
//  For information about tokens.
//
//  In this case all we care about are tokens[0] and
//  tokens[1] which contain the absolute path to a file
//  and a line number, respectively.
//
        // const   _file_error             = (

        //     tokens,
        //     error_message

        // ) =>
        // {

        //     _error(`Error in file ${tokens[0]}, line ${tokens[1]}: ${error_message}`);

        // };


        __initialise();


        return {
        
            error:                      _error,
            warning:                    _warning,
            verbose:                    _verbose

        };

    };

