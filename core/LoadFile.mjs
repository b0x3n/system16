///////////////////////////////////////////////////////////
//  System16/core/LoadFile.mjs                           //
///////////////////////////////////////////////////////////
//
//  This module loads input files and collects some
//  useful information about the input file.
//
//  It will return an object containing the file data
//  and relevant metadata (_objFileInfo) or false if
//  the file doesn't exist.
//
//  If the file can't be opened for any reason, an error
//  message will be set via the errorHandler.
//


///////////////////////////////////////////////////////////
//  The path and fs Node modules are required...
//
    import * as fs from                 'fs';
    import * as path from               'path';


///////////////////////////////////////////////////////////
//  The LoadFile module.                                 //
///////////////////////////////////////////////////////////
//
    export const    LoadFile            = (

        file_name,
        messenger

    ) =>
    {

    //  We need to remember where we are, we will chdir()
    //  to the parent directory of the file being loaded
    //  and need to find our way back.
    //
        const   __previous_directory    = process.cwd();

///////////////////////////////////////////////////////////
//  _objFileInfo
//
//  This is the structure we will populate and return if
//  the file is found and successfully loaded.
//
        const   _objFileInfo            = {
            'name':                     path.basename(file_name),
            'path':                     false,
            'dir':                      path.dirname(file_name),
            'ext':                      path.extname(file_name),
            'data':                     false
        };

    //  Firstly, does the directory that the file is
    //  in actually exist?
    //
        if (! fs.existsSync(_objFileInfo.dir))
            messenger.error(`Can't open input file ${file_name}, parent directory ${_objFileInfo.dir} not found`);

    //  Now we can chdir to that directory and get the
    //  absolute path - we need to do this because
    //  the file_name might be a relative path.
    //
        process.chdir(_objFileInfo.dir);

        _objFileInfo.dir                = process.cwd();
        _objFileInfo.path               = `${process.cwd()}${path.sep}${_objFileInfo.name}`;
    
    //  Now, does the file exist?
    //
        if (! fs.existsSync(_objFileInfo.name))
        {
            process.chdir(__previous_directory);
            messenger.error(`Input file ${file_name} not found`);
        }

    //  All good - we can load the data and return
    //  the _objFileInfo object.
    //
        _objFileInfo.data = fs.readFileSync(
            _objFileInfo.name,
            {
                'encoding':             'utf-8',
                'flag':                 'r'
            }
        );

        process.chdir(__previous_directory);

        return _objFileInfo;

    };

