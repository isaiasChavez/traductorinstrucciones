"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Instructions;
(function (Instructions) {
    Instructions["B"] = "B";
    Instructions["ADD"] = "ADD";
    Instructions["SUB"] = "SUB";
    Instructions["ADDI"] = "ADDI";
    Instructions["SUBI"] = "SUBI";
    Instructions["BL"] = "BL";
    Instructions["CBZ"] = "CBZ";
    Instructions["CBNZ"] = "CBNZ";
    Instructions["BR"] = "BR";
    Instructions["STUR"] = "STUR";
    Instructions["LDUR"] = "LDUR";
})(Instructions || (Instructions = {}));
var InstructionsCode;
(function (InstructionsCode) {
    InstructionsCode["B"] = "000101";
    InstructionsCode["ADD"] = "10001011000";
    InstructionsCode["SUB"] = "11001011000";
    InstructionsCode["ADDI"] = "1001000100";
    InstructionsCode["SUBI"] = "1101000100";
    InstructionsCode["BL"] = "100101";
    InstructionsCode["CBZ"] = "10110100";
    InstructionsCode["CBNZ"] = "10110101";
    InstructionsCode["BR"] = "11010110000";
    InstructionsCode["STUR"] = "11111000000";
    InstructionsCode["LDUR"] = "11111000010";
})(InstructionsCode || (InstructionsCode = {}));
var Formats = {
    B: {
        param1: 26,
    },
    R: {
        param1: 5,
        param2: 11,
        param3: 5,
    },
    I: {
        param1: 5,
        param2: 5,
        param3: 12,
    },
    D: {
        param1: 5,
        param2: 7,
        param3: 9,
    },
    CBZ: {
        param1: 5,
        param2: 19,
    },
    BR: {
        param1: 1,
        param2: 2,
        param3: 3,
    },
    STUR: {
        param1: 5,
        param2: 7,
        param3: 9,
    }
};
var Traductor = /** @class */ (function () {
    function Traductor() {
        var _this = this;
        this.param1 = 0;
        this.param2 = 0;
        this.param3 = 0;
        this.traducir = function (entrada) {
            var data = _this.limpiar(entrada);
            var _a = _this.dividirEntrada(data), instruction = _a.instruction, code = _a.code;
            var param1Bin = "";
            var param2Bin = "";
            var param3Bin = "";
            switch (instruction) {
                case Instructions.ADD:
                case Instructions.SUB:
                    param1Bin = _this.convertToBinary(_this.param1, Formats.R.param1);
                    param2Bin = _this.convertToBinary(_this.param2, Formats.R.param2);
                    param3Bin = _this.convertToBinary(_this.param3, Formats.R.param3);
                    break;
                case Instructions.ADDI:
                case Instructions.SUBI:
                    param1Bin = _this.convertToBinary(_this.param1, Formats.I.param1);
                    param2Bin = _this.convertToBinary(_this.param2, Formats.I.param2);
                    param3Bin = _this.convertToBinary(_this.param3, Formats.I.param3);
                    break;
                case Instructions.CBZ:
                case Instructions.CBNZ:
                    param1Bin = _this.convertToBinary(_this.param1, Formats.CBZ.param1);
                    param2Bin = _this.convertToBinary(_this.param2, Formats.CBZ.param2);
                    break;
                case Instructions.STUR:
                case Instructions.LDUR:
                    param1Bin = _this.convertToBinary(_this.param1, Formats.STUR.param1);
                    param2Bin = _this.convertToBinary(_this.param2, Formats.STUR.param2);
                    param3Bin = _this.convertToBinary(_this.param3, Formats.STUR.param3);
                    break;
                default:
                    break;
            }
            param3Bin = param3Bin.length > 0 ? param3Bin : null;
            var stringBinary = InstructionsCode[instruction] + param3Bin + param2Bin + param1Bin;
            var resultHexa = _this.convertToHexa(stringBinary);
            console.log(resultHexa, stringBinary);
            return data;
        };
        this.dividirEntrada = function (entrada) {
            var array = entrada.split(',');
            var instructionString = array[0];
            _this.param1 = parseInt(array[1]);
            if (array.length >= 3) {
                _this.param2 = parseInt(array[2]);
            }
            if (array.length >= 4) {
                _this.param3 = parseInt(array[3]);
            }
            var instruction = Instructions.ADD;
            if (instructionString === Instructions.ADD)
                instruction = Instructions.ADD;
            if (instructionString === Instructions.ADDI)
                instruction = Instructions.ADDI;
            if (instructionString === Instructions.LDUR)
                instruction = Instructions.LDUR;
            if (instructionString === Instructions.STUR)
                instruction = Instructions.STUR;
            if (instructionString === Instructions.LDUR)
                instruction = Instructions.LDUR;
            if (instructionString === Instructions.B)
                instruction = Instructions.B;
            if (instructionString === Instructions.BL)
                instruction = Instructions.BL;
            if (instructionString === Instructions.BR)
                instruction = Instructions.BR;
            if (instructionString === Instructions.CBNZ)
                instruction = Instructions.CBNZ;
            if (instructionString === Instructions.CBZ)
                instruction = Instructions.CBZ;
            if (instructionString === Instructions.SUB)
                instruction = Instructions.CBZ;
            if (instructionString === Instructions.SUBI)
                instruction = Instructions.CBZ;
            var res = {
                instruction: instruction,
                code: instructionString
            };
            return res;
        };
        this.convertToBinary = function (x, lenght) {
            var bin = 0;
            var rem, i = 1, step = 1;
            while (x != 0) {
                rem = x % 2;
                var al = x / 2;
                x = parseInt(al + "");
                bin = bin + rem * i;
                i = i * 10;
            }
            var numberInString = bin + "";
            var numberInArray = numberInString.split('');
            var arr = new Array(lenght).fill(0);
            var j = 0;
            for (var index = arr.length - numberInString.length; index < arr.length; index++) {
                arr[index] = parseInt(numberInArray[j]);
                j++;
            }
            return arr.join().replace(/,/g, '');
        };
    }
    Traductor.prototype.convertToHexa = function (entrada) {
        var a = entrada.split('');
        var z = [3, 7, 11, 15, 19, 23, 27];
        var b = a.map(function (e, i) {
            if (z.includes(i)) {
                return e + "*";
            }
            return e;
        });
        var f = b.join().replace(/,/g, "").split('*');
        var hexa = {
            '0000': 0,
            '0001': 1,
            '0010': 2,
            '0011': 3,
            '0100': 4,
            '0101': 5,
            '0110': 6,
            '0111': 7,
            '1000': 8,
            '1001': 9,
            '1010': 'A',
            '1011': 'B',
            '1100': 'C',
            '1101': 'D',
            '1110': 'E',
            '1111': 'F',
        };
        var cadenaHexa = f.map(function (binario) {
            //@ts-ignore
            return hexa[binario];
        }).join().replace(/,/g, "");
        return cadenaHexa;
    };
    Traductor.prototype.limpiar = function (entrada) {
        return entrada.trim().replace(/ |X|x|#|/g, "").replace('[', "").replace(']', "");
    };
    return Traductor;
}());
var traductor = new Traductor();
fs_1.default.readFile('./entrada.txt', 'utf-8', function (err, data) {
    if (err) {
        console.log('error al leer el archivo!'.toUpperCase());
    }
    else {
        var entries = data.split("\n");
        entries.map(function (entry) {
            traductor.traducir(entry);
        });
    }
});
