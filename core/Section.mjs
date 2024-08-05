///////////////////////////////////////////////////////////
//  System16/core/Section.mja                            //
///////////////////////////////////////////////////////////
//
//  The Section module is used to label and store
//  data.
//


///////////////////////////////////////////////////////////
//  Import required scripts in System16/core/defs/
//
    import * as GlobalSections from     "./defs/Sections.js";
    import * as GlobalMemtypes from     "./defs/Memtypes.js";


///////////////////////////////////////////////////////////
//  The Section module.                                  //
///////////////////////////////////////////////////////////
//
    export const    Section             = (

        messenger

    ) =>
    {


///////////////////////////////////////////////////////////
//  _objSection
//
//  All data for the section is stored here, we have
//  a set of arrays that sit parallel to one another.
//
//  We find the label in the label array, we then
//  use the index of the label to reference the
//  corresponding meta data in mode, type, size,
//  data and length.
//
//  The section_length property tracks the total size
//  of the section in bytes.
//
        const   _objSection             =
        {

            'path':                     [],     // Absolute path of the file
            'line':                     [],     // Line number
            'label':                    [],     // Unique ID/name
            'mode':                     [],     // Mode (ro, rw or env)
            'type':                     [],     // Data type
            'size':                     [],     // Array size
            'data':                     [],     // Data
            'length':                   [],     // Data length in bytes
            'section_length':           0       // Section length in bytes

        };


///////////////////////////////////////////////////////////
//  _get_by_index                                        //
///////////////////////////////////////////////////////////
//
        const   _get_by_index           = index =>
        {
        
            if (index < 0 || index >= _objSection.label.length)
                return false;

            return {
                'index':                index,
                'path':                 _objSection.path[index],
                'line':                 _objSection.line[index],
                'label':                _objSection.label[index],
                'type':                 _objSection.type[index],
                'size':                 _objSection.size[index],
                'data':                 _objSection.data[index],
                'length':               _objSection.length[index],
            };

        };


///////////////////////////////////////////////////////////
//  _set_by_index()                                      //
///////////////////////////////////////////////////////////
//
        const   _set_by_index           = (

            index,
            path,
            line,
            mode                        = 'ro',
            type                        = 'm8',
            size                        = 1,
            data                        = [],

        ) =>
        {

            let     __label;

            if (index < 0 || index >= _objSection.label.length)
                return `Cannot set label at index ${index} - index doesn't exist`;
        
            __label = _objSection.label[index];
            if (_objSection.mode[index] === global.S16A_SECTION(1))
                return `Attempt to overwrite read-only value '${__label}'`;

            if (data.length > size)
                return `Attempt to write ${data.length} elements to '${__label}' (sizeof ${__label} = ${size})`;

            while (data.length < size)
                data.push(0);

    //  We're deleting an existing item, we need to
    //  keep track of the length of the section.
    //
            _objSection.section_length -= _objSection.length[index];

            _objSection.mode[index] = mode;
            _objSection.type[index] = type;
            _objSection.size[index] = size;
            _objSection.data[index] = data;

    //  The global.S16A_MEMSIZE() function will calculate the
    //  length given the type (m8, m16 or m32) and the size
    //  (number of elements) of the data array - see:
    //
    //      System16/core/defs/Memtypes.js
    //
            _objSection.length[index] = global.S16_MEMSIZE(type, size);
    
            _objSection.section_length += _objSection.length[index];

            return index;

        };


///////////////////////////////////////////////////////////
//  _unset_by_index()                                    //
///////////////////////////////////////////////////////////
//
        const   _unset_by_index         = index =>
        {

            let __label;

            if (index < 0 || index >= _objSection.label.length)
                return `Cannot unset label at index ${index} - index doesn't exist`;

            __label = _objSection.label[index];

            if (_objSection.mode[index] === global.S16A_SECTION(1))
                return `Attempt to overwrite read-only value '${__label}'`;

            const   __length            = _objSection.length[index];
            
            _objSection.label.splice(index, 1);
            _objSection.path.splice(index, 1);
            _objSection.line.splice(index, 1);
            _objSection.mode.splice(index, 1);
            _objSection.type.splice(index, 1);
            _objSection.size.splice(index, 1);
            _objSection.data.splice(index, 1);

            _objSection.section_length -= __length;

            return index;

        };


///////////////////////////////////////////////////////////
//  _get()                                               //
///////////////////////////////////////////////////////////
//
        const   _get                    = label =>
        {

            const   _index              = _objSection.label.indexOf(label);

            if (_index < 0)
                return false;

            return _get_by_index(_index);

        };


///////////////////////////////////////////////////////////
//  _set()                                               //
///////////////////////////////////////////////////////////
//
        const   _set                    = (

            label,
            path,
            line,
            mode                        = 'ro',
            type                        = 'm16',
            size                        = 1,
            data                        = []

        ) =>
        {

            const   _objLabel           = _get(label);
            let     _index              = _objSection.label.length;

    //  Is the label valid?
    //
            if (! /^[a-zA-Z_][a-zA-Z0-9_]+$/.test(label))
                return `Invalid label '${label}'`;

            if (_objLabel)
            {
    //  Label exists, we can try to overwrite it with
    //  a call to _set_by_index().
    //
                _index = _objLabel.index;

                return _set_by_index(
                    _index,
                    path,
                    line,
                    mode,
                    type,
                    size,
                    data
                );
            }
                   
    //  Label doesn't exist - we can try to creaate it.
    //
            if (size > 0)
            {
                if (data.length > size)
                    return `Attempt to write ${data.length} elements to '${label}' (sizeof ${label} = ${size})`;
            
                while (data.length < size)
                    data.push(0);
            }
            
            _objSection.label.push(label);
            _objSection.path.push(path);
            _objSection.line.push(line);
            _objSection.mode.push(mode);
            _objSection.type.push(type);
            _objSection.size.push(size);
            _objSection.data.push(data);

            _objSection.length.push(global.S16_MEMSIZE(type, size));
            _objSection.section_length += global.S16_MEMSIZE(type, size);

            return _index;

        };


///////////////////////////////////////////////////////////
//  _unset()                                             //
///////////////////////////////////////////////////////////
//
        const   _unset                  = label =>
        {

            const   _objLabel           = _get(label);

            if (! _objLabel)
                return `Cannot unset '${label}' - label doesn't exist`;

            return _unset_by_index(_objLabel.index);

        };


///////////////////////////////////////////////////////////
//  _lookup()                                            //
///////////////////////////////////////////////////////////
//
        const   _lookup                 = (

            objSections,
            label,
            start_at = 1,
            end_at = 0

        ) =>
        {

            let     _objLabel       = false;

            if (start_at < 0)
                start_at = 0;
            if (end_at <= 0)
                end_at = objSections.length;


            for (let section_no = start_at; section_no < end_at; section_no++)
            {

                const   __section       = objSections[section_no];
                const   __objLabel      = __section.get(label);

                if (! __objLabel)
                    continue;

                __objLabel.section_no = section_no;
                _objLabel = __objLabel;

                break;
            }

            return _objLabel;

        };


        return {

            get_by_index:               _get_by_index,
            get:                        _get,

            set_by_index:               _set_by_index,
            set:                        _set,

            unset_by_index:             _unset_by_index,
            unset:                      _unset,

            lookup:                     _lookup,
            
            objSection:                 _objSection

        };

    };

