///////////////////////////////////////////////////////////
//  System16/s16/src/js/s16/dev/s16Ram.js                //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  The s16Ram module.                                   //
///////////////////////////////////////////////////////////
//
    export const    s16Ram              = () =>
    {

        let     __max_addr              = false;
        let     __segments              = false;

        let     __ram                   = false;
        let     __view                  = false;


///////////////////////////////////////////////////////////
//  _initialise()                                        //
///////////////////////////////////////////////////////////
//
        const   _initialise             = (

            segments,
            max_addr

        ) =>
        {

            if (__ram !== false)
                return false;

            __ram                       = [];
            __view                      = [];

            __segments                  = segments;
            __max_addr                  = max_addr;

            for (let segment_no = 0; segment_no < segments; segment_no++)
            {
                __ram.push(new ArrayBuffer(max_addr + 1));
                __view.push(new DataView(__ram[segment_no]));
            }

        };


///////////////////////////////////////////////////////////
//  __check_address_range()                              //
///////////////////////////////////////////////////////////
//
        const   __check_address_range   = (

            segment,
            offset,
            size

        ) =>
        {
            
            if (segment < 0 || segment >= __segments)
                return window.__s16_error(`Error in s16Ram.write_m8() - segment index ${segment} out of range`);
            if (offset < 0 || offset > (__max_addr - size))
                return window.__s16_error(`Error in s16Ram.write_m8() - offset ${offset} out of range`);
           
            return true;

        };


///////////////////////////////////////////////////////////
//  _write_m8()                                          //
///////////////////////////////////////////////////////////
//
        const   _write_m8               = (
        
            segment,
            offset,
            value
        
        ) =>
        {

            if (! __check_address_range(segment, offset, 1))
                return false;

            __view[segment].setUint8(offset, value);

            return true;

        };


///////////////////////////////////////////////////////////
//  _write_m16()                                         //
///////////////////////////////////////////////////////////
//
        const   _write_m16              = (
        
            segment,
            offset,
            value
        
        ) =>
        {

            if (! __check_address_range(segment, offset, 2))
                return false;

            __view[segment].setUint16(offset, value, window.__s16Sys.little_endian);

            return true;

        };


///////////////////////////////////////////////////////////
//  _write_m32()                                         //
///////////////////////////////////////////////////////////
//
        const   _write_m32              = (
        
            segment,
            offset,
            value
        
        ) =>
        {

            if (! __check_address_range(segment, offset, 4))
                return false;

            __view[segment].setUint32(offset, value, window.__s16Sys.little_endian);

            return true;

        };


///////////////////////////////////////////////////////////
//  _read_m8()                                           //
///////////////////////////////////////////////////////////
//
        const   _read_m8                = (

            segment,
            offset

        ) =>
        {

            if (! __check_address_range(segment, offset, 1))
                return false;

            return __view[segment].getUint8(offset);

        };


///////////////////////////////////////////////////////////
//  _read_m16()                                          //
///////////////////////////////////////////////////////////
//
        const   _read_m16               = (

            segment,
            offset

        ) =>
        {

            if (! __check_address_range(segment, offset, 2))
                return false;

            return __view[segment].getUint16(offset, window.__s16Sys.little_endian);

        };


///////////////////////////////////////////////////////////
//  _read_m32()                                          //
///////////////////////////////////////////////////////////
//
        const   _read_m32               = (

            segment,
            offset

        ) =>
        {

            if (! __check_address_range(segment, offset, 4))
                return false;

            return __view[segment].getUint32(offset, window.__s16Sys.little_endian);

        };


///////////////////////////////////////////////////////////
//  _load()                                              //
///////////////////////////////////////////////////////////
//
        const   _load                   = (

            segment,
            offset,
            data,
            start,
            size

        ) =>
        {

    //  If no size is specified we try and copy the
    //  entire data buffer.
    //
            if (size <= 0)
                return false;

            if (! __check_address_range(segment, offset, size))
                return false;

            let __src_view              = new DataView(data);
            let __src_offset            = 0;
            let __dst_offset            = offset;

            for (let byte_no = 0; byte_no < size; byte_no++)
                __view[segment].setUint8(__dst_offset++, __src_view.getUint8(start + byte_no));

           return;

        };


        return {

            initialise:                 _initialise,

            write_m8:                   _write_m8,
            write_m16:                  _write_m16,
            write_m32:                  _write_m32,

            read_m8:                    _read_m8,
            read_m16:                   _read_m16,
            read_m32:                   _read_m32,

            load:                       _load

        };

    };

