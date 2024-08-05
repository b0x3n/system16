///////////////////////////////////////////////////////////
//  System16/s16l/src/core/Translator.mjs                //
///////////////////////////////////////////////////////////
//
//
//


    import { TokenFilters } from        "../../../core/TokenFilters.mjs";


///////////////////////////////////////////////////////////
//  The Translator Module.                               //
///////////////////////////////////////////////////////////
//
    export const    Translator          = (

        objExe,
        objSections,
        messenger

    ) =>
    {


        const   __token_filters         = TokenFilters(
                                            objSections,
                                            messenger
                                        );


///////////////////////////////////////////////////////////
//  _tramslate_token()                                   //
///////////////////////////////////////////////////////////
//
        const   _translate_token        = (
            
            tokens,
            token_no
        
        ) =>
        {

            let     __token             = tokens[token_no];
            let     __modifier          = '';

            if (__token.substr(0, 1) === '#' || __token.substr(0, 1) === '%')
            {
                __modifier = __token.substr(0, 1);
                __token = __token.substr(1);
            }

            if (__token === '')
                return __token;

            if (typeof __token === 'number')
                return __token;

            if (/^[0-9]+$/.test(__token))
                return parseInt(__token);

    //  Does __token reference a register? If so the
    //  __token expands to the register address.
    //
            if (global.S16_REG.hasOwnProperty(__token))
                tokens[token_no] = global.S16_REG[__token];
            else
            {

    //  If it's not a register it's assumed to be a
    //  label.
    //
                const   _objLabel       = objSections[1].lookup(
                                            objSections,
                                            __token
                                        );

                if (! _objLabel)
                    messenger.file_error(tokens, `Reference to undefined label '${__token}'`);

                let     _size           = __token_filters.filter_mem_size(
                                            tokens,
                                            (token_no + 1)
                                        );

                if (_size === false)
                    _size = 0;

                const   _section        = _objLabel.section_no;
                const   _index          = _objLabel.index;
                const   _length         = objSections[_section].objSection.length[_index];

                if (_size >= objSections[_section].objSection.size[_index])
                    messenger.file_error(tokens, `Index ${_size} out of bounds for label '${tokens[token_no]}' (size of ${tokens[token_no]} = ${objSections[_section].objSection.size[_index]})`);

                let     _offset;

                if (_section === 3)
                    _offset = (objSections[_section].objSection.mode[_index] + objExe.code_offset);  
                else if (_section === 4)
                {
                    const   __mode = objSections[_section].objSection.mode[_index];
                    const   __data = objSections[_section].objSection.data[_index].offset;

                    if (__mode !== 'label')
                        messenger.file_error(tokens, `Reference to ENV label '${tokens[token_no]}'`);
                    
                    _offset = (__data + objExe.code_offset);
                }
                else
                {
                    _offset = objSections[_section].objSection.offsets[_index];
                    _offset += ((_length / objSections[_section].objSection.size[_index]) * _size);
                }

                tokens[token_no] = `${__modifier}${_offset}`;

            }

        };


        return {

            translate_token:            _translate_token

        };

    };

