///////////////////////////////////////////////////////////
//  System16/s16l/src/code/Registers.js                  //
///////////////////////////////////////////////////////////
//


    export const    Registers           = objExe =>
    {


///////////////////////////////////////////////////////////
//  __initialise()                                       //
///////////////////////////////////////////////////////////
//
        const   __initialise            = () =>
        {

            const   __dst_view          = new DataView(objExe.exe_buffer);

            __dst_view.setUint32(global.S16_REG['CS'], objExe.code_offset, global.little_endian);
            __dst_view.setUint32(global.S16_REG['DS'], objExe.ro_offset, global.little_endian);
            __dst_view.setUint32(global.S16_REG['SS'], 0xFFFC, global.little_endian);

            __dst_view.setUint32(global.S16_REG['BP'], 0xFFFF, global.little_endian);
            __dst_view.setUint32(global.S16_REG['IP'], 10, global.little_endian);
            __dst_view.setUint32(global.S16_REG['SP'], 0xFFFF, global.little_endian);

            __dst_view.setUint32(global.S16_REG['HB'], objExe.exe_size, global.little_endian);
            __dst_view.setUint32(global.S16_REG['HP'], objExe.exe_size, global.little_endian);

            __dst_view.setUint8(global.S16_REG['FL'], 0);
            __dst_view.setUint8(global.S16_REG['RT'], 0);

            __dst_view.setUint8(global.S16_REG['OI'], 0);
            __dst_view.setUint8(global.S16_REG['II'], 0);

            __dst_view.setUint32(global.S16_REG['AX'], 0, global.little_endian);
            __dst_view.setUint32(global.S16_REG['BX'], 0, global.little_endian);
            __dst_view.setUint32(global.S16_REG['CX'], 0, global.little_endian);
            __dst_view.setUint32(global.S16_REG['DX'], 0, global.little_endian);
            __dst_view.setUint32(global.S16_REG['EX'], 0, global.little_endian);
            __dst_view.setUint32(global.S16_REG['FX'], 0, global.little_endian);

        };


        __initialise();


    };