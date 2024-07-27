///////////////////////////////////////////////////////////
//  System16/s16a/src/core/Preprocessor.mjs              //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  Import Keywords - this will import the various
//  .js files in:
//
//      System16/core/defs/
//
//  And:
//
//      System16/s16a/src/core/defs/
//
    import * as GlobalKeywords from     "./defs/Keywords.js";


///////////////////////////////////////////////////////////
//  Import any required shared code modules.
//
    import { LoadFile } from            "./../../../core/LoadFile.mjs";
    import { Section } from             "./../../../core/Section.mjs";
    import { TokenFilters } from        "./../../../core/TokenFilters.mjs";


///////////////////////////////////////////////////////////
//  Import any required s16a modules.
//
    import { Tokeniser } from           "./Tokeniser.mjs";


///////////////////////////////////////////////////////////
//  The Preprocessor module                              //
///////////////////////////////////////////////////////////
//
    export const    Preprocessor        = (

        objConfigure,
        messenger

    ) =>
    {


        const   _objSections            = [global.S16A_SECTIONS.length];


///////////////////////////////////////////////////////////
//  Quick handle to the global.S16A_SECTION function, see:
//
//      System16/s16a/src/core/defs/Sections.js
//
        const   __sect                  = global.S16A_SECTION;


        const   _asm_paths              = [];


        const   __token_filters         = TokenFilters(
                                            _objSections,
                                            messenger
                                        );


        let     __code_size             = 0;


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

    //  The Section module allows us to label and store
    //  data - this is used to store global constants,
    //  variables and code as well as environment
    //  variables, see:
    //
    //      System16/s16a/core/src/Section.mjs
    //
    //  For more info.
    //
            _objSections[__sect('header')]   = [];
            _objSections[__sect('ro')]       = Section();
            _objSections[__sect('rw')]       = Section();
            _objSections[__sect('code')]     = Section();
            _objSections[__sect('env')]      = Section();

        };


///////////////////////////////////////////////////////////
//  __indent_output()                                     //
///////////////////////////////////////////////////////////
//
        const   __indent_output         = (
            
            depth,
            indent_char = ' '
        
        ) =>
        {

            let     _str = '';

            for (let ch_no = 0; ch_no < depth; ch_no++)
                _str += indent_char;

            return _str;

        };


///////////////////////////////////////////////////////////
//  __directive_section()                                //
///////////////////////////////////////////////////////////
//
        const   __directive_section     = (
            
            tokens,
            include_depth
        
        ) =>
        {

    //  Section expects exactly one parameter in tokens[3],
    //  the name of the section to switch to, see:
    //
    //      System16/s16a/src/core/defs/Sections.js
    //
            if (tokens.length != 4)
                messenger.file_error(tokens, `The .section directive requires exactly one parameter`);

            const   _section_id = __sect(tokens[3]);

            if (_section_id === false)
                messenger.file_error(tokens, `'${tokens[3]}' is not a valid section identifier`);

            messenger.verbose(` ${__indent_output(include_depth)}Switched to section ${tokens[3]}...\n`);
            
    //  Return the index of the new section.
    //
            return __sect(tokens[3]);

        };


///////////////////////////////////////////////////////////
//  __directive_include()                                //
///////////////////////////////////////////////////////////
//
        const   __directive_include     = (

            tokens,
            include_depth

        ) =>
        {

    //  We need at least one parameter.
    //
            if (tokens.length < 4)
                messenger.file_error(tokens, `The .include directive expects at least one parameter`);

            for (let token_no = 3; token_no < tokens.length; token_no++)
            {
                let     _token = tokens[token_no];

    //  Strip single or double quotes from file names.
    //
                if (_token.substr(0, 1) === '\'' || _token.substr(0, 1) === "\"")
                {
                    if (_token.length === 2)
                        _token = '';
                    else
                        _token = _token.substr(1, (_token.length - 2));
                }

                __preprocess_file(
                    _token,
                    (include_depth + 1),
                    tokens[0],
                    tokens[1]
                );
            }

        };


///////////////////////////////////////////////////////////
//  __preprocess_directive()                             //
///////////////////////////////////////////////////////////
//
        const   __preprocess_directive  = (
            
            tokens,
            include_depth
        
        ) =>
        {

    //  Directive are all defined in:
    //
    //      System16/s16a/src/core/defs/Directives.js
    //
            const   __directive         = global.S16A_DIRECTIVES.indexOf(tokens[2]);

            if (__directive < 0)
                messenger.file_Error(tokens, `Unknown directive '${tokens[2]}'`);

    //  The section directive is used to switch between
    //  sections and requires tokens[3] as a parameter.
    //
            if (tokens[2] === global.S16A_DIRECTIVE_SECTION)
                return __directive_section(
                    tokens,
                    include_depth
                );

    //  The section directive is used to switch between
    //  sections and requires tokens[3] as a parameter.
    //
            if (tokens[2] === global.S16A_DIRECTIVE_INCLUDE)
                return __directive_include(
                    tokens,
                    include_depth
                );

        };


