import { No } from "./No";

export class TreeOptimizer {
	constructor(query) {
		this.leaves = [];
		this.leaves.push(new No(query.FROM));
		// console.log(query.JOIN);
		for (let table of query.JOIN) {
			let aux = new No(table);

			this.leaves.push(aux);
		}
        const whereValues = query.WHERE.split('AND')
        const atributes = [];
        for(let att of whereValues){
            atributes.push(this.getAtributes(att))
        }
        console.log(atributes)

        const selectValues = query.SELECT.split(',').map(val => {
            let aux = val.trim()

        })

        this.leaves.map(leave => {
            return {
                [leave.name]: []
            }
        })
	}

    getLeaveByName(name){
        for(var i=0; i<this.leaves.length; i++){
            if(this.leaves[i].name == name){
                return this.leaves[i]
            }
        }
        throw "Nao encontrou folha com esse nome"
    }

    getAtributes(value){
        return value.trim().split(' ')[0]
    }

	buildTree(query) {}

	printLeaves() {
		for (let leave of this.leaves) {
			console.log(leave, '-->');
		}
	}
}