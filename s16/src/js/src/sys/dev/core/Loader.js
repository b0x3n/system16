///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/core/Loader.js       //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The DisplayInfo module.                              //
///////////////////////////////////////////////////////////
//
    export const    Loader              = (

        objConfigure,
        messenger,
        ram

    ) =>
    {

        const   _load_file              = (
            
            file_name,
            successCallback,
            errorCallback

        ) =>
        {

            const req = new XMLHttpRequest();

            req.open("GET", file_name, false);

            req.onload = (event) => {
                const   string_2_arraybuffer = (
                    
                    str,
                    size                        = 2

                ) =>
                {
                    var buf         = new ArrayBuffer(str.length * size);
                    var buf_view;
                    
                    if (size === 1)
                        buf_view = new Uint8Array(buf);
                    else
                        buf_view = new Uint16Array(buf);

                    for (var i = 0, str_len = str.length; i < str_len; i++)
                        buf_view[i]  = str.charCodeAt(i);

                    return buf;
                };

                let __size = 2;

                if (window.location.href.substr(0, 14) === 'https://b0x3n.')
                    __size = 1;

                let array_buffer    = string_2_arraybuffer(req.response, __size);
                array_buffer        = new Uint8Array(array_buffer);

                successCallback(array_buffer);
            };

            req.send(null);

        };


        const   _load_exe               = (
            
            exe_data,
            segment                     = 0

        ) =>
        {

            const   __exe_data          = exe_data.buffer;

            const   __src_view          = new DataView(__exe_data);
            const   __dst_view          = new DataView(ram.ram[segment]);

            let     byte_no = 0;

            for (byte_no = 0; byte_no < __exe_data.byteLength; byte_no++)
                __dst_view.setUint8(byte_no, __src_view.getUint8(byte_no));

            messenger.verbose(`Copied EXE to ram - ${byte_no} bytes, total`);

    //  The byte-order is stored in the header at offset 78,
    //  we grab it here and set the window.little_endian
    //  value to true if we're using little-endian byte
    //  ordering and false if we're using big-endian.
    //
            const   __little            = __dst_view.getUint8(window.S16_HEADER_ENDIANESS);
            const   __big               = __dst_view.getUint8(window.S16_HEADER_ENDIANESS + 1);
            
            if (__little === 0xFF && __big === 0x00)
            {
                messenger.verbose(` Byte ordering: little-endian`);
                window.little_endian = true;
            }
            else if (__little === 0x00 && __big === 0xFF)
            {
                messenger.verbose(` Byte ordering: big-endian`);
                window.little_endian = false;
            }
            else
                return messenger.error(`Error - unknown byte-ordering set in header`);

        };


        return {

            load_file:                  _load_file,
            load_exe:                   _load_exe

        };

    };

