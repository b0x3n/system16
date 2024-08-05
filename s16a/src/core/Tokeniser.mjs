///////////////////////////////////////////////////////////
//  System16/s16a/src/core/Tokeniser.mjs                 //
///////////////////////////////////////////////////////////
//
//  
//



///////////////////////////////////////////////////////////
//  The Tokeniser module.                                //
///////////////////////////////////////////////////////////
//
    export const    Tokeniser           = (

        errorHandler

    ) =>
    {


///////////////////////////////////////////////////////////
//  __is_whitespace_char()                               //
///////////////////////////////////////////////////////////
//
//  Will return true if the specified input_char is a
//  whitespace character.
//
        const   __is_whitespace_char    = input_char =>
        {

            let     whitespace_chars    =
            [
                " ", "\t", "\n"
            ];

            if (whitespace_chars.indexOf(input_char) >= 0)
                return true;

            return false;

        };


///////////////////////////////////////////////////////////
//  __is_single_char()                                   //
///////////////////////////////////////////////////////////
//
//  Will return true if the specified input_char is a
//  single character token.
//
        const   __is_single_char        = input_char =>
        {

            let     single_token_chars  =
            [
                "(", ")", "[",
                "]", "{", "}",
                ",", "?", "@"
            ];

            if (single_token_chars.indexOf(input_char) >= 0)
                return true;

            return false;

        };


///////////////////////////////////////////////////////////
//  __is_quote_char()                                    //
///////////////////////////////////////////////////////////
//
//  Will return true if the specified input_char is a
//  quote character.
//
        const   __is_quote_char         = input_char =>
        {

            let     quote_chars         = [
                "\"", "'", "`"
            ];

            if (quote_chars.indexOf(input_char) >= 0)
                return true;

            return false;

        };


///////////////////////////////////////////////////////////
//  __parse_tokens()                                     //
///////////////////////////////////////////////////////////
//
//  Will parse individual lines into an array of tokens.
//
        const   __parse_tokens          = line_data =>
        {

            let     input_data          = line_data.trim();

            let     input_byte;
            let     input_index         = 0;
            let     input_token         = "";

            let     input_previous      = "";

            let     quote_char          = false;

            let     tokens              = [];

    ///////////////////////////////////////////////////////
    //  __addToken()
    //
    //  Will add the input_token to the tokens array
    //  and reset input_token in preparation for the
    //  next input token.
    //
            const   __add_token = () =>
            {
                if (input_token.trim() !== "")
                    tokens.push(input_token.trim())          
                input_token = "";
            };


    //  The line is processed one byte at a time...
    //
            while (input_index < input_data.length)
            {
                input_byte = input_data.substr(input_index, 1);

    //  Any unquoted whitespace is discarded.
    //
                if (__is_whitespace_char(input_byte))
                {
                    input_index++;
                    input_previous = input_byte;

                    continue;
                }

                if (input_byte === '#' || input_byte === '%')
                {
                    if (input_data.substr((input_index + 1), 1) === '(')
                    {
                        input_token = input_data.substr(input_index, 2);
                        input_index += 2;

                        __add_token();

                        continue;
                    }                    
                }

    //  A single-character token is basically a token
    //  with one single character - for example, any
    //  mathematical operators such as +, /, *, etc.
    //
                if (__is_single_char(input_byte))
                {
                    input_token = input_byte;
                    input_index++;
                    input_previous = input_byte;

                    __add_token();
                    
                    continue;
                }

        //  Quote characters open a new string token, everything
        //  up to the next (un-escaped) matching closing quote
        //  is collected in the input_token buffer.
        //
                if (__is_quote_char(input_byte) && input_previous !== '\\')
                {
                    quote_char = input_byte;
                    input_token += input_byte;

                    input_index++;

                    while (input_index < input_data.length)
                    {
                        input_byte = input_data.substr(input_index, 1);
                        
                        if (input_byte === quote_char && input_previous !== '\\')
                        {
                            input_token += input_byte;
                            input_index++;
                            
                            break;
                        }

                        input_token += input_byte;

                        input_previous = input_byte;
                        input_index++;
                    }

                    __add_token();

                    continue;
                }

    //  Anything else is a collection of input characters
    //  until we find a line terminator (semi-colon or
    //  newline) or we find a whitespace, single-character
    //  or quote character token.
    //
                while (input_index < input_data.length)
                {
                    input_byte = input_data.substr(input_index, 1);

                    if (
                        input_byte === ";"              ||
                        input_byte === "\n"             ||
                        __is_whitespace_char(input_byte)  ||
                        __is_single_char(input_byte)      ||
                        __is_quote_char(input_byte)       
                    )
                    {
    //  ; and \n are discarded here.
    //
                        if (input_byte === ";" || input_byte === "\n")
                            input_index++;

                        __add_token();

                        break;
                    }

                    input_token += input_byte;

                    input_previous = input_byte;
                    input_index++;
                }

            }

            __add_token();

            return tokens;

        };


///////////////////////////////////////////////////////////
//  __parse_lines()                                      //
///////////////////////////////////////////////////////////
//
//  Will parse the inputFileData into an array of lines.
//
        const   _parse_lines            = (

            input_file_path,
            input_file_data

        ) =>
        {

            // if (typeof input_file_data === 'undefined')
            //     return [];

            let     input_data = input_file_data.replace(/(?:\\[r])+/g, "");

            let     input_previous      = "";
            let     input_index         = 0;

            let     line_number         = 1;
            let     code_line           = 1;

            let     input_line          = "";
            let     quote_char          = false;

            let     line_tokens         = [];

    ///////////////////////////////////////////////////////
    //  __add_line()
    //
    //  Parses input_line into tokens then pushes the
    //  token array to the input line_tokens array.
    //
    //  The input_line buffer is then reset for the
    //  next line.
    //
            const   __add_line = () =>
            {
                if (input_line.trim() !== "")
                {
    //  The line is parsed into an array of tokens
    //  via a call to the __parse_tokens() method.
    //
                    line_tokens.push(__parse_tokens(`${input_file_path} ${code_line} ${input_line}`));
                    input_line = "";
                }

                code_line = line_number;
            };

    ///////////////////////////////////////////////////////
    //  __skip_comment()
    //
    //  Discard // style comments (everything up to the
    //  next newline is skipped).
    //
            const   __skip_comment = () =>
            {
                while (input_index < input_data.length) {
                    if (input_data.substr(input_index, 1) === "\n")
                        break;
                    input_index++;
                }
            }

    //  The data is processed one byte at a time...
    //
            while (input_index < input_data.length)
            {
                // if (errorHandler.get_errors())
                //     return false;

                if (input_data.substr(input_index, 2) === '//')
                {
                    __skip_comment();
                    continue;
                }

    //  Grab the next byte of input.
    //
                let     input_byte = input_data.substr(input_index, 1);

    //  Handle newlines.
    //
                if (input_byte === "\r")
                {
                    if (input_data.substr((input_index + 1), 1) === "\n")
                        input_byte = input_data.substr(++input_index, 1);
                    else
                        input_byte = "\n";
                }

    //  We always count newlines in line_number, but
    //  code_line is only updated after a line
    //  terminates - a single line of code can
    //  contain multiple lines.
    //
                if (input_byte === "\n")
                    line_number++;

    //  An unterminated semi-colon ends a line of code.
    //
                if ((input_byte === ';' || input_byte === "\n") && quote_char === false)
                {
                    input_index++;
                    __add_line();
                    continue;
                }

    //  Keep track of quoted strings.
    //
                if (__is_quote_char(input_byte) && input_previous !== '\\')
                {
                    if (quote_char)
                    {
                        if (input_byte === quote_char)
                            quote_char = false;
                    }
                    else
                        quote_char = input_byte;
                }

    //  All characters are collected in input_line and
    //  we advance to the next input byte.
    //
                input_line += input_byte;

                input_previous = input_byte;
                input_index++;
            }

            if (quote_char)
                messenger.error(`Error in file ${input_file_path}, line ${code_line}: Unterminated quoted string`);

            __add_line();
        
            return line_tokens;

        };


        return {

            parse_lines:        _parse_lines

        };

    };
