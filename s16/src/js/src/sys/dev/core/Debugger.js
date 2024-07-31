///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/core/Debugger.js     //
///////////////////////////////////////////////////////////
//
//
//


    const   S16_DEBUG_BREAK             = 2;
    const   S16_DEBUG_RUN               = 1;
    const   S16_DEBUG_HALT              = 0;


///////////////////////////////////////////////////////////
//  The Debugger module                                  //
///////////////////////////////////////////////////////////
//
    export const    Debugger            = (

        ram,
        display,
        messenger,
        initial_state                   = S16_DEBUG_RUN

    ) =>
    {

        const   __terminal_id           = display['terminal']['id'];
        
        const   __data_el               = $(`#${display['terminal']['id']}_debug_data`);
        const   __code_el               = $(`#${display['terminal']['id']}_debug_code`);


        let     __ram_view;
            
        let     __ro_offset;
        let     __rw_offset;
        let     __code_offset;
        let     __exe_size;


        let     __state                 = S16_DEBUG_RUN;
        

        let     __register_index        =
        [
            "DS", "CS", "SS",
            "BP", "SP", "IP",
            "HB", "HP",
            "RT", "FL",
            "OI", "II",
            "AX", "BX", "CX",
            "DX", "EX", "FX"
        ];

        let     __reg_orig              = {}
        let     __reg_diff              = {};

        let     __rw_orig               = [];
        let     __rw_diff               = [];


    //  10 for decimal, 2 for binary, 8 for octal and
    //  16 for hex.
    //
        const   __format                = 10;


///////////////////////////////////////////////////////////
//  __show_bytes()                                       //
///////////////////////////////////////////////////////////
//
        const   __show_bytes            = (

            bytes,
            offset

        ) =>
        {

            return `(<span style="color: #FFF;"><b>${bytes}</b> bytes @ offset <b>${offset}</b></span>)`;

        };


///////////////////////////////////////////////////////////
//  __show_offset_range()                                //
///////////////////////////////////////////////////////////
//
        const   __show_offset_range     = (

            start_offset,
            end_offset

        ) =>
        {

            return `${start_offset}<span style="color: #FFF;">-</span>${end_offset}`;

        };


///////////////////////////////////////////////////////////
//  __show_register()                                    //
///////////////////////////////////////////////////////////
//
        const   __show_register         = reg =>
        {

            let     __reg_val           = __ram_view.getUint32(
                                            window.S16_REG[reg],
                                            window.little_endian
                                        );
                                     
            if (reg === 'FL' || reg === 'RT' || reg === 'OI' || reg === 'II')
                __reg_val               = __ram_view.getUint8(window.S16_REG[reg]);

    //  Remember the original register states for a
    //  reset.
    //
    //  We only want to update values that have changed,
    //  so we populate this when the display is built.
    //
            __reg_orig.reg              = __reg_val;
            __reg_diff.reg              = __reg_val;

            return `<b>${reg}</b>=<span style="color: rgba(64, 160, 255, 1);">${__reg_diff.reg.toString(__format)}</span>`;

        };


///////////////////////////////////////////////////////////
//  __refresh_registers()                                //
///////////////////////////////////////////////////////////
//
        const   __refresh_registers     = ram_view =>
        {

            __register_index.forEach(reg => {

                let     __reg_val       = ram_view.getUint32(window.S16_REG[reg], window.little_endian);

                if (reg === 'RT' || reg === 'FL' || reg === 'OI' || reg === 'II')
                    __reg_val           = ram_view.getUint8(window.S16_REG[reg]);

    //  Has it changed?
    //
                if (__reg_diff[reg] === __reg_val)
                    return;

    //  Yes, update and display the new value.
    //
                __reg_diff[reg]         = __reg_val;

                $(`#${__terminal_id}_reg_${reg}`).html(
                    __show_register(reg)
                );

            });

        };


///////////////////////////////////////////////////////////
//  __build_register_table()                             //
///////////////////////////////////////////////////////////
//
        const   __build_register_table  = () =>
        {

            let     __html_out          = '';

            __register_index.forEach(reg => {

                __html_out              +=
                `
                    <div
                        id="${__terminal_id}_reg_${reg}"
                        class="debug_panel_register"
                    >
                        ${__show_register(reg)}
                    </div>
                `;

            });

            $(`#${__terminal_id}_debug_registers`).html(__html_out);

        };


///////////////////////////////////////////////////////////
//  __refresh_rw_data()                                  //
///////////////////////////////////////////////////////////
//
        const   __refresh_rw_data       = ram_view =>
        {

            let     __byte_no           = __rw_offset;

            while (__byte_no < __code_offset)
            {

                const   __byte          = ram_view.getUint8(__byte_no);

                if (__byte === __rw_diff[(__byte_no - __ro_offset)])
                {
                    __byte_no++;
                    continue;
                }

                __rw_diff[(__byte_no - __ro_offset)] = __byte;

                $(`#${__terminal_id}_data_${__byte_no}`).html(__byte);
                __byte_no++;

            }

        };


///////////////////////////////////////////////////////////
//  __build_debug_row()                                  //
///////////////////////////////////////////////////////////
//
        const   __build_debug_row       = (

            start_offset,
            end_offset

        ) =>
        {

            let     __from              = start_offset;
            let     __to                = end_offset;

            if ((__to - __from) < 8)
                __to = (__from + (__to - __from));
            else
                __to = (__from + 8);

            __to--;

            let     __html_out          =
                    `
                        <div
                            id="${__terminal_id}_offset_${start_offset}"
                            class="debug_panel_data_offset"
                        >
                            ${__show_offset_range(__from, __to)}
                        </div>
                    `;

            let     __offset = start_offset;

            for (__offset = start_offset; __offset < end_offset; __offset++)
            {

                let     __value         = __ram_view.getUint8(__offset).toString(__format);

    //  If we're building the read-write section,
    //  the __rw_diff array is built to keep track of 
    //  any changes.
    //
                if (start_offset >= __rw_offset && start_offset < __code_offset)
                {
                    __rw_orig.push(__value);
                    __rw_diff.push(__value);
                }

                if (__offset >= (start_offset + 8))
                    break;

                console.log(`BUILDING RW at offset ${__offset}, byte ${__value}`)

                __html_out              +=
                `
                    <div
                        id="${__terminal_id}_data_${__offset}"
                        class="debug_panel_data"
                    >
                        ${__value}
                    </div>
                `;

            }

            return __html_out;

        };
        

///////////////////////////////////////////////////////////
//  __build_debug_table()                                //
///////////////////////////////////////////////////////////
//
        const   __build_debug_table     = (

            start_offset,
            end_offset

        ) =>
        {

            let     __html_out          = '';

            for (let offset = start_offset; offset < end_offset; offset += 8)
            {

    //  Create a new row...
    //
                __html_out              +=
                `
                    <div
                        id="${__terminal_id}_row_${offset}"
                        class="debug_panel_row"
                    >
                `;

                __html_out              += __build_debug_row(
                                            offset, 
                                            end_offset
                                        );

                __html_out              +=
                `
                    </div>
                `;
            }

            return __html_out;

        };


///////////////////////////////////////////////////////////
//  __build_section()                                    //
///////////////////////////////////////////////////////////
//
        const   __build_section         = (

            section_name,
            start_offset,
            end_offset

        ) =>
        {

            const   __size              = (end_offset - start_offset);

            let     __html_out          =
                    `
                        <div
                            id="${__terminal_id}_${section_name}_title"
                            class="debug_panel_info_header"
                        >
                            ${section_name} ${__show_bytes(__size, start_offset)}
                        </div>
                    `;

            let     __section           = "data";

            if (section_name === "Code")
                __section = "code";

            __html_out += __build_debug_table(
                start_offset,
                end_offset
            );

            $(`#${__terminal_id}_debug_${__section}`).append(__html_out);

        };


///////////////////////////////////////////////////////////
//  _initialise()                                        //
///////////////////////////////////////////////////////////
//
        const   _initialise             = (

            segment                     = 0
        
        ) =>
        {

            messenger.verbose(`Building debugger...`);

            __ram_view                  = new DataView(ram.ram[segment]);
            
            __ro_offset                 = __ram_view.getUint32(window.S16_HEADER_RO, window.little_endian);
            __rw_offset                 = __ram_view.getUint32(window.S16_HEADER_RW, window.little_endian);
            __code_offset               = __ram_view.getUint32(window.S16_HEADER_CODE, window.little_endian);
            __exe_size                  = __ram_view.getUint32(window.S16_HEADER_EXESIZE, window.little_endian);

            let     __flags             = __ram_view.getUint8(window.S16_REG['FL']);

            __build_register_table();

            __build_section(
                "Read-only",
                __ro_offset,
                __rw_offset
            );

            __build_section(
                "Read-write",
                __rw_offset,
                __code_offset
            );
            
            __build_section(
                "Code",
                __code_offset,
                __exe_size
            );

            $('#debug_option_break').on('click', () => {
                if (__state !== S16_DEBUG_RUN)
                    return;

                __flags |= 0b00000010;

                __ram_view.setUint8(window.S16_REG['FL'], __flags);
                __refresh_debug_options(__ram_view);

                __state = S16_DEBUG_BREAK;
            });

            $('#debug_option_run').on('click', () => {
                if (__state === S16_DEBUG_RUN)
                    return;


                __flags &= (~0b00000010);

                __ram_view.setUint8(window.S16_REG['FL'], __flags);
                __refresh_debug_options(__ram_view);
            });

        };


///////////////////////////////////////////////////////////
//  __refresh_debug_options()                            //
///////////////////////////////////////////////////////////
//
        const   __refresh_debug_options = ram_view =>
        {

            const   __flags             = ram_view.getUint8(window.S16_REG['FL']);

    //        console.log(`Debugger refresh...`);

            const   __objEnable         = {
                'opacity':      '0.9',
                'cursor':       'pointer',
                'disabled':     'false'
            };

            const   __objDisable        = {
                'opacity':      '0.5',
                'cursor':       'default'
            };

            let     __objBreak;
            //let     __objResume;
            let     __objReset;
            //let     __objRefresh;
            let     __objRun;
            let     __objStep;
            let     __objClock;


    //  Are we in a break or has the system halted?
    //
            if ((__flags & 0b00001000) || (__flags & 0b00000010))
            {
                if (__flags & 0b00001000)
                    __state             = S16_DEBUG_HALT;
                else
                    __state             = S16_DEBUG_BREAK;

    //  In either case, the Break option is disabled.
    //
                __objBreak              = __objDisable;

                
    //  Run is enabled for both halt and break - when
    //  in break mode it resumes execution, when in
    //  halt mode it restarts the application.
    //
                __objRun                = __objEnable;

                if (__state === S16_DEBUG_HALT)
                    __objStep           = __objDisable;
                else
                    __objStep           = __objEnable;

    //  Reset is always enabled in both modes.
    //
                __objReset              = __objEnable

    //  The clock_speed input box is only editable
    //  while in halt or break mode.
    //
                __objClock              = __objEnable;
                $('#clock_speed').prop('disabled', false);
            }
            else {
                __state = S16_DEBUG_RUN;

         //       console.log(`System enabled - debugging enabled`);
               
    //  System is running, Break is enabled.
    // 
                __objBreak              = __objEnable;
            //    __objResume             = __objDisable;

    //  Reset is always diabled here - you can't reset
    //  while the system is running...well, maybe you
    //  can but I won't allow it!
    //
    //  The Run and Step ptions are also disabled
    //  here.
    //
                __objReset              = __objDisable;
            //    __objRefresh            = __objDisable;
                __objRun                = __objDisable;
                __objStep               = __objDisable;

    //  The clock_speed input is always disabled here.
    //                
                __objClock              = __objDisable;
                $('#clock_speed').prop('disabled', true);
            }

            $('#debug_option_break').css(__objBreak);
            //$('#debug_option_resume').css(__objResume);
            $('#debug_option_reset').css(__objReset);
            //$('#debug_option_refresh').css(__objRefresh);
            $('#debug_option_run').css(__objRun);
            $('#debug_option_step').css(__objStep);
            $('#clock_speed').css(__objClock);

        };


///////////////////////////////////////////////////////////
//  _fetch_line()                                        //
///////////////////////////////////////////////////////////
//
        const   _fetch_line             = (
            
            ram_view,
            code_line,
            params,
            offset,
            line_number

        ) =>
        {

            __refresh_debug_options(ram_view);
            __refresh_registers(ram_view);
            __refresh_rw_data(ram_view);

            if (code_line === false)
                return;
            
            const   __memtype           =
            [
                'm8', 'm16', '', 'm32'
            ];

    //        console.log(`Updating debugger...`);

            
    //  The active instruction pointer is highlighted...
    //
            $('.cell').removeClass('highlight_ip');

            $(`#${__terminal_id}_data_${offset}`).addClass('highlight_ip');
            $(`#${__terminal_id}_data_${offset + 1}`).addClass('highlight_ip');

            $(`#${__terminal_id}_data_${offset}`).attr('title', `${code_line[0].mnemonic} (${code_line[1]}) instruction at offset ${offset}`);
            $(`#${__terminal_id}_data_${offset + 1}`).attr('title', `${code_line[0].mnemonic} (${code_line[1]}) instruction at offset ${offset}`);
            
            offset += 2;

            for (let param_no = 0; param_no < params.length; param_no++)
            {

                const   __param         = params[param_no];
                let     __value         = ram_view.getUint8(offset);

                if (__param === 2)
                    __value             = ram_view.getUint16(offset, window.little_endian);
                if (__param === 4)
                    __value             = ram_view.getUint32(offset, window.little_endian);

                for (let byte_no = 0; byte_no < __param; byte_no++)
                {
                    $(`#${__terminal_id}_data_${offset + byte_no}`).addClass(`highlight_param${param_no + 1}`);
                    $(`#${__terminal_id}_data_${offset + byte_no}`).attr('title', `Parameter ${param_no} (${code_line[0].mnemonic} (${code_line[1]})): type=${__memtype[__param - 1]}, value=${__value} (0x${__value.toString(16)}}) @ offset ${offset}`);
                }

                offset += __param;

            }

        };


        return {

            initialise:                 _initialise,

            fetch_line:                 _fetch_line

        };

    };

