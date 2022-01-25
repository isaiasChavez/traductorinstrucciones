import fs from 'fs'
import colors from 'colors'

enum Instructions {
    B = "B",
    ADD = "ADD",
    SUB = "SUB",
    ADDI = "ADDI",
    SUBI = "SUBI",
    BL = "BL",
    CBZ = "CBZ",
    CBNZ = "CBNZ",
    BR = "BR",
    STUR = "STUR",
    LDUR = "LDUR"
}

enum InstructionsCode {
    B = "000101",
    ADD = "10001011000",
    SUB = "11001011000",
    ADDI = "1001000100",
    SUBI = "1101000100",
    BL = "100101",
    CBZ = "10110100",
    CBNZ = "10110101",
    BR = "11010110000",
    STUR = "11111000000",
    LDUR = "11111000010"
}
const Formats = {
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
}

class Traductor {

    private param1: number = 0
    private param2: number = 0
    private param3: number = 0

    constructor() {

    }

    traducir = (entrada: string) => {
        const data = this.limpiar(entrada)
        const {instruction,code} = this.dividirEntrada(data)

        let param1Bin =  ""
        let param2Bin:string|null =  ""
        let param3Bin:string|null =  ""
        
        switch (instruction) {
            case Instructions.ADD:
            case Instructions.SUB:
                param1Bin = this.convertToBinary(this.param1,Formats.R.param1)
                param2Bin = this.convertToBinary(this.param2,Formats.R.param2)
                param3Bin = this.convertToBinary(this.param3,Formats.R.param3)
            break

            case Instructions.ADDI:
            case Instructions.SUBI:
                param1Bin = this.convertToBinary(this.param1,Formats.I.param1)
                param2Bin = this.convertToBinary(this.param2,Formats.I.param2)
                param3Bin = this.convertToBinary(this.param3,Formats.I.param3)
            break

            case Instructions.CBZ:
            case Instructions.CBNZ:
                param1Bin = this.convertToBinary(this.param1,Formats.CBZ.param1)
                param2Bin = this.convertToBinary(this.param2,Formats.CBZ.param2)

            break
            case Instructions.STUR:
            case Instructions.LDUR: 
                param1Bin = this.convertToBinary(this.param1,Formats.STUR.param1)
                param2Bin = this.convertToBinary(this.param2,Formats.STUR.param2)
                param3Bin = this.convertToBinary(this.param3,Formats.STUR.param3)
            break
            default:
                break;
        }
        
        param3Bin = param3Bin.length >0?param3Bin : null
        const stringBinary =  InstructionsCode[instruction]+param3Bin+param2Bin+param1Bin
        const resultHexa:string = this.convertToHexa(stringBinary)
        console.log(resultHexa,stringBinary)
        

        return data
    }

    private convertToHexa(entrada:string){



        const a =  entrada.split('')
        const z = [ 3,7,11,15,19,23,27]
        let b =  a.map((e,i)=>{
            if (z.includes(i)) {
                return e+"*" 
            }
            return e
        })
        const f =  b.join().replace(/,/g, "").split('*')

        const hexa = {
            '0000':0,
            '0001':1,
            '0010':2,
            '0011':3,
            '0100':4,
            '0101':5,
            '0110':6,
            '0111':7,
            '1000':8,
            '1001':9,
            '1010':'A',
            '1011':'B',
            '1100':'C',
            '1101':'D',
            '1110':'E',
            '1111':'F',
        }

        const cadenaHexa = f.map((binario:string)=>{
            //@ts-ignore
            return hexa[binario]
        }).join().replace(/,/g, "")
        return cadenaHexa
    }



    private limpiar(entrada: string) {
        return entrada.trim().replace(/ |X|x|#|/g, "").replace('[', "").replace(']', "")

    }
    
    private dividirEntrada = (entrada: string): {
        instruction:Instructions,
        code:string
    } => {
        const array = entrada.split(',')
        const instructionString = array[0]
        this.param1 = parseInt(array[1])

        if (array.length >= 3) {
            this.param2 = parseInt(array[2])
        }
        if (array.length >= 4) {
            this.param3 = parseInt(array[3])
        }
        let instruction = Instructions.ADD

        if (instructionString === Instructions.ADD) instruction =  Instructions.ADD
        if (instructionString === Instructions.ADDI) instruction =  Instructions.ADDI
        if (instructionString === Instructions.LDUR) instruction =  Instructions.LDUR
        if (instructionString === Instructions.STUR) instruction =  Instructions.STUR
        if (instructionString === Instructions.LDUR) instruction =  Instructions.LDUR
        if (instructionString === Instructions.B) instruction =  Instructions.B
        if (instructionString === Instructions.BL) instruction =  Instructions.BL
        if (instructionString === Instructions.BR) instruction =  Instructions.BR
        if (instructionString === Instructions.CBNZ) instruction =  Instructions.CBNZ
        if (instructionString === Instructions.CBZ) instruction =  Instructions.CBZ
        if (instructionString === Instructions.SUB) instruction =  Instructions.CBZ
        if (instructionString === Instructions.SUBI) instruction =  Instructions.CBZ

        const res = {
            instruction,
            code:instructionString
        } 
        return res 
    }
    private convertToBinary= (x:number,lenght:number):string =>{
        let bin = 0;
        let rem, i = 1, step = 1;
        while (x != 0) {
            rem = x % 2;
            const al = x/2 
            x = parseInt(al + "");
            bin = bin + rem * i;
            i = i * 10;
        }
        const numberInString = bin  + ""
        const numberInArray =  numberInString.split('')
        const arr = new Array(lenght).fill(0)
        let j =  0
        for (let index = arr.length - numberInString.length ; index < arr.length; index++) {
            arr[index] =  parseInt(numberInArray[j])  
            j++
        }  
        return arr.join().replace(/,/g,'')
         
    }

}

const traductor = new Traductor()


fs.readFile('./entrada.txt', 'utf-8', (err, data:string) => {
    if(err) {
      console.log('error al leer el archivo!'.toUpperCase());
    } else {



        const entries:string[] = data.split("\n")
    entries.map(entry=>{
        
        

        traductor.traducir(entry)
    })
    



    }
  });
