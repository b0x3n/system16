///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/utils/ConsoleView.js         //
///////////////////////////////////////////////////////////
//
//  Some ugly functions for writing to the console, this
//  is for analysis/debugging and can slow the system
//  down - they can be enabled by seeing be_verbose
//  to true in the objConfigure object - see:
//
//      System16/s16/src/js/s16/s16.js
//


///////////////////////////////////////////////////////////
//  The ConsoleView module.                              //
///////////////////////////////////////////////////////////
//
    export const    ConsoleView         = (

        get_reg,
        set_reg

    ) =>
    {

        let     __format                = window.__s16Defs.S16_NUMBER_FORMAT;


///////////////////////////////////////////////////////////
//  _dump_registers()                                    //
///////////////////////////////////////////////////////////
//
        const   _dump_registers         = segment =>
        {

            window.__s16_verbose(
` IP=${get_reg(segment, 'IP')}, BP=${get_reg(segment, 'BP')}, SP=${get_reg(segment, 'SP')}, FL=${get_reg(segment, 'FL').toString(2)}
  AX=${get_reg(segment, 'AX')}, BX=${get_reg(segment, 'BX')}, CX=${get_reg(segment, 'CX')}, 
  DX=${get_reg(segment, 'DX')}, EX=${get_reg(segment, 'EX')}, FX=${get_reg(segment, 'FX')}, 
`
            );

        };


///////////////////////////////////////////////////////////
//  _print_operands()                                    //
///////////////////////////////////////////////////////////
//
        const   _print_operands     = code_line =>
        {

            let __string_out        = false;

            for (let operand = 6; operand < code_line.length; operand++)
            {
                if (__string_out === false)
                    __string_out = code_line[operand].toString(__format);
                else
                    __string_out += `, ${code_line[operand].toString(__format)}`;
            }

            return __string_out;

        };


///////////////////////////////////////////////////////////
//  __generate_report()                                  //
///////////////////////////////////////////////////////////
//
//  The cycle_stage can be either 'fetch', 'decode' or
//  'execute'.
//
//  If be_verbose is enabled in objConfig this function
//  will be called after every fetch, decode and execute,
//  that's 3 times a cycle!
//
//  Naturally, this is disabled but can be useful if
//  you're trying to track a bug.
//
        const   _generate_report        = (
            
            cycle_stage,
            segment,
            code_line
        
        ) =>
        {

    //  This will be dumped to console after every fetch.
    //
            if (cycle_stage === 'fetch')
                window.__s16_verbose(
` Fetched line (${code_line[2]} bytes) at offset (${code_line[0].toString(__format)}):
    ${code_line[4]} (opcode=${code_line[5]}}) ${_print_operands(code_line)}
    ${_dump_registers(segment)}`
                );


    //  This will be dumped each time a fetched line is
    //  decoded.
    //
            if (cycle_stage === 'decode')
                window.__s16_verbose(
`Decoded line (${code_line[2]} bytes) at offset (${code_line[0].toString(__format)}):
    ${code_line[4]} (opcode=${code_line[5]}, modifiers=${code_line[1].toString(__format)}) ${_print_operands(code_line)}
    ${_dump_registers(segment)}`
                );


    //  This will be dumped after the decoded line has
    //  been executed.
    //
            if (cycle_stage === 'execute')
                window.__s16_verbose(
`Executed line (${code_line[2]} bytes) at offset (${code_line[0].toString(__format)}):
    ${_dump_registers(segment)}`
                );

        };


        return {

            dump_registers:             _dump_registers,
            generate_report:            _generate_report

        };

    };

