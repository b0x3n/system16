///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/Display.js           //
///////////////////////////////////////////////////////////
//
//
//


    import { DisplayInfo } from         "./core/DisplayInfo.js";


///////////////////////////////////////////////////////////
//  The Display module.                                  //
///////////////////////////////////////////////////////////
//
    export const    Display             = (

        objConfigure,
        messenger

    ) =>
    {
        

        messenger.verbose(` Initialising display...`);


        const   _objDisplay             = DisplayInfo(
                                            objConfigure,
                                            messenger
                                        );


///////////////////////////////////////////////////////////
//  _initialise_display()                                //
///////////////////////////////////////////////////////////
//
        const   _initialise_display     = () =>
        {

            window.console_enabled = false;

            $(`.${objConfigure['terminal-class']}`).on('mouseenter', () => { 

                window.console_enabled = true;
            });

            $(`.${objConfigure['terminal-class']}`).on('mouseleave', () => {
                
                window.console_enabled = false;
            });

        };


///////////////////////////////////////////////////////////
//  _clear_display()                                     //
///////////////////////////////////////////////////////////
//
        const   _clear_display          = () =>
        {

            const   __rows              = _objDisplay['terminal']['rows'];
            const   __cols              = _objDisplay['terminal']['cols'];

            for (let row = 0; row < __rows; row++)
            {
                for (let col = 0; col < __cols; col++)
                    $(`#${_objDisplay['cells']['id-prefix']}${row}_${col}`).html('');
            }

            _objDisplay['cursor']['row'] = _objDisplay['cursor']['col'] = 0;

        };


        const   __reset_cell_colors     = () =>
        {

             _objDisplay['cursor']['reset']();

        };


///////////////////////////////////////////////////////////
//  _putchar()                                           //
///////////////////////////////////////////////////////////
//
        const   _putchar                = (

            char_byte,
            row                         = -1,
            col                         = -1

        ) =>
        {

            const   __rows              = _objDisplay['terminal']['rows'];
            const   __cols              = _objDisplay['terminal']['cols'];

            if ((row < 0 || row >= __rows) || (col < 0 || col >= __cols))
            {
                row = _objDisplay['cursor']['row'];
                col = _objDisplay['cursor']['col'];
            }

            $(`#${_objDisplay['cells']['id-prefix']}${row}_${col}`).html(char_byte);

            if  (++col > __cols)
            {
                col = 0;
                if ((row + 1) < __rows)
                    row++;
            }

            _objDisplay['cursor']['row'] = row;
            _objDisplay['cursor']['col'] = col;

            __reset_cell_colors();

            return true;

        };


///////////////////////////////////////////////////////////
//  __move_cursor()                                      //
///////////////////////////////////////////////////////////
//
        const   __move_cursor           = (

            row,
            col

        ) =>
        {

            if (
                    (row < 0 || row > _objDisplay['terminal']['rows'])  ||
                    (col < 0 || col > _objDisplay['terminal']['cols'])
            )
                return false;

            _objDisplay['cursor']['row'] = row;
            _objDisplay['cursor']['col'] = col;

            $(`.${_objDisplay['cells']['class']}`).removeClass('cursor_blink');
            $(`.${_objDisplay['cells']['class']}`).removeClass('cursor');

            return true;

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

            const   ram_view          = new DataView(ram.ram[segment]);

            messenger.verbose(`+------------------------------------------------------------ Display interrupted...`);

    //  The instruction is at FX:
    //
            const   __instruction       = ram_view.getUint8(window.S16_REG['FX'], window.little_endian);

            //const   __instruction       = ram.read_word_32(window.S16_REG['FX'], segment);
            
            messenger.verbose(` Display instruction: ${__instruction}`);

    //  1 is a _clear_display() and requires no parameters.
    //
            if (__instruction === 1)
                return _clear_display();

    //  2 is a _putchar() and expects an 8-bit param in EX.
    //
            if (__instruction === 2)
            {
                const   __operand           = ram_view.getUint8(window.S16_REG['EX']);

                //const   __operand           = ram.read_byte(window.S16_REG['EX'], segment);

                _putchar(String.fromCharCode(__operand));
                return true;
            }

    //  3 is used to get the number of rows and columns
    //  the display has, the number of rows/lines is
    //  written to DX and the number of columns is
    //  written to EX.
    //
            if (__instruction === 3)
            {
                // ram_view.setUint16(window.S16_REG['DX'], _objDisplay['terminal']['rows'], window.little_endian);
                // ram_view.setUint16(window.S16_REG['EX'], _objDisplay['terminal']['cols'], window.little_endian);
                return true;
            }

    //  4 is used to get the current cursor position,
    //  the row is stored in the DX register, the
    //  column in EX.
    //
            if (__instruction === 4)
            {
                // ram_view.setUint16(window.S16_REG['DX'], _objDisplay['cursor']['row'], window.little_endian);
                // ram_view.setUint16(window.S16_REG['EX'], _objDisplay['cursor']['col'], window.little_endian);
                return true;
            }

    //  5 is used to move the cursor position, the
    //  row should be set in CX and the column in
    //  DX.
    //
    //  If either the row or column are out of bounds
    //  the RT register is set to 1.
    //
            if (__instruction === 5)
            {
                const   __row           = ram_view.getUint16(window.S16_REG['CX'], window.little_endian);
                const   __col           = ram_view.getUint16(window.S16_REG['DX'], window.little_endian);

                if (__move_cursor(__row, __col) === false)
                    ram_view.setUint8(window.S16_REG['RT'], 1);

                return true;
            }

        };


        return {

            initialise_display:         _initialise_display,

            clear_display:              _clear_display,

            putchar:                    _putchar,

            interrupt:                  _interrupt,

            objDisplay:                 _objDisplay

        };


    };

