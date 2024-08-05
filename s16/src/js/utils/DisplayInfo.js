///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/utils/DisplayInfo.js         //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The DisplayInfo module.                              //
///////////////////////////////////////////////////////////
//
    export const    DisplayInfo         = (

        objConfigure,
        cursor_row                      = false,
        cursor_col                      = false

    ) =>
    {

        let     _objDisplay             = {

                                            'target-id':    false,
                                            'target-el':    false,
                                        
                                            'terminal':     {
                                                                'id':               false,
                                                                'el':               false,
                                                                'class':            false,
                                                                'top':              0,
                                                                'left':             0,
                                                                'width':            0,
                                                                'height':           0,
                                                                'color':            0,
                                                                'background-color': 0,
                                                                'rows':             0,
                                                                'cols':             0
                                                            },

                                            'cells':        {
                                                                'id-prefix':        false,
                                                                'class':            false,
                                                                'font-family':      false,
                                                                'font-size':        false,
                                                                'width':            0,
                                                                'height':           0,
                                                                'color':            0,
                                                                'background-color': 0
                                                            },

                                            'cursor':       {
                                                                'blink':            1000,
                                                                'color':            '#FFF',
                                                                'background-color': '#000',
                                                                'row':              0,
                                                                'col':              0
                                                            }

                                        };


///////////////////////////////////////////////////////////
//  __check_options()                                    //
///////////////////////////////////////////////////////////
//
        const   __check_option          = (

            option_name,
            option_value,
            set                         = false

        ) =>
        {

            if (! set)
            {
                if (! objConfigure.hasOwnProperty(option_name))
                    objConfigure[option_name] = option_value;
            }
            else
            {
                if (set === true)
                    _objDisplay[option_name] = option_value
                else
                {
                    if (! objConfigure.hasOwnProperty(option_name))
                        _objDisplay[set][option_name] = option_value;
                    else
                        _objDisplay[set][option_name] = objConfigure[option_name];
                }
            }

        };


///////////////////////////////////////////////////////////
//  __display_error()                                    //
///////////////////////////////////////////////////////////
//
        const   __display_error         = error_message =>
        {

            _objDisplay = false;
            return window.__s16_error(error_message);

        };


///////////////////////////////////////////////////////////
//  __set_target()                                       //
///////////////////////////////////////////////////////////
//
        const   __set_target            = () =>
        {

            __check_option('target-id', 'inner');

            const   __target            = $(`#${objConfigure['target-id']}`);

            if (! __target.length)
                return __display_error(`  Error creating display - target-element '${objConfigure['target-id']}' not found`);
        
            _objDisplay['target-id'] = objConfigure['target-id'];
            _objDisplay['target-el'] = __target;

            window.__s16_verbose(`  Building terminal in target element '${_objDisplay['target-id']}'`);
        
        };
        

///////////////////////////////////////////////////////////
//  __set_terminal()                                     //
///////////////////////////////////////////////////////////
//
        const   __set_terminal          = () =>
        {

            __check_option('terminal', {}, true);

            __check_option('id', 'terminal', 'terminal');
            __check_option('class', 'terminal', 'terminal');
            __check_option('color', 'rgba(64, 180, 120, 1)', 'terminal');
            __check_option('background-color', 'rgba(0, 0, 0, 1)', 'terminal');

            const   __height            = parseInt(_objDisplay['target-el'].css('height').replace('px', ''));
            const   __width             = parseInt(_objDisplay['target-el'].css('width').replace('px', ''));

            // if (objConfigure.hasOwnProperty('debug') && objConfigure['debug'] !== false)
            //     _objDisplay['terminal']['width'] = ((__width / 10) * 7);
            // else
                _objDisplay['terminal']['width'] = __width;
    
            _objDisplay['terminal']['height'] = __height;

            window.__s16_verbose(`   Terminal width: ${_objDisplay['terminal']['width']} `);
            window.__s16_verbose(`   Terminal height: ${_objDisplay['terminal']['height']} `);

        };


///////////////////////////////////////////////////////////
//  __set_cells()                                        //
///////////////////////////////////////////////////////////
//
        const   __set_cells             = () =>
        {

            __check_option('cells', {}, true);

            __check_option('id-prefix', 'cell_', 'cells');
            __check_option('class', 'cell', 'cells');
            __check_option('font-family', 'vt323, monospace', 'cells');
            __check_option('font-size', '22px', 'cells');
            __check_option('color', 'rgba(64, 180, 120, 1)', 'cells');
            __check_option('background-color', 'rgba(0, 0, 0, 0)', 'cells');
            __check_option('test-cell', 'testcell', 'cells');

            const   __cell = $(`#${_objDisplay['cells']['test-cell']}`);

            if (! __cell.length)
                return __display_error(`Can't find test-cell '${_objDisplay['cells']['test-cell']}'`);

            _objDisplay['cells']['width'] = parseInt(__cell.css('width').replace('px', ''));
            _objDisplay['cells']['height'] = (parseInt(_objDisplay['cells']['font-size'].replace('px', '')) - 3);

            window.__s16_verbose(`   Cell width: ${_objDisplay['cells']['width']} px`);
            window.__s16_verbose(`   Cell height: ${_objDisplay['cells']['height']} px`);

            _objDisplay['terminal']['rows'] = Math.floor(_objDisplay['terminal']['height'] / _objDisplay['cells']['height']);
            _objDisplay['terminal']['cols'] = Math.floor(_objDisplay['terminal']['width'] / _objDisplay['cells']['width']);
            
            window.__s16_verbose(`   Terminal rows: ${_objDisplay['terminal']['rows']} `);
            window.__s16_verbose(`   Terminal columns: ${_objDisplay['terminal']['cols']} `);

            _objDisplay['terminal']['top'] = ((_objDisplay['terminal']['height'] % _objDisplay['cells']['height']) / 2);
            _objDisplay['terminal']['left'] = ((_objDisplay['terminal']['width'] % _objDisplay['cells']['width']) / 2);

        };


///////////////////////////////////////////////////////////
//  __blink_cursor()                                     //
///////////////////////////////////////////////////////////
//
        const   __blink_cursor         = () =>
        {

            const   __row = _objDisplay['cursor']['row'];
            const   __col = _objDisplay['cursor']['col'];

            $(`.${_objDisplay['cells']['class']}`).removeClass('cursor_blink');
            $(`.${_objDisplay['cells']['class']}`).removeClass('cursor');


            if (_objDisplay['cursor']['state'])
            {
                $(`#${_objDisplay['cells']['id-prefix']}${__row}_${__col}`).removeClass('cursor_blink')
                $(`#${_objDisplay['cells']['id-prefix']}${__row}_${__col}`).addClass('cursor')
                
                _objDisplay['cursor']['state'] = 0;
            }
            else
            {
                $(`#${_objDisplay['cells']['id-prefix']}${__row}_${__col}`).removeClass('cursor')
                $(`#${_objDisplay['cells']['id-prefix']}${__row}_${__col}`).addClass('cursor_blink')

                _objDisplay['cursor']['state'] = 1;
            }

            _objDisplay['cursor']['timer_id'] = setTimeout(() => {
                __blink_cursor();
            }, _objDisplay['cursor']['blink']);

        };


///////////////////////////////////////////////////////////
//  __disable_cursor()                                   //
///////////////////////////////////////////////////////////
//
        const   __disable_cursor        = () =>
        {

            if (_objDisplay['cursor']['timer_id'])
            {
                clearTimeout(_objDisplay['cursor']['timer_id'])
                _objDisplay['cursor']['timer_id'] = false;
            }

            $(`.${_objDisplay['cells']['class']}`).removeClass('cursor_blink');
            $(`.${_objDisplay['cells']['class']}`).removeClass('cursor');
            
            _objDisplay['cursor']['state'] = 0;

        };


///////////////////////////////////////////////////////////
//  _reset_cursor()                                      //
///////////////////////////////////////////////////////////
//
        const   _reset_cursor           = () =>
        {

            __disable_cursor();
            __blink_cursor();

        };


///////////////////////////////////////////////////////////
//  __set_cursor()                                       //
///////////////////////////////////////////////////////////
//
        const   __set_cursor            = (
            
            is_reset                    = false
            
        ) =>
        {

            __check_option('cursor', {}, true);

            __check_option('blink', 500, 'cursor');
            __check_option('row', 0, 'cursor');
            __check_option('col', 0, 'cursor');
            __check_option('state', 0, 'cursor');
            __check_option('timer_id', false, 'cursor');

            __blink_cursor();

        };


///////////////////////////////////////////////////////////
//  __build_terminal()                                   //
///////////////////////////////////////////////////////////
//
        const   __build_terminal        = (

            is_reset                    = false

        ) =>
        {

            __check_option('flicker', false, 'terminal');

            _objDisplay['target-el'].html(
                `<div
                    id="${_objDisplay['terminal']['id']}"
                    class="${_objDisplay['terminal']['class']}"
                    style="
                        width:                  ${_objDisplay['terminal']['width']}px;
                        height:                 ${_objDisplay['terminal']['height']}px;
                        top:                    ${_objDisplay['terminal']['top']}px;
                        left:                   ${_objDisplay['terminal']['left']}px;
                        color:                  ${_objDisplay['terminal']['color']};
                        background-color:       ${_objDisplay['terminal']['background-color']};
                        padding:                0px;
                    "
                >
                    &nbsp;
                </div>`
            );

            _objDisplay['terminal']['el'] = $(`#${_objDisplay['terminal']['id']}`);

            if (_objDisplay['terminal']['flicker'])
                _objDisplay['terminal']['el'].addClass('screen_flicker');

            const   __rows              = _objDisplay['terminal']['rows'];
            const   __cols              = _objDisplay['terminal']['cols'];

            let     __html_string       = '';
            let     __char_index        = 0;

            for (let row = 0; row < __rows; row++)
            {

                const   __chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"£$%^&*()_+-=[]{};'#:@~,./<>?";


                for (let col = 0; col < __cols; col++,  __char_index++)
                {

                    if  (__char_index >= __chars.length)
                        __char_index = 0;

                    let __char = __chars.substr(__char_index, 1);

                    if (is_reset)
                        __char = '';

                    __html_string += `
                        <div
                            id="${_objDisplay['cells']['id-prefix']}${row}_${col}"
                            class="${_objDisplay['cells']['class']}"
                            style="
                                top:                    ${(_objDisplay['cells']['height'] * row)}px;
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

            }

            _objDisplay['terminal']['el'].html(__html_string);

            __set_cursor(is_reset);

        };


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = (

            is_reset                    = false

        ) =>
        {

            if (objConfigure.hasOwnProperty('debug') && objConfigure['debug'] !== false)
            {
                $(`#${objConfigure['terminal-id']}_debug_panel`).css({
                    'display': 'block'
                });
            }

            if (is_reset)
                __disable_cursor();
           

            __set_target();
            __set_terminal();
            __set_cells();

            __build_terminal(is_reset);

            // if (cursor_row !== false || cursor_col !== false)
            // {
            //     __disable_cursor();

            //     if (cursor_row !== false)
            //         _objDisplay['cursor']['row'] = cursor_row;
            //     if (cursor_col !== false)
            //         _objDisplay['cursor']['col'] = cursor_col;

            //     _reset_cursor();
            // }

            _objDisplay['cursor']['reset'] = _reset_cursor;
            _objDisplay['cursor']['disable'] = __disable_cursor;

            if (cursor_row)
                _objDisplay['cursor']['row'] = cursor_row;
            if (cursor_col)
                _objDisplay['cursor']['col'] = cursor_col;
            
        };


        window.__s16_verbose(` Building terminal...`);

        __initialise();

        return _objDisplay;

    };

