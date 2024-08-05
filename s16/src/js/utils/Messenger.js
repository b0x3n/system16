///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/utils/Messenger.js           //
///////////////////////////////////////////////////////////
//
//
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


        let     __error_event               = false;
        let     __warning_event             = false;


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
                
            __error_stream(error_message);

            if (__error_event === false)
                return false;

            const   __new_event         = new CustomEvent(
                __error_event,
                {
                    detail: {
                        'type':         'Error',
                        'message':      error_message
                    }
                }
            );

            document.dispatchEvent(__new_event);

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
                __warning_stream(warning_message);

            if (__warning_event === false)
                return false;

            const   __new_event         = new CustomEvent(
                __warning_event,
                {
                    detail: {
                        'type':         'Warning',
                        'message':      warning_message
                    }
                }
            );

            document.dispatchEvent(__new_event);

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
                __verbose_stream(verbose_message);

        };


///////////////////////////////////////////////////////////
//  _error_event()                                       //
///////////////////////////////////////////////////////////
//
//  Set up a custom event handler to be invoked when
//  an error is reported.
//
        const   _error_event            = event_handler =>
        {

            __error_event               = event_handler;

        };


///////////////////////////////////////////////////////////
//  _error_warning()                                     //
///////////////////////////////////////////////////////////
//
//  Set up a custom event handler to be invoked when
//  a warning is reported.
//
        const   _warning_event          = event_handler =>
        {

            __warning_event             = event_handler;

        };


        __initialise();


        return {
        
            error:                      _error,
            warning:                    _warning,
            verbose:                    _verbose,

            error_event:                _error_event,
            warning_event:              _warning_event

        };

    };

