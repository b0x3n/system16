///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/Display.js           //
///////////////////////////////////////////////////////////
//
//
//


    import { DisplayInfo } from         "./core/DisplayInfo.js";


///////////////////////////////////////////////////////////
//  Cell factory.                                        //
///////////////////////////////////////////////////////////
//
    const           Cell                = (

        objDisplay,
        cell_index,
        cell_row,
        cell_col,
        key                             = false,
        char                            = false,
        font_family                     = false,
        font_size                       = false,
        color                           = false,
        background_color                = false

    ) =>
    {
        
        const   _objCell                = {
            'id':                       `${objDisplay['cells']['id-prefix']}${cell_row}_${cell_col}`,
            'font-family':              objDisplay['cells']['font-family'],
            'font-size':                objDisplay['cells']['font-size'],
            'color':                    objDisplay['cells']['color'],
            'background-color':         objDisplay['cells']['background-color'],
            'key':                      key,
            'char':                     char
        };


        const   __initialise            = () =>
        {

            if (font_family !== false)
                _objCell['font-family'] = font_family;
            if (font_size !== false)
                _objCell['font-size'] = font_size;
            if (color !== false)
                _objCell['color'] = color;
            if (background_color !== false)
                _objCell['background-color'] = background_color;

        };


        const   _cell_css_object        = () =>
        {
            
            return {
                'font-family':          _objCell['font-family'],
                'font-size':            _objCell['font-size'],
                'color':                _objCell['color'],
                'background-color':     _objCell['background-color']
            };

        };


        const   _refresh                = () =>
        {

            const   __objCellData       = _cell_css_object();

            $(`#${_objCell['id']}`).css(_cell_css_object());
            $(`#${_objCell['id']}`).html(_objCell['char']);

        };


        __initialise();


        return {

            refresh:                    _refresh,
            cell_css_object:            _cell_css_object,

            objCell:                    _objCell

        };

    };


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


        let     _objDisplay             = DisplayInfo(
                                            objConfigure,
                                            messenger
                                        );

        let     __terminal_buffer       = [];

        let     __terminal_rows         = 0;
        let     __terminal_cols         = 0;

        let     __terminal_cells        = 0;

        let     __resize_timeout_id     = false;


        const   __initialise_buffer     = () =>
        {
            
    //  The buffer contains an object for every single
    //  character cell in the display.
    //
            __terminal_rows             = _objDisplay['terminal']['rows'];
            __terminal_cols             = _objDisplay['terminal']['cols'];
        
            __terminal_cells            = (__terminal_rows * __terminal_cols);

            __terminal_buffer           = new Array(__terminal_cells);
            
            for (let row = 0, __pos = 0; row < __terminal_rows; row++)
            {
                for (let col = 0; col < __terminal_cols; col++, __pos++)
                {
                   __terminal_buffer[__pos] = Cell(
                        _objDisplay,
                        __pos,
                        row,
                        col,
                        '#'
                    );
                }
            }

        };