///////////////////////////////////////////////////////////
//  __process_header_tokens()                            //
///////////////////////////////////////////////////////////
//
        const   __process_header_tokens = tokens =>
        {

            return;

        };


///////////////////////////////////////////////////////////
//  __process_mem_tokens()                               //
///////////////////////////////////////////////////////////
//
        const   __process_mem_tokens    = (
            
            tokens,
            current_section,
            include_depth
        
        ) =>
        {
            
    //  We need at least two tokens (tokens 2 & 3)
    //
    //  tokens[2] is the type, tokens[3] the label.
    //
            if (global.S16_MEMTYPES.indexOf(tokens[2]) < 0)
                messenger.file_error(tokens, `'${tokens[2]}' is not a valid type`);

            if (tokens.length < 4)
                messenger.file_error(tokens, `Declaration of ${tokens[2]} requires a label`);

            const   _objLabel           = _objSections[1].lookup(
                _objSections,
                tokens[3]
            );

            if (_objLabel)
                messenger.file_error(tokens, `Cannot declare '${tokens[3]}' - label already declared`);
            
    //  Do we have a [<size>] property? See:
    //
    //      System16/s16a/src/core/TokenFilter.mjs
    //
    //  filter_mem_size() will return a string on error,
    //  false if no [<size>] is speciied, or the <size>
    //  token - the [<size>] tokens are removed from
    //  the tokens array.
    //
            let _size = __token_filters.filter_mem_size(tokens);
            let _data = [];

            if (typeof _size === 'string')
                messenger.file_out(tokens, _size);

    //  The label can't match any keywords - see:
    //
    //      System16/s16a/src/core/defs/Keywords.js
    //
            if (global.S16A_KEYWORDS.indexOf(tokens[3]) >= 0)
                messenger.file_error(tokens, `'${tokens[3]}' is a reserved keyword`);

            if (_size === false)
                _size = 1;

    //  Is this an assignment? If so, tokens[4] should
    //  contain the = token and the following tokens are
    //  the values being assigned.
    //
            if (tokens.length >= 5)
            {
                if (tokens[4] !== '=')
                    messenger.file_error(tokens, `Unexpected token '${tokens[4]}' following memory declaration`);
                for (let token_no = 5; token_no < tokens.length; token_no++)
                    _data.push(tokens[token_no])
            }

            if (_data.length > _size)
                messenger.file_error(tokens, `Attempt to assign ${_data.length} values to ${tokens[3]}[${_size}]`);

    //  Write the data to memory, see the Section module:
    //
    //      System16/s16a/src/core/Section.mjs
    //
            const   __section_result = _objSections[current_section].set(
                tokens[3],
                tokens[0],
                tokens[1],
                __sect(current_section),
                tokens[2],
                _size,
                _data
            );

            if (typeof __section_result === 'string')
                messenger.file_error(tokens, __section_result);

            messenger.verbose(`${__indent_output(include_depth)}  Declared ${tokens[2]} ${tokens[3]}[${_size}] = ${_data}\n`);

        };


///////////////////////////////////////////////////////////
//  __process_code_label()                               //
///////////////////////////////////////////////////////////
//
        const   __process_code_label    = (
            
            tokens,
            function_name,
            function_size,
            include_depth

        ) =>
        {

    //  The @ token should be in tokens[2], label name in
    //  tokens[3].
    //
            if (tokens.length < 4 || tokens[2] !== '@')
                return false;

            if (! /^[a-zA-Z_][a-zA-Z0-9_]+$/.test(tokens[3]))
                messenger.file_error(tokens, `Invalid label '${tokens[3]}'`);

            if (global.S16A_KEYWORDS.indexOf(tokens[3]) >= 0)
                messenger.file_error(tokens, `'${tokens[3]}' is a reserved keyword`);

            if (tokens.length > 4)
                messenger.file_error(tokens, `Unexpected tokens following label declaration`);

            const   _objLabel           = _objSections[1].lookup(
                                            _objSections,
                                            tokens[2]
                                        );

            if (_objLabel)
                messenger.file_error(tokens, `Label '${tokens[3]}' already exists (${_objLabel.type} ${_objLabel.label}[${_objLabel.size}] in ${_objLabel.type})`)

    //  
    //
            _objSections[__sect('env')].set(
                tokens[3],
                tokens[0],
                tokens[1],
                'label',
                'm32',
                2,
                { 'function': function_name, 'offset': (function_size - 2) }
            );

            messenger.verbose(`${__indent_output(include_depth)}   Declared address label ${tokens[3]} at offset ${function_size}\n`);

            return true;

        };


