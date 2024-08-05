///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/dev/s16Keyboard.js           //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The s16Keyboard module.                              //
///////////////////////////////////////////////////////////
//
    export const    s16Keyboard         = () =>
    {


        const   objConfigure            = window.__s16Config;

        let     __s16Process            = false;

        let     __get_reg               = false;
        let     __set_reg               = false;


        let     __keyval                = false;


        const   _initialise             = (
        ) =>
        {

            window.__s16HasFocus        = false;


            $(`.${objConfigure['cell-class']}`).on('mouseenter', () => {

                window.__s16HasFocus   = true;

            });

            $(`.${objConfigure['cell-class']}`).on('mouseleave', () => {

                window.__s16HasFocus   = false;

            });

            window.addEventListener('keypress', event => {
                
                if (! __s16Process || __s16Process.status !== window.__s16Proc.S16_STATUS_BLOCKING)
                    return;
                
                // if (! $('.cell').is(':focus'))
                //     return;

                if (! window.__s16HasFocus)
                    return;

                event.preventDefault();

                let     __key           = event.key;

    //  Disable the WAIT bit in FL - this will
    //  allow the system to resume execution.
    //
                __s16Process.status     = window.__s16Proc.S16_STATUS_RUNNING;

                if (__key === 'Enter')
                {
                    __key = 13;
                //    ram_view.setUint8(window.S16_REG['FX'], __key, window.little_endian);
                    __set_reg(
                        __s16Process.code_segment,
                        'FX',
                        __key
                    );
                }
                else
                    //ram_view.setUint8(window.S16_REG['FX'], __key.charCodeAt(0), window.little_endian);
                    __set_reg(
                        __s16Process.code_segment,
                        'FX',
                        __key.charCodeAt(0)
                    );

            });

        };
        

///////////////////////////////////////////////////////////
//  _interrupt()                                         //
///////////////////////////////////////////////////////////
//
        const   _interrupt              = (

            s16Process,
            read_ram,
            write_ram,
            get_reg,
            set_reg

        ) =>
        {

            ///alert('KEYBOARD')
            
            if (! __s16Process)
            {
                __s16Process            = s16Process;
                __get_reg               = get_reg;
                __set_reg               = set_reg;
            }

    //  The instruction is at FX:
    //
            const   __instruction       = read_ram(
                s16Process.code_segment,
                window.S16_REG['FX'],
                1
            );
            
            window.__s16_verbose(`Keyboard interrupted with instruction = ${__instruction}...`);

    //  1 is a getchar - the next byte of input will
    //  be returned in AX.
    //
            if (__instruction === 1)
                s16Process.status = window.__s16Proc.S16_STATUS_BLOCKING;

        };


        _initialise();


        return {

            initialise:                 _initialise,
            interrupt:                  _interrupt

        };

    };

