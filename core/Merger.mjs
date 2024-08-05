///////////////////////////////////////////////////////////
//  System16/core/Merger.mjs                             //
///////////////////////////////////////////////////////////
//
//
//


///////////////////////////////////////////////////////////
//  Load any required modules from:
//
//      System16/core/
//
    import { LoadFile } from            "./LoadFile.mjs";


///////////////////////////////////////////////////////////
//  The Merger module.                                   //
///////////////////////////////////////////////////////////
//
    export const    Merger              = (

        objConfigure,
        messenger

    ) =>
    {

        let     __paths                 = [];


///////////////////////////////////////////////////////////
//  __merge_header()                                     //
///////////////////////////////////////////////////////////
//
        const   __merge_header          = (

            objDst,
            objSrc

        ) =>
        {

            let __header                = objSrc[0];
            
            if (typeof global.__s16_linker_mode === 'undefined')
                __header                = objSrc[0].objSection;

            if (typeof __header !== 'undefined') 
            {
                if (typeof objDst[0].label === 'undefined')
                {
                    objDst[0].label = [];
                    objDst[0].data = [];
                }

                if (typeof global.__s16_linker_mode === 'undefined')
                {
                    __header.label.forEach((label, index) => {
                        let __index = objDst[0].label.indexOf(label);
                        
                        if (__index >= 0)
                            objDst[0].data[__index] = objSrc[0].objSection.data[index];
                        else
                            objDst[0].data.push(objSrc[0].objSection.data[index]);

                        objDst[0].label.push(label);
                    });
                }
                else
                {
                    __header.label.forEach((label, index) => {
                        let __index = objDst[0].label.indexOf(label);
                        
                        if (__index >= 0)
                            objDst[0].data[__index] = objSrc[0].data[index];
                        else
                            objDst[0].data.push(objSrc[0].data[index]);

                        objDst[0].label.push(label);
                    });
                }
            }

        };


///////////////////////////////////////////////////////////
//  __merge_data()                                       //
///////////////////////////////////////////////////////////
//
        const   __merge_data            = (

            objDst,
            objSrc

        ) =>
        {

    //  Cycle through sections 1 - 4 of objSrc.
    //
            for (let section_no = 1; section_no < 5; section_no++)
            {

                const   __section       = objSrc[section_no].objSection;

    //  For every label in this section - check that it
    //  doesn't already exist in objDst.
    //
                __section.label.forEach((label, index) => {
                    const   __objLabel  = objDst[1].lookup(
                        objDst,
                        label
                    );

                    const   __src_path  = __section.path[index];
                    const   __src_line  = __section.line[index];

                    if (__objLabel)
                        messenger.file_error([ __src_path, __src_line ], `Label '${__objLabel.label}' previously declared in ${__objLabel.path}, line ${__objLabel.line}`);

                    objDst[section_no].objSection.label.push(__section.label[index]);
                    objDst[section_no].objSection.path.push(__section.path[index]);
                    objDst[section_no].objSection.line.push(__section.line[index]);
                    objDst[section_no].objSection.mode.push(__section.mode[index]);
                    objDst[section_no].objSection.type.push(__section.type[index]);
                    objDst[section_no].objSection.size.push(__section.size[index]);
                    objDst[section_no].objSection.data.push(__section.data[index]);
                    objDst[section_no].objSection.length.push(__section.length[index]);
                    
                    objDst[section_no].objSection.section_length += __section.length[index];
                });

            }

        };


///////////////////////////////////////////////////////////
//  _merge_sections()                                    //
///////////////////////////////////////////////////////////
//
        const   _merge_sections         = (

            objDst,
            objSrc

        ) =>
        {

            __merge_header(objDst, objSrc);
            __merge_data(objDst, objSrc);

        };


///////////////////////////////////////////////////////////
//  _merge()                                             //
///////////////////////////////////////////////////////////
//
        const   _merge                  = (

            objSections,
            asm_files,
            obj_files

        ) =>
        {

            if (asm_files.length)
                __paths = asm_files;

            messenger.verbose(`Merging ${obj_files.length} object files...`);

            for (let file_no = 0; file_no < obj_files.length; file_no++)
            {

                const   __objFile       = LoadFile(
                                            obj_files[file_no],
                                            messenger
                                        );

                if (typeof __objFile === 'string')
                    messenger.error(__objFile);

                if (__paths.indexOf(__objFile.path) >= 0)
                    messenger.error(`File '${__objFile.path}' included more than once`);

                __paths.push(__objFile.path);

    //  Object files are just JSON files containing
    //  the objSections structure.
    //
                const   __objSections   = JSON.parse(__objFile.data);

                _merge_sections(
                    objSections,
                    __objSections
                );

            }

        };


        return {

            merge_sections:             _merge_sections,
            merge:                      _merge

        };

    };