///////////////////////////////////////////////////////////
//  __refresh_buffer()                                   //
///////////////////////////////////////////////////////////
//
        const   __refresh_buffer        = (

            rows,
            cols

        ) =>
        {

    //  The display size has changed and so must the
    //  buffer - this has consequences!
    //
    //  Either the display is larger in which case we
    //  just dump everything starting at byte 0.
    //
    //  However, if the display is smaller we're going
    //  to lose output, in this case we populate the
    //  cells in reverse and only add the data from
    //  the end of the buffer - some data at the start
    //  will be lost.
    //

            let     __row               = 0;
            let     __col               = 0;

            const   __new_buffer_size   = (__terminal_rows * __terminal_cols);
            const   __new_buffer        = new Array(__new_buffer_size);
            
            if (__new_buffer_size <= __terminal_buffer.length)
            {
                for (let cell_no = 0; cell_no < __new_buffer_size; cell_no++)
                {
                    __new_buffer[cell_no] = Cell(
                        _objDisplay,
                        cell_no,
                        __row,
                        __col++,
                        __terminal_buffer[cell_no]['key'],
                        __terminal_buffer[cell_no]['char'],
                        __terminal_buffer[cell_no]['font-family'],
                        __terminal_buffer[cell_no]['font-size'],
                        __terminal_buffer[cell_no]['color'],
                        __terminal_buffer[cell_no]['background-color']
                    );
                    __new_buffer[cell_no].refresh();

                    if (__col > cols)
                    {
                        __col = 0;
                        __row++;
                    }
                }
            }
            else
            {
                let     __src           = (__terminal_buffer.length - 1);
                
                __row                   = (rows - 1);
                __col                   = (cols - 1);

                for (let __pos = (__new_buffer.length - 1); __row >= 0; __row--)
                {
                    for ( ; __col >= 0; __col--, __pos--)
                    {
                        __new_buffer[__pos] = Cell(
                            _objDisplay,
                            __pos,
                            __row,
                            __col,
                            __terminal_buffer[__src]['key'],
                            __terminal_buffer[__src]['char'],
                            __terminal_buffer[__src]['font-family'],
                            __terminal_buffer[__src]['font-size'],
                            __terminal_buffer[__src]['color'],
                            __terminal_buffer[__src]['background-color']
                        );
                        __new_buffer[__pos].refresh();
                        __src--;
                    }
                }
            }

            __terminal_buffer = __new_buffer;

        };


///////////////////////////////////////////////////////////
//  _initialise_display()                                //
///////////////////////////////////////////////////////////
//
        const   _initialise_display     = () =>
        {
            const   __wait_event        = new Event('s16_system_wait');
            const   __wait_resume       = new Event('s16_system_wait_resume');

            __initialise_buffer();

            window.console_enabled      = false;

            $(`.${objConfigure['terminal-class']}`).on('mouseenter', () => { 
                window.console_enabled = true;
            });

            $(`.${objConfigure['terminal-class']}`).on('mouseleave', () => {
                window.console_enabled = false;
            });


            $(window).on('resize', () => {

                if (__resize_timeout_id !== false)
                {
                    clearTimeout(__resize_timeout_id);                
                    __resize_timeout_id = false;
                }

                document.dispatchEvent(__wait_event);

                __resize_timeout_id = setTimeout(() => {

                    _objDisplay['cursor']['disable']();

                    const   __rows      = _objDisplay['terminal']['rows'];
                    const   __cols      = _objDisplay['terminal']['cols'];
                    
    //  Now to re-build the display...
    //
                    _objDisplay = DisplayInfo(
                        objConfigure,
                        messenger,
                        _objDisplay['cursor']['row'],
                        _objDisplay['cursor']['col']
                    );

    //  Update the buffer...
    //
                    __refresh_buffer(__rows, __cols);
                    __resize_timeout_id = false;
                    _objDisplay['cursor']['reset']();

                    document.dispatchEvent(__wait_resume);
                }, 100);
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

            __terminal_buffer[(row * __cols) + col].objCell.key = char_byte.charCodeAt(0);
            __terminal_buffer[(row * __cols) + col].objCell.char = char_byte;

            //__terminal_buffer[(row * __cols) + col].refresh();

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
                ram_view.setUint16(window.S16_REG['DX'], _objDisplay['terminal']['rows'], window.little_endian);
                ram_view.setUint16(window.S16_REG['EX'], _objDisplay['terminal']['cols'], window.little_endian);
                return true;
            }

    //  4 is used to get the current cursor position,
    //  the row is stored in the DX register, the
    //  column in EX.
    //
            if (__instruction === 4)
            {
                ram_view.setUint16(window.S16_REG['DX'], _objDisplay['cursor']['row'], window.little_endian);
                ram_view.setUint16(window.S16_REG['EX'], _objDisplay['cursor']['col'], window.little_endian);
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

