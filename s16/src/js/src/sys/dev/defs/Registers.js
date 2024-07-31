///////////////////////////////////////////////////////////
//  System16/s16/src/js/src/sys/dev/defs//Registers.js   //
///////////////////////////////////////////////////////////
//
//
//


    window.S16_REGBUF_OFFSET            = 80;
    window.S16_REGBUF_LENGTH            = 60;


    window.S16_REG_CS                   = 'CS';
    window.S16_REG_DS                   = 'DS';
    window.S16_REG_SS                   = 'SS';

    window.S16_REG_BP                   = 'BP';
    window.S16_REG_IP                   = 'IP';
    window.S16_REG_SP                   = 'SP';

    window.S16_REG_HB                   = 'HB';
    window.S16_REG_HP                   = 'HP';

    window.S16_REG_RT                   = 'RT';
    window.S16_REG_FL                   = 'FL';

    window.S16_REG_OI                   = 'OI';
    window.S16_REG_II                   = 'II';
    
    window.S16_REG_AX                   = 'AX';
    window.S16_REG_BX                   = 'BX';
    window.S16_REG_CX                   = 'CX';
    window.S16_REG_DX                   = 'DX';
    window.S16_REG_EX                   = 'EX';
    window.S16_REG_FX                   = 'FX';

    window.S16_REG                      =
    {
        
        [window.S16_REG_CS]:            (window.S16_REGBUF_OFFSET + 0x00),
        [window.S16_REG_DS]:            (window.S16_REGBUF_OFFSET + 0x04),
        [window.S16_REG_SS]:            (window.S16_REGBUF_OFFSET + 0x08),
        
        [window.S16_REG_BP]:            (window.S16_REGBUF_OFFSET + 0x0C),
        [window.S16_REG_IP]:            (window.S16_REGBUF_OFFSET + 0x10),
        [window.S16_REG_SP]:            (window.S16_REGBUF_OFFSET + 0x14),
        
        [window.S16_REG_HB]:            (window.S16_REGBUF_OFFSET + 0x18),
        [window.S16_REG_HP]:            (window.S16_REGBUF_OFFSET + 0x1C),

        [window.S16_REG_RT]:            (window.S16_REGBUF_OFFSET + 0x20),
        [window.S16_REG_FL]:            (window.S16_REGBUF_OFFSET + 0x21),
        
        [window.S16_REG_OI]:            (window.S16_REGBUF_OFFSET + 0x22),
        [window.S16_REG_II]:            (window.S16_REGBUF_OFFSET + 0x23),

        [window.S16_REG_AX]:            (window.S16_REGBUF_OFFSET + 0x24),
        [window.S16_REG_BX]:            (window.S16_REGBUF_OFFSET + 0x28),
        [window.S16_REG_CX]:            (window.S16_REGBUF_OFFSET + 0x2C),
        [window.S16_REG_DX]:            (window.S16_REGBUF_OFFSET + 0x30),
        [window.S16_REG_EX]:            (window.S16_REGBUF_OFFSET + 0x34),
        [window.S16_REG_FX]:            (window.S16_REGBUF_OFFSET + 0x38)

    };

    