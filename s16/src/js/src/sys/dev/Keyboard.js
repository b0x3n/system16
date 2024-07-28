///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/Keyboard.js          //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The Keyboard module.                                 //
///////////////////////////////////////////////////////////
//
    export const    Keyboard            = (

        objConfigure,
        messenger,
        get_reg                         = false,
        set_reg                         = false

    ) =>
    {


        let     __keyval                = false;


        const   _initialise             = (

            ram_view,
            _get_reg,
            _set_reg

        ) =>
        {

            get_reg                     = _get_reg;
            set_reg                     = _set_reg;

            window.addEventListener('keypress', event => {

                if (! window.console_enabled)
                    return;

                event.preventDefault();

                let     __flags         = get_reg('FL');
                let     __key           = event.key;

    //  Disable the stop bit in FL - this will
    //  allow the system to resume execution.
    //
                __flags = __flags & (~0b00000100);

                if (__key === 'Enter')
                {
                    __key = 13;
                    ram_view.setUint8(window.S16_REG['FX'], __key, window.little_endian);
                }
                else
                    ram_view.setUint8(window.S16_REG['FX'], __key.charCodeAt(0), window.little_endian);
                
                set_reg('FL', __flags);
            });

        };
        

///////////////////////////////////////////////////////////
//  _interrupt()                                         //
///////////////////////////////////////////////////////////
//
        const   _interrupt              = (

            ram,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(ram.ram[segment]);

    //  The instruction is at FX:
    //
            const   __instruction       = ram_view.getUint16(window.S16_REG['FX'], window.little_endian);

            //const   __instruction       = ram.read_word_32(window.S16_REG['FX'],);
           
            messenger.verbose(`Keyboard interrupted, instruction = ${__instruction}...`);

    //  1 is a getchar - the next byte of input will
    //  be returned in AX.
    //
            if (__instruction === 1)
            {
                let     __flags         = get_reg('FL');

    //  Block - setting this bit in FL causes the
    //  system to hang - this bit will be turned
    //  back off when a key is pressed and
    //  execution will resume.
    //
                __flags = __flags |= 0b00000100;

                set_reg('FL', __flags);
            }

        };


        return {

            initialise:                 _initialise,
            interrupt:                  _interrupt

        };

    };