///////////////////////////////////////////////////////////
//  __check_code()                                       //
///////////////////////////////////////////////////////////
//
        const   __check_code            = (
            
            tokens,
            function_size,
            include_depth
        
        ) =>
        {

            let     _line_size = 2;

    //  Ensure that tokens[2] contains a valid mnenonic.
    //
            if (! global.S16_MNEMONICS.hasOwnProperty(tokens[2]))
                messenger.file_error(tokens, `Invalid mnemonic instruction '${tokens[2]}'`);

            const   _objMnemonic        = global.S16_MNEMONICS[tokens[2]];

            _objMnemonic.params.forEach(param => {
                _line_size += param
            });

            tokens[2] = _objMnemonic.opcode;
            
            messenger.verbose(`${__indent_output(include_depth)}   ${global.S16_MNEMONIC_BY_OPCODE(tokens[2]).mnemonic} (${tokens[2].toString(2)}) instruction at offset ${function_size} (${_line_size} bytes)\n`);
            
            return _line_size;

        };


///////////////////////////////////////////////////////////
//  __process_code_tokens()                              //
///////////////////////////////////////////////////////////
//
        const   __process_code_tokens   = (
            
            lines,
            line_no,
            include_depth
        
        ) =>
        {

            const   _tokens             = lines[line_no++];
            const   _data               = [];
            const   _addr               = [];

            let     __function_size     = 2;

            if (_tokens[2] !== global.S16A_KEYWORD_FUNCTION)
                messenger.file_error(_tokens, `Unexpected token '${_tokens[2]}'`);

            if (_tokens.length < 4)
                messenger.file_name(_tokens, `Function declaration requires a label`);
            if (_tokens.length > 4)
                messenger.file_name(_tokens, `Unexpected token following function declaration`);

            if ((global.S16A_KEYWORDS.indexOf(_tokens[3]) >= 0) && _tokens[3] !== global.S16A_KEYWORD_MAIN)
                messenger.file_error(_tokens, `'${_tokens[3]}' is a reserved keyword`);

            const   __objLabel              = _objSections[1].lookup(
                                                _objSections,
                                                _tokens[3]
                                            );

            if (__objLabel)
                messenger.file_error(_tokens, `Cannot declare function '${_tokens[3]}' - label already declared`);
            
            messenger.verbose(`${__indent_output(include_depth)}  Declaration of function ${_tokens[3]}:\n`);

            while (line_no <= lines.length)
            {
                if (line_no === lines.length)
                    messenger.file_error(_tokens, `Function ${_tokens[3]} has no end statement`);

                const   __tokens        = lines[line_no];

                if (__tokens.length < 2)
                {
                    line_no++;
                    continue;
                }

                __token_filters.filter_all(__tokens);

                if (__tokens[2] === global.S16A_KEYWORD_END)
                    break;

    //  We have a valid line - is it a label?
    //
                if (__process_code_label(
                    __tokens,
                    _tokens[3],
                    __function_size,
                    include_depth
                ))
                {
                    line_no++;
                    continue;
                }
                
    //  Not a label, it's a line of code - quick
    //  check before it's added to the section.
    //
                const   __line_size = __check_code(
                    __tokens,
                    __function_size,
                    include_depth
                );

    //  The relative address/offset is stored in
    //  the _addr array.
    //
                _addr.push(__line_size);
                _data.push(__tokens);

                __function_size += __line_size;

                line_no++;

            }

    //  Any code for the function will be collected in
    //  the _data array.
    //
            _objSections[__sect('code')].set(
                _tokens[3],
                _tokens[0],
                _tokens[1],
                __code_size,
                'm8',
                __function_size,
                { 'offset': _addr, 'data': _data }
            );

            __code_size += __function_size;

            messenger.verbose(`${__indent_output(include_depth)}  End of function ${_tokens[3]}, ${__function_size} total bytes\n`);

            return line_no;

        };


///////////////////////////////////////////////////////////
//  __preprocess_input_file()                            //
///////////////////////////////////////////////////////////
//
        const   __preprocess_file       = (

            file_name,
            include_depth               = 1,
            include_path                = false,
            include_line                = false

        ) =>
        {

    //  Is there a max include_depth?
    //
            if (objConfigure.include_depth > 0 && include_depth > objConfigure.include_depth)
                messenger.file_error([ include_path, include_line ], `Cannot include file ${file_name} - include depth (${objConfigure.include_depth}) reached`);

    //  Every file opens automatically in the header
    //  section.
    //
            let     _current_section    = global.S16A_SECTION('header');

    //  The LoadFile module will attempt to load the file,
    //  on error will return a string containing an error
    //  message.
    //
    //  See System16/core/LoadFile.mjs for more info.
    //
            const   _objLoadFile        = LoadFile(
                                            file_name,
                                            messenger,
                                        );

            const   __parent_directory  = process.cwd();
            let     __action            = "Preprocessing";

            if (typeof _objLoadFile === 'string')
                messenger.error(_objLoadFile);

    //  Temporarily cd to the directory the file is stored
    //  in, makes it easier for .include directives to 
    //  manage relative paths.
    //
            process.chdir(_objLoadFile.dir);

            if (_asm_paths.indexOf(_objLoadFile.path) >= 0)
            {
                if (include_path)
                    messenger.file_error([ include_path, include_line ], `File '${file_name}' included more than once`);
                else
                    messenger.error(`File '${file_name}' included more than once`);
            }

            if (objConfigure.include_max > 0 && _asm_paths.length >= objConfigure.include_max)
            {
                if (include_path)
                    messenger.file_error([ include_path, include_line ], `Cannot load input file '${file_name}' - include max (${objConfigure.include_max}) reached`);
                else
                    messenger.error(`Cannot load input file '${file_name}' - include max (${objConfigure.include_max}) reached`);
            }

    //  Keep track of all files loaded during the assembly.
    //  
            _asm_paths.push(_objLoadFile.path);

            if (include_path)
                __action = "Including";

            messenger.verbose(`${__indent_output(include_depth)}${__action} input file ${_objLoadFile.path}, ${_objLoadFile.data.length} bytes...\n`);
            messenger.verbose(` ${__indent_output(include_depth)}Switched to the ${__sect(_current_section)} section...\n`);

    //  Now the Tokeniser module is used to parse the input
    //  into an array of tokenised lines - see:
    //
    //      System16/s16a/src/core/Tokeniser.mjs
    //
    //  For more information.
    //
            const   __tokeniser         = Tokeniser(messenger);
            const   __lines             = __tokeniser.parse_lines(
                                            _objLoadFile.path,
                                            _objLoadFile.data
                                        );

    //`Process the input file one line at a time.
    //
            for (let line_no = 0; line_no < __lines.length; line_no++)
            {

    //  Each line is an array of tokens - tokens 0 and 1
    //  always contain the file path and line number.
    //
    //  So this means if we have < 3 tokens we have an
    //  empty line that we can safely skip.
    //
                const   _tokens = __lines[line_no];

                if (_tokens < 3)
                    continue;

    //  Filter the tokens, this does a few different things,
    //  see:
    //
    //      System16/s16a/src/core/TokenFilters.mjs
    //
    //  For more info.
    // 
                __token_filters.filter_all(_tokens);

                
    //  Do we have a .directive?
    //
                if (_tokens[2].substr(0, 1) === '.')
                {
                    _current_section = __preprocess_directive(
                                            _tokens,
                                            include_depth
                                        );
                    continue;
                }

    //  If it's not a directive it's a line to be added
    //  to the current section.
    //
                if (_current_section === __sect('header'))
                    __process_header_tokens(_tokens);
                else if (_current_section === __sect('code'))
                    line_no = __process_code_tokens(
                        __lines,
                        line_no,
                        include_depth
                    );
                else
                    __process_mem_tokens(
                        _tokens,
                        _current_section,
                        include_depth
                    );

            }

            process.chdir(__parent_directory);
            messenger.verbose(`${__indent_output(include_depth)}Done preprocessing file ${file_name}.\n`);

        };


///////////////////////////////////////////////////////////
//  __preprocess()                                       //
///////////////////////////////////////////////////////////
//
        const   _preprocess             = () =>
        {

            const   __asm_files         = objConfigure.asm_files;

            messenger.verbose(`Running assembler...\n`);

    //  Every assembly input file must be fed into the
    //  preprocessor...
    //
            for (let file_no = 0; file_no < __asm_files.length; file_no++)
            {

                const   _file_name = __asm_files[file_no];

                __preprocess_file(_file_name);

            }

        };


        __initialise();


        return {

            preprocess:                 _preprocess,

            objSections:                _objSections,
            asm_paths:                  _asm_paths

        };

    };

