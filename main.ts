/**
 * microbit makecode Package: Scroll Text.
 * Author: shao ziyang, 2018.Sept
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */

enum SCROLL_DIR {
    //% block="LEFT"
    LEFT,
    //% block="UP"
    UP,
    //% block="RIGHT"
    RIGHT,
    //% block="DOWN"
    DOWN
}

enum SCROLL_ROTATE {
    //% block="0"
    SR_0,
    //% block="90"
    SR_90,
    //% block="180"
    SR_180,
    //% block="270"
    SR_270
}

const FONTS = hex`00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002020200020A0A0000000A1F0A1F0A0E130E190E13090412190609060916020200000004020202040204040402000A040A0000040E0400000000040200000E0000000000020010080402010609090906040604040E070806010F0F080409060C0A090F081F010F100F08040E110E1F080402010E110E110E0E110E0402000200020000040004020804020408000E000E0002040804020E110C00040E1115190606090F090907090709070E0101010E07090909070F0107010F0F010701010E0119110E09090F090907020202071F080809060905030509010101010F111B151111111315191106090909060709070101060909060C07090709110E010608071F0404040409090909061111110A041111151B110909060909110A0404040F0402010F0E0202020E01020408100E0808080E040A000000000000001F0204000000000E09091E0101070907000E01010E08080E090E060907010E0C020702020E090E08060101070909020002020208000808060105030509020202020C001B151111000709090900060909060007090701000E090E08000E010101000C02040302020E021C000909091E0011110A04001111151B000906060900110A0403000F04020F0C0406040C0202020202030206020300000618000000000000`;
//% weight=20 color=#Ffbc11 icon="T" block="ScrollText"
namespace ScrolText {
    let img: Image = null
    img = images.createImage(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `)

    function _Rotate(c: number, rotate: SCROLL_ROTATE) {
        let m: number[][] = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
        //let r: number[] = [font[0], font[1], font[2], font[3], font[4]]
        let r: number[] = [FONTS[c * 5], FONTS[c * 5 + 1], FONTS[c * 5 + 2], FONTS[c * 5 + 3], FONTS[c * 5 + 4]]
        switch (rotate) {
            case SCROLL_ROTATE.SR_0:
                return r;
            case SCROLL_ROTATE.SR_90:
                for (let i = 0; i < 5; i++) {
                    m[4 - i][0] = (r[i] & 0x01)
                    m[4 - i][1] = (r[i] & 0x02)
                    m[4 - i][2] = (r[i] & 0x04)
                    m[4 - i][3] = (r[i] & 0x08)
                    m[4 - i][4] = (r[i] & 0x10)
                }
                break;
            case SCROLL_ROTATE.SR_180:
                for (let i = 0; i < 5; i++) {
                    m[4][4 - i] = (r[i] & 0x01)
                    m[3][4 - i] = (r[i] & 0x02)
                    m[2][4 - i] = (r[i] & 0x04)
                    m[1][4 - i] = (r[i] & 0x08)
                    m[0][4 - i] = (r[i] & 0x10)
                }
                break;
            case SCROLL_ROTATE.SR_270:
                for (let i = 0; i < 5; i++) {
                    m[i][4] = (r[i] & 0x01)
                    m[i][3] = (r[i] & 0x02)
                    m[i][2] = (r[i] & 0x04)
                    m[i][1] = (r[i] & 0x08)
                    m[i][0] = (r[i] & 0x10)
                }
                break;
        }
        for (let n = 0; n <= 4; n++) {
            let d = 0
            if (m[0][n]) d |= 1
            if (m[1][n]) d |= 2
            if (m[2][n]) d |= 4
            if (m[3][n]) d |= 8
            if (m[4][n]) d |= 16
            r[n] = d
        }
        return r
    }

    function _ToImg(dat: number[]): void {
        for (let i = 0; i < 5; i++) {
            img.setPixel(0, i, (dat[i] & 0x01) == 0x01)
            img.setPixel(1, i, (dat[i] & 0x02) == 0x02)
            img.setPixel(2, i, (dat[i] & 0x04) == 0x04)
            img.setPixel(3, i, (dat[i] & 0x08) == 0x08)
            img.setPixel(4, i, (dat[i] & 0x10) == 0x10)
        }
    }

    /**
     * show a scroll string
     * @param s      , eg: "Hello"
     * @param dir    , eg: SCROLL_DIR.LEFT
     * @param rotate , eg: SCROLL_ROTATE.SR_0
     * @param delay  , eg: 100
     */
    //% blockId="SCROLL_SHOWSTRING" block="scroll string %s|dir %dir|rotate %rotate|delay %delay"
    //% weight=100 blockGap=8
    export function showString(s: string, dir: SCROLL_DIR, rotate: SCROLL_ROTATE, delay: number): void {
        let L = s.length + 1
        let a: number[] = [0, 0, 0, 0, 0]
        let b: number[] = [0, 0, 0, 0, 0]

        if (s == '') return

        s = ' ' + s + ' '

        switch (dir) {
            case SCROLL_DIR.LEFT:
                for (let i = 0; i < L; i++) {
                    a = _Rotate(s.charCodeAt(i), rotate)
                    b = _Rotate(s.charCodeAt(i + 1), rotate)
                    let c: number[] = [0, 0, 0, 0, 0]
                    for (let j = 0; j < 5; j++) {
                        for (let k = 0; k < 5; k++)
                            c[k] = (a[k] >> j) | ((b[k] << (8 - j)) >> 3)
                        _ToImg(c)
                        img.showImage(0, delay)
                    }
                }
                break;
            case SCROLL_DIR.RIGHT:
                for (let i = 0; i < L; i++) {
                    a = _Rotate(s.charCodeAt(i), rotate)
                    b = _Rotate(s.charCodeAt(i + 1), rotate)
                    let c: number[] = [0, 0, 0, 0, 0]
                    for (let j = 0; j < 5; j++) {
                        for (let k = 0; k < 5; k++)
                            c[k] = (a[k] << j) | ((b[k] >> (5 - j)))
                        _ToImg(c)
                        img.showImage(0, delay)
                    }
                }
                break;
            case SCROLL_DIR.UP:
                for (let i = 0; i < L; i++) {
                    a = _Rotate(s.charCodeAt(i), rotate)
                    b = _Rotate(s.charCodeAt(i + 1), rotate)
                    let c: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    for (let j = 0; j < 5; j++) {
                        c[j] = a[j]
                        c[j + 6] = b[j]
                    }
                    for (let j = 0; j < 6; j++) {
                        _ToImg(c)
                        img.showImage(0, delay)
                        c.removeAt(0)
                    }
                }
                break;
            case SCROLL_DIR.DOWN:
                for (let i = 0; i < L; i++) {
                    a = _Rotate(s.charCodeAt(i), rotate)
                    b = _Rotate(s.charCodeAt(i + 1), rotate)
                    let c: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    for (let j = 0; j < 5; j++) {
                        c[j] = a[j]
                        c[j + 6] = b[j]
                    }
                    for (let j = 0; j < 6; j++) {
                        _ToImg(c)
                        img.showImage(0, delay)
                        for (let k = 5; k > 0; k--) {
                            c[k] = c[k - 1]
                        }
                        c[0] = c[11 - j]
                    }
                }
                break;
        }
    }

    /**
      * show a scroll number
      * @param n      , eg: 123
      * @param dir    , eg: SCROLL_DIR.LEFT
      * @param rotate , eg: SCROLL_ROTATE.SR_90
      * @param delay  , eg: 100
      */
    //% blockId="SCROLL_SHOWNUMBER" block="scroll number %n|dir %dir|rotate %rotate|delay %delay"
    //% weight=100 blockGap=8
    export function showNumber(n: number, dir: SCROLL_DIR, rotate: SCROLL_ROTATE, delay: number): void {
        showString(n.toString(), dir, rotate, delay)
    }
}
