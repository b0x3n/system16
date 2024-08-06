///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/utils/Loader.js              //
///////////////////////////////////////////////////////////
//
//  This module is used to load s16 files for execution,
//  the file is retrieved via a HTTP Get request so will
//  call success_callback() to pass the file data to the
//  caller.
//

    export const    LoadFile            = (
        
        exe_url,
        success_callback,
        failure_callback
    
    ) =>
    {

        let     _objExe                 = {
            'exe_path':                 exe_url,
            'exe_data':                 false
        };


///////////////////////////////////////////////////////////
//  __string_to_arraybuffer()                            //
///////////////////////////////////////////////////////////
//
//  The incoming data is encoded as a string so needs to
//  be decoded.
//
        const   __string_to_arraybuffer     = str =>
        {

            var buffer                      = new ArrayBuffer(str.length * 2);
            var buffer_view                 = new Uint16Array(buffer);

            for (var i = 0, str_len = str.length; i < str_len; i++)
                buffer_view[i]  = str.charCodeAt(i);

            return buffer;
            
        };

        const   req                         = new XMLHttpRequest();
        let     file_name;

        if (window.location.href.substr(0, 14) === 'https://b0x3n.')
            file_name = `https://b0x3n.github.io/system16/s16/exe/sys16.s16`;
        if (window.hostname === '127.0.0.1' || window.hostname === 'localhost')
            file_name = `127.0.0.1/s16/exe/sys16.s16`;

        req.open("GET", exe_url, false);


        req.onload                          = event =>
        {
            let array_buffer                = __string_to_arraybuffer(req.response);
            _objExe.exe_data                = new Uint8Array(array_buffer).buffer;
            
            success_callback(_objExe);
        };

        req.onerror                         = error =>
        {
            failure_callback(error.statusText)
        };

        req.send(null);

    };

