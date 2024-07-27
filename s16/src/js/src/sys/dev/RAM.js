///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/RAM.js               //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The RAM module.                                      //
///////////////////////////////////////////////////////////
//
    export const    RAM                 = (

        objConfigure,
        messenger

    ) =>
    {

        const   _ram                    = [];


///////////////////////////////////////////////////////////
//  __initialise_ram()                                   //
///////////////////////////////////////////////////////////
//
        const   _initialise_ram         = (

            segments                    = 16,
            max_addr                    = 0xFFFF

        ) =>
        {

            if (_ram.length)
                return _ram;

            messenger.verbose(` Initialising ram:\n  Segments:     ${segments}\n  segment size: ${(max_addr + 1)}`);

            for (let segment_no = 0; segment_no < segments; segment_no++)
                _ram.push(new ArrayBuffer(max_addr + 1));

            return _ram;

        };


        const   __to_uint8_array        = (
            
            number,
            size                        = 4
        
        ) =>
        {

            let arr                     = new Uint8Array(size);
            
            for (let i = 0; i < size; i++) {
                arr[i] = number % 256;
                number = Math.floor(number / 256);
            }
            
            return arr;

        };


        const   __to_num               = uint8 =>
        {
            let number = 0;
          
            for (let i = 7; i >= 0; i--) {
                number = number * 256 + uint8[i];
            }
          
            return number;

        };


///////////////////////////////////////////////////////////
//  _read_byte()                                         //
///////////////////////////////////////////////////////////
//
        const   _read_byte              = (
            
            offset,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);

            return ram_view.getUint8(offset);

        };


///////////////////////////////////////////////////////////
//  _read_word()                                         //
///////////////////////////////////////////////////////////
//
        const   _read_word              = (

            offset,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            const   __word              = __to_uint8_array(ram_view.getUint16(offset), 2);

            //return new DataView(__word.buffer).getUint16(0)

            return __to_num(__word);

        };


///////////////////////////////////////////////////////////
//  _read_dword()                                        //
///////////////////////////////////////////////////////////
//
        const   _read_dword             = (

            offset,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            const   __dword             = __to_uint8_array(ram_view.getUint16(offset), 4);

            //return ram_view.getUint16(offset, window.little_endian);

            return __to_num(__dword);

        };


///////////////////////////////////////////////////////////
//  _read_byte_32()                                      //
///////////////////////////////////////////////////////////
//
        const   _read_byte_32           = (

            offset,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            
            if (window.little_endian)
                return ram_view.getUint8(offset);
            else
                return ram_view.getUint8(offset + 3);

        };


///////////////////////////////////////////////////////////
//  _read_byte_16()                                      //
///////////////////////////////////////////////////////////
//
        const   _read_byte_16           = (

            offset,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            
            if (window.little_endian)
                return ram_view.getUint8(offset);
            else
                return ram_view.getUint8(offset + 1);

        };


///////////////////////////////////////////////////////////
//  _read_word_32()                                      //
///////////////////////////////////////////////////////////
//
        const   _read_word_32           = (

            offset,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            const   __word              = new Uint8Array(2);

            if (window.little_endian)
            {
                __word[0] = ram_view.getUint8(offset + 0);
                __word[1] = ram_view.getUint8(offset + 1);
            }
            else
            {
                __word[0] = ram_view.getUint8(offset + 3);
                __word[1] = ram_view.getUint8(offset + 2);
            }

            console.log(`>>> DATA ARRAY (WORD_ )=== ${new DataView(__word.buffer).getUint16(0, window.little_endian)}`)

            return __to_num(__word);

        };


///////////////////////////////////////////////////////////
//  _write_byte()                                        //
///////////////////////////////////////////////////////////
//
        const   _write_byte             = (

            offset,
            byte,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);

            return ram_view.setUint8(offset, byte);

        };


///////////////////////////////////////////////////////////
//  _write_word()                                        //
///////////////////////////////////////////////////////////
//
        const   _write_word             = (

            offset,
            word,
            segment                     = 0

        ) =>
        {

            const   __ram_view          = new DataView(_ram[segment]);
            const   __word              = __to_uint8_array(word);

            if (window.little_endian)
            {
                __ram_view.setUint8(offset, __word[0]);
                __ram_view.setUint8((offset + 1), __word[1]);
            }
            else
            {
                __ram_view.setUint8(offset, __word[1]);
                __ram_view.setUint8((offset + 1), __word[0]);
            }

        };


///////////////////////////////////////////////////////////
//  _write_dword()                                       //
///////////////////////////////////////////////////////////
//
        const   _write_dword            = (

            offset,
            dword,
            segment                     = 0

        ) =>
        {

            const   __ram_view          = new DataView(_ram[segment]);
            const   __dword             = __to_uint8_array(dword);

            if (window.little_endian)
            {
                __ram_view.setUint8(offset, __dword[0]);
                __ram_view.setUint8((offset + 1), __dword[1]);
                __ram_view.setUint8((offset + 2), __dword[2]);
                __ram_view.setUint8((offset + 3), __dword[3]);
            }
            else
            {
                __ram_view.setUint8(offset, __dword[3]);
                __ram_view.setUint8((offset + 1), __dword[2]);
                __ram_view.setUint8((offset + 2), __dword[1]);
                __ram_view.setUint8((offset + 3), __dword[0]);
            }

        };

///////////////////////////////////////////////////////////
//  _write_word_32()                                     //
///////////////////////////////////////////////////////////
//
        const   _write_word_32          = (

            offset,
            word,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            const   __word              = new Uint8Array(2);

            __word = word;

            if (window.little_endian)
            {
                ram_view.setUint8(offset, __word[0]);
                ram_view.setUint8((offset + 1), __word[1]);
            }
            else
            {
                ram_view.setUint8((offset + 3), __word[0]);
                ram_view.setUint8((offset + 2), __word[1]);
            }

        };


///////////////////////////////////////////////////////////
//  _write_byte_16()                                     //
///////////////////////////////////////////////////////////
//
        const   _write_byte_16          = (

            offset,
            byte,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            
            if (window.little_endian)
                return ram_view.getUint8(offset);
            else
                return ram_view.getUint8(offset + 1);

        };


///////////////////////////////////////////////////////////
//  _write_byte_32()                                     //
///////////////////////////////////////////////////////////
//
        const   _write_byte_32          = (

            offset,
            byte,
            segment                     = 0

        ) =>
        {

            const   ram_view            = new DataView(_ram[segment]);
            
            if (window.little_endian)
                return ram_view.getUint8(offset);
            else
                return ram_view.getUint8(offset + 3);

        };


        return {

            initialise_ram:             _initialise_ram,

            ram:                        _ram,

            read_byte:                  _read_byte,
            read_word:                  _read_word,
            read_dword:                 _read_dword,
            read_byte_32:               _read_byte_32,
            read_byte_16:               _read_byte_16,
            read_word_32:               _read_word_32,

            write_byte:                 _write_byte,
            write_word:                 _write_word,
            write_dword:                _write_dword,
            write_word_32:              _write_word_32,
            write_byte_16:              _write_byte_16,
            write_byte_32:              _write_byte_32,


        };

    };

