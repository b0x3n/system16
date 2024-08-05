///////////////////////////////////////////////////////////
//  System16/core/defs/Registers.js                      //
///////////////////////////////////////////////////////////
//
//
//


    global.S16_REGBUF_OFFSET            = 120;
    global.S16_REGBUF_LENGTH            = 60;


    global.S16_REG_CS                   = 'CS';
    global.S16_REG_DS                   = 'DS';
    global.S16_REG_SS                   = 'SS';

    global.S16_REG_BP                   = 'BP';
    global.S16_REG_IP                   = 'IP';
    global.S16_REG_SP                   = 'SP';

    global.S16_REG_HB                   = 'HB';
    global.S16_REG_HP                   = 'HP';

    global.S16_REG_RT                   = 'RT';
    global.S16_REG_FL                   = 'FL';

    global.S16_REG_OI                   = 'OI';
    global.S16_REG_II                   = 'II';
    
    global.S16_REG_AX                   = 'AX';
    global.S16_REG_BX                   = 'BX';
    global.S16_REG_CX                   = 'CX';
    global.S16_REG_DX                   = 'DX';
    global.S16_REG_EX                   = 'EX';
    global.S16_REG_FX                   = 'FX';

    global.S16_REG                      =
    {
        
        [global.S16_REG_CS]:            (global.S16_REGBUF_OFFSET + 0x00),
        [global.S16_REG_DS]:            (global.S16_REGBUF_OFFSET + 0x04),
        [global.S16_REG_SS]:            (global.S16_REGBUF_OFFSET + 0x08),
        
        [global.S16_REG_BP]:            (global.S16_REGBUF_OFFSET + 0x0C),
        [global.S16_REG_IP]:            (global.S16_REGBUF_OFFSET + 0x10),
        [global.S16_REG_SP]:            (global.S16_REGBUF_OFFSET + 0x14),
        
        [global.S16_REG_HB]:            (global.S16_REGBUF_OFFSET + 0x18),
        [global.S16_REG_HP]:            (global.S16_REGBUF_OFFSET + 0x1C),

        [global.S16_REG_RT]:            (global.S16_REGBUF_OFFSET + 0x20),
        [global.S16_REG_FL]:            (global.S16_REGBUF_OFFSET + 0x21),
        
        [global.S16_REG_OI]:            (global.S16_REGBUF_OFFSET + 0x22),
        [global.S16_REG_II]:            (global.S16_REGBUF_OFFSET + 0x23),

        [global.S16_REG_AX]:            (global.S16_REGBUF_OFFSET + 0x24),
        [global.S16_REG_BX]:            (global.S16_REGBUF_OFFSET + 0x28),
        [global.S16_REG_CX]:            (global.S16_REGBUF_OFFSET + 0x2C),
        [global.S16_REG_DX]:            (global.S16_REGBUF_OFFSET + 0x30),
        [global.S16_REG_EX]:            (global.S16_REGBUF_OFFSET + 0x34),
        [global.S16_REG_FX]:            (global.S16_REGBUF_OFFSET + 0x38)

    };

    