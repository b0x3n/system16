///////////////////////////////////////////////////////////
//  System/core/TokenFilters.mjs                         //
///////////////////////////////////////////////////////////
//
//  Various routines for filtering/transforming tokens.
//


///////////////////////////////////////////////////////////
//  The Resolver module is used to resolve mathematical
//  and conditional expressions.
//
    import { Resolver } from            "./../s16a/src/core/Resolver.mjs";


///////////////////////////////////////////////////////////
//  The TokenFilters module.                             //
///////////////////////////////////////////////////////////
//
    export const    TokenFilters        = (

        objSections,
        messenger

    ) =>
    {


        const   __resolver              = Resolver();


///////////////////////////////////////////////////////////
//  _filter_mem_size()                                   //
///////////////////////////////////////////////////////////
//
//  This is used both in memory declaration and when
//  referencing memory, example:
//
//      m8 _val[3] = 'A', 'B', 'C';
//
//  In this case we use _filter_mem_size() to extract the
//  [<size>] property ([3]) and remove those tokens,
//  returning the value 3.
//
//  With regards to referencing memory, the number is
//  instead an index referencing a specific element of
//  the array:
//
//      $_val[0];
//
//  Will extract the [<index>] tokens and return the value
//  0.
//
//  If no [<size/value>] is found in the tokens at the
//  specified token_start then false is returned, in this
//  case the caller can assume defaults.
//
        const   _filter_mem_size        = (
            
            tokens,
            start_token                 = 4
            
        ) =>
        {
            
    //  Need the opening [ token to continue.
    //
            if (start_token >= tokens.length || tokens[start_token] !== '[')
                return false;

    //  We have an opening [ in tokens[start_token],
    //  if the next token is a ] then false is returned.
    //
            if ((start_token + 1) >= tokens.length)
                return `Unexpected '[' token`;

            if (tokens[(start_token + 1)] === ']')
            {
    //  Filter out the [ and ] tokens.
    //
                tokens.splice(start_token, 2);
                return false;
            }

    //  If tokens[(start_token + 1)] isn't an ] then
    //  we assume for now that it's the size/index
    //  value - check if the closing ] token exists
    //  in tokens[(start_token + 2)],
    //
            if ((start_token + 2) >= tokens.length || tokens[(start_token + 2)] !== ']')
                return `Unexpected '[' token`;

    //  So we now expect that tokens[(start_token + 1)]
    //  is a number specifying a size or index value.
    //
            if (! /^[0-9]+$/.test(tokens[(start_token + 1)]))
            {
                let __objLabel          = false;
                
                if (tokens[(start_token + 1)].substr(0, 1) === '$')
                    __objLabel = objSections[1].lookup(
                        objSections,
                        tokens[(start_token + 1)].substr(1)
                    );

                if  (! __objLabel)
                    return `Invalid size or index property '${tokens[(start_token + 1)]}`;
                
                tokens[(start_token + 1)] = __objLabel.data[0];
            }

            const   _size = parseInt(tokens[(start_token + 1)]);

    //  Filter out the [<size/index>] tokens.
    //
            tokens.splice(start_token, 3);

            return _size;

        };


///////////////////////////////////////////////////////////
//  _filter_string()                                     //
///////////////////////////////////////////////////////////
//
        const   _filter_string          = string =>
        {

            if (string.substr(0, 1) !== "\"")
                return false;

            string = string.substr(1, (string.length - 2));

            const   _char_codes         = [];

            for (let char_no = 0; char_no <= string.length; char_no++)
            {
                if (char_no >= string.length)
                {
                    _char_codes.push(0);
                    break;
                }

                _char_codes.push(string.charCodeAt(char_no));
            }
            
            return _char_codes;

        };


///////////////////////////////////////////////////////////
//  _filter_char()                                       //
///////////////////////////////////////////////////////////
//
        const   _filter_char            = char =>
        {

            if (char.substr(0, 1) !== '\'')
                return false;

            if (char.length < 3)
                return 0;

            return char.charCodeAt(1);

        };


///////////////////////////////////////////////////////////
//  _filter_commas()                                     //
///////////////////////////////////////////////////////////
//
//  Removes any tokens that are commas - commas can be
//  used to separate operands, values, etc - but this is
//  not enforced, it's completely optional as they're
//  discarded here.
//
        const   _filter_commas          = tokens =>
        {

            for (let token_no = 3; token_no < tokens.length; token_no++)
            {

                if (typeof tokens[token_no] === 'number')
                    continue;

                if (tokens[token_no] === ',')
                {
                    tokens.splice(token_no--, 1);
                    continue;
                }

    //  We will also filter char and string tokens
    //  here.
    //
                if (tokens[token_no].substr(0, 1) === '\'')
                {
                    const   _char_code  = _filter_char(tokens[token_no]);

                    if (! _char_code)
                        messenger.file_error(tokens, `Unexpected ' character`);

                    tokens[token_no] = _char_code;

                    continue;
                }

                if (tokens[token_no].substr(0, 1) === "\"")
                {
                    const   _char_codes = _filter_string(tokens[token_no]);

                    if (! _char_codes)
                        messenger.file_error(tokens, `Unexpected " character`);

                    tokens.splice(token_no, 1, ..._char_codes);
                }

            }

        };


///////////////////////////////////////////////////////////
//  _filter_variables()                                  //
///////////////////////////////////////////////////////////
//
        const   _filter_variables       = (
            
            tokens,
            is_code_section             = false

        ) =>
        {

            let     __start_param       = 3;

            if (is_code_section)
                __start_param = 2;

            for (let token_no = 0; token_no < tokens.length; token_no++)
            {

                let     _token          = tokens[token_no];
                let     _index          = 0;

    //  If it's not a memory declaration, e.g:
    //
    //      m8  buffer[10]  = "buffer";
    //
    //  We want to translate m8, m16 and m32 tokens to
    //  the actual size, so:
    //
    //      m8  sizeof_m8   = m8;
    //      m16 sizeof_m16  = m16;
    //      m32 sizeof_m32  = m32;
    //
    //  Is the same as doing:
    //
    //      m8  sizeof_m8   = 1;
    //      m16 sizeof_m16  = 2;
    //      m32 sizeof_m32  = 4;
    //
                if (token_no >= __start_param)
                {
                    if (global.S16_MEMTYPES.indexOf(_token) >= 0)
                        tokens[token_no] = global.S16_MEMSIZE(_token).toString();
                    continue;
                }

                if (typeof _token !== 'string')
                    continue;

                if (_token.substr(0, 1) !== '$')
                    continue;

                let     _objLabel       = false;

                for (let section_no = 1; section_no < 5; section_no++)
                {

                    let __objLabel      = objSections[section_no].get(_token.substr(1));

                    if (! __objLabel)
                        continue;

                    _objLabel = __objLabel;

        //  Is there an [<index>]?
        //
                    const   __index = _filter_mem_size(tokens, (token_no + 1));

                    if (typeof __index === 'string')
                        messenger.file_error(tokens, __index);
                    
                    if (__index === false)
                        _index = 0;
                    else
                        _index = __index;

                    break;

                }

                if (_objLabel === false)
                    messenger.file_error(tokens, `Reference to undefined label '${_token.substr(1)}'`);

                if (_index >= _objLabel.size)
                    messenger.file_error(tokens, `Reference to '${_token.substr(1)}[${_index}]' - index out of bounds (size of ${_token.substr(1)} = ${_objLabel.size})`);

                tokens[token_no] = _objLabel.data[_index];

            }

        };


///////////////////////////////////////////////////////////
//  _filter_expressions()                                //
///////////////////////////////////////////////////////////
//
        const   _filter_expressions     = tokens =>
        {

            const   __expr_result       = __resolver.parse_expr(tokens);

            if (typeof __expr_result === 'string')
                messenger.file_error(tokens, __expr_result);

        };


///////////////////////////////////////////////////////////
//  _filter_all()                                        //
///////////////////////////////////////////////////////////
//
        const   _filter_all             = (
            
            tokens,
            is_code_section             = false

        ) =>
        {

            _filter_commas(tokens);
            _filter_variables(tokens, is_code_section);
            _filter_expressions(tokens);

        };


        return {

            filter_mem_size:            _filter_mem_size,
            
            filter_commas:              _filter_commas,
            filter_variables:           _filter_variables,
            filter_expression:          _filter_expressions,
            
            filter_all:                 _filter_all

        };

    };

