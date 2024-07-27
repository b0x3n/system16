///////////////////////////////////////////////////////////
//  System16/core/defs/Sections.js                       //
///////////////////////////////////////////////////////////
//
//
//

    global.S16A_SECTION_HEADER          = 'header';
    global.S16A_SECTION_RO              = 'ro';
    global.S16A_SECTION_RW              = 'rw';
    global.S16A_SECTION_CODE            = 'code';
    global.S16A_SECTION_ENV             = 'env';


    global.S16A_SECTIONS                =
    [

        global.S16A_SECTION_HEADER,
        global.S16A_SECTION_RO,
        global.S16A_SECTION_RW,
        global.S16A_SECTION_CODE,
        global.S16A_SECTION_ENV

    ];


    global.S16A_SECTION                 = section =>
    {

        if (typeof section === 'number')
        {
            if (section < 0 || section >= global.S16A_SECTIONS.length)
                return false;

            return global.S16A_SECTIONS[section];
        }

        const   _index = global.S16A_SECTIONS.indexOf(section);

        if (_index < 0)
            return false;

        return _index;

    };

