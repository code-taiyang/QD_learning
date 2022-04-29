// 创建乐器基类
class MusicalInstrument {
    // 所有的乐器都有的特性: 音律
    // 中国古代的5大音律
    static Map_1 = {
        '宫': '',
        '商': '',
        '角': '',
        '徵': '',
        '羽': ''
    };
    // 西方的7大音律
    static Map_2 = {
        'do': '',
        're': '',
        'mi': '',
        'fa': '',
        'sol': '',
        'la': '',
        'xi': '',
    };
    // 最基本的频率map
    static Map_3 = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
    };
    // 字母音律
    static Map_4 = {
        // 里面的半音略了
        'A': '',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
    }
    static Type = '';
}
// 创建吉他类
class Guitar extends MusicalInstrument{
    static Type = '弦乐器';
    static Map_Standard = {
        'A': '',
        'B': '',
        'C': '',
        'D': '',
        'E': '',
        'F': '',
        'G': '',
    }
}