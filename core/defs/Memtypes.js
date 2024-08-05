///////////////////////////////////////////////////////////
//  System16/core/Memtypes.js                            //
///////////////////////////////////////////////////////////
//
//
//


    global.S16_MEMTYPE_M8               = 'm8';
    global.S16_MEMTYPE_M16              = 'm16';
    global.S16_MEMTYPE_M32              = 'm32';


    global.S16_MEMTYPES                 =
    [

        global.S16_MEMTYPE_M8,
        global.S16_MEMTYPE_M16,
        global.S16_MEMTYPE_M32

    ];


    global.S16_MEMTYPE                  = type =>
    {

        let     _index;

        if (typeof type === 'number')
        {
            if (type < 0 || type >= global.S16_MEMTYPES.length)
                return false;

            return global.S16_MEMTYPE[type];
        }

        _index = global.S16_MEMTYPES.indexOf(type);

        if (_index < 0)
            return false;

        return _index;
    };


    global.S16_MEMSIZE                  = (

        type,
        size                            = 1

    ) =>
    {

        let     __type_size = 1;

        if (type === global.S16_MEMTYPE_M8)
            __type_size = 1;
        else if (type === global.S16_MEMTYPE_M16)
            __type_size = 2;
        else if (type === global.S16_MEMTYPE_M32)
            __type_size = 4;
        else
            return false;

        return (__type_size * size);

    };

