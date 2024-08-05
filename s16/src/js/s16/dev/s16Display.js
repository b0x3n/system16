///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/dev/s16Display.js            //
///////////////////////////////////////////////////////////
//
//
//


    import { DisplayInfo } from         "./../../utils/DisplayInfo.js";


///////////////////////////////////////////////////////////
//  The s16Display module.                               //
///////////////////////////////////////////////////////////
//
    export const    s16Display          = () =>
    {

        window.__s16_verbose(` Initialising display...`);

        
        const   objConfigure            = window.__s16Config;


        let     _objDisplay             = DisplayInfo(
                                            objConfigure
                                        );


        let     __resize_timer_id       = false;

        let     __start_line            = 0;


///////////////////////////////////////////////////////////
//  _shift_up()                                          //
///////////////////////////////////////////////////////////
//
        const   _shift_up               = () =>
        {

            let     __rows              = _objDisplay['terminal']['rows'];
            let     __cols              = _objDisplay['terminal']['cols'];

            let     __html_out          = '';

            for (let col = 0; col < __cols; col++)
            {
                __html_out += `
                    <div
                        id="${_objDisplay['cells']['id-prefix']}${__rows}_${col}"
                        class="${_objDisplay['cells']['class']}"
                        style="
                            top:                    ${(_objDisplay['cells']['height'] * __rows)}px;
                            left:                   ${(_objDisplay['cells']['width'] * col)}px;
                            width:                  ${_objDisplay['cells']['width']}px;
                            height:                 ${_objDisplay['cells']['height']}px;
                            font-family:            ${_objDisplay['cells']['font-family']};
                            font-size:              ${_objDisplay['cells']['font-size']}px;
                            line-height:            ${_objDisplay['cells']['height'] - 2}px;
                            color:                  ${_objDisplay['cells']['color']};
                            background-color:       ${_objDisplay['cells']['background-color']}px;
                        "
                    >
                        &nbsp;
                    </div>
                `;
            }

            __start_line++;

            _objDisplay['terminal']['rows']++;

            $(`#${_objDisplay['terminal']['id']}`).append(__html_out);

            $(`#${_objDisplay['terminal']['id']}`).css({
                'top': `-=${_objDisplay['cells']['height']}px`,
                'height': `+=${_objDisplay['cells']['height'] + 2}px`
            });

        };


///////////////////////////////////////////////////////////
//  _clear_display()                                     //
///////////////////////////////////////////////////////////
//
        const   _clear_display          = () =>
        {

            // const   __rows              = _objDisplay['terminal']['rows'];
            // const   __cols              = _objDisplay['terminal']['cols'];

            // for (let row = 0; row < __rows; row++)
            // {
            //     for (let col = 0; col < __cols; col++)
            //         $(`#${_objDisplay['cells']['id-prefix']}${row}_${col}`).html('');
            // }

            // _objDisplay['cursor']['row'] = _objDisplay['cursor']['col'] = 0;

            _reset_display();

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

            s16Process,
            read_ram,
            write_ram,
            get_reg,
            set_reg

        ) =>
        {

    //  The instruction is at FX:
    //
            const   __instruction       = read_ram(
                s16Process.code_segment,
                window.S16_REG['FX'],
                1
            );

            //const   __instruction       = ram.read_word_32(window.S16_REG['FX'], segment);
            
            window.__s16_verbose(` Display interrupted with instruction: ${__instruction}`);

    //  1 is a _clear_display() and requires no parameters.
    //
            if (__instruction === 1)
                return _clear_display();

    //  2 is a _putchar() and expects an 8-bit param in EX.
    //
            if (__instruction === 2)
            {
                const   __operand           = read_ram(
                    s16Process.code_segment,
                    window.S16_REG['EX'],
                    1
                );

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
                write_ram(
                    s16Process.code_segment,
                    window.S16_REG['DX'],
                    _objDisplay['terminal']['rows'],
                    2
                );
                write_ram(
                    s16Process.code_segment,
                    window.S16_REG['EX'],
                    _objDisplay['terminal']['cols'],
                    2
                );

                return true;
            }

    //  4 is used to get the current cursor position,
    //  the row is stored in the DX register, the
    //  column in EX.
    //
            if (__instruction === 4)
            {
                write_ram(
                    s16Process.code_segment,
                    window.S16_REG['DX'],
                    _objDisplay['cursor']['row'],
                    2
                );
                write_ram(
                    s16Process.code_segment,
                    window.S16_REG['EX'],
                    _objDisplay['cursor']['col'],
                    2
                );
                
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
                // const   __row           = ram_view.getUint16(window.S16_REG['CX'], window.little_endian);
                // const   __col           = ram_view.getUint16(window.S16_REG['DX'], window.little_endian);

                const   __row           = read_ram(
                    s16Process.code_segment,
                    window.S16_REG['DX'],
                    2
                );
                const   __col           = read_ram(
                    s16Process.code_segment,
                    window.S16_REG['EX'],
                    2
                );

                if (__move_cursor(__row, __col) === false)
                    write_ram(
                        s16Process.code_segment,
                        window.S16_REG['RT'],
                        1
                    );

                return true;
            }


            if (__instruction === 6)
                _shift_up();

        };


///////////////////////////////////////////////////////////
//  _reset_display()                                     //
///////////////////////////////////////////////////////////
//
        const   _reset_display          = () =>
        {

            _objDisplay['cursor']['disable']();

            _objDisplay                 = DisplayInfo(
                                            objConfigure
                                        );

            console.log(`Refreshingdisplay`);

        };


        // $(window).on('resize', () =>
        // {

        //     if (__resize_timer_id !== false)
        //     {
        //         clearTimeout(__resize_timer_id);
        //         __resize_timer_id = false;
        //     }

        //     __resize_timer_id = setTimeout(() =>
        //     {
        //         _reset_display();
        //         __resize_timer_id = false;
        //     }, 100);

        // });


        return {

            reset_display:              _reset_display,

            clear_display:              _clear_display,

            putchar:                    _putchar,

            interrupt:                  _interrupt,

            objDisplay:                 _objDisplay

        };


    };

