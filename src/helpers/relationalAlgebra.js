import { databaseTable } from './db.js';

export class TreeOptimizer {
	constructor(query) {
		this.query = query;
		this.leaves = [];
		this.order = 0;

		for (let table of query.tables) {
			let selections = this.getTableSelections(table, query.WHERE);
			let aux = new No(table);
			this.leaves.push(aux);
			for (let selec of selections) {
				aux.setPai(new No('σ' + selec));
				aux = aux.getPai();
			}
			aux.setPai(new No('π' + this.getTableAtributes(table, query.SELECT)));
		}

		let comparator = [];
		for (let i = 0; i < this.leaves.length; i++) {
			comparator.push(this.leaves[i].getPai());
		}
		console.log(JSON.stringify(comparator));
		console.log(this.startBuildJunction(comparator));
		// console.log(JSON.stringify(this.leaves))
	}

	buildJunction(comparator, index, pairs) {
		if (!comparator[index]) {
			console.log(JSON.stringify(this.leaves));
		}

		if (comparator.length == 1) {
			return comparator[0];
		}

		// TODO Index chega nulo neste if e quebra a aplicação
		if (comparator[index].getPai()) {
			comparator[index] = comparator[index].getPai();
			comparator[index].setOrder(++this.order);
			return this.buildJunction(comparator, index, pairs);
		} else {
			let prox = index == comparator.length - 1 ? index - 1 : index + 1;
			if (pairs.length == 2) {
				console.log('entrou');
				console.log(comparator);
				const father = new No(
					comparator[index].name + ',' + comparator[prox].name
				);
				comparator[prox].setPai(father);
				comparator[index].setPai(father);
				comparator[Math.min(prox, index)] = father;
				comparator.splice(Math.max(prox, index), 1);
				pairs = [];
				pairs.push(father);
				comparator[Math.min(prox, index)].setOrder(++this.order);
				return this.buildJunction(comparator, prox, pairs);
			} else {
				pairs.push(comparator[index]);
				comparator[prox].setOrder(++this.order);
				return this.buildJunction(comparator, prox, pairs);
			}
		}
	}

	startBuildJunction(comparator) {
		const index = this.getIndexBiggerPriority(comparator);
		return this.buildJunction(comparator, index, []);
	}

	getIndexBiggerPriority(array) {
		let priorityIndex = 10;
		let priorityValue = 10;
		for (let i = 0; i < array.length; i++) {
			if (array[i].priority < priorityValue) {
				priorityIndex = i;
				priorityValue = array[i].priority;
			}
		}
		return priorityIndex;
	}

	getTableAtributes(table, select) {
		let atributes = [];

		for (let i of select.split(',')) {
			i = i.trim();

			if (this.isAtributeFromTable(table, i)) {
				atributes.push(i);
			}
		}

		return atributes;
	}

	getTableSelections(table, WHERE) {
		let selections = [];

		for (let i of WHERE.atributes) {
			if (this.isAtributeFromTable(table, i)) {
				selections.push(WHERE.expressions[WHERE.atributes.indexOf(i)]);
			}
		}

		return selections;
	}

	isAtributeFromTable(table, atribute) {
		return databaseTable[table].includes(atribute);
	}
}
let priorityRules = ['=', '<=', '>=', '<', '>', '<>'];
class No {
	constructor(name) {
		this.name = name;
		this.pai = null;
		this.esquerdo = null;
		this.direito = null;
		if (name.startsWith('σ')) {
			this.priority = priorityRules.indexOf(name.split(' ')[1]);
			return;
		}

		this.priority = -1;
		this.order = -1;
	}

	setPriority(priority) {
		this.priority = priority;
	}

	getPriority() {
		return this.priority;
	}

	setOrder(order) {
		this.order = order;
	}

	getPai() {
		return this.pai;
	}

	setPai(no) {
		this.pai = no;
	}

	setEsquerdo(no) {
		if (no == this) return;
		this.esquerdo = no;
	}

	setDireito(no) {
		if (no == this) return;
		this.direito = no;
	}
}

const teste =
	"SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRIÇÃO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA WHERE SALDOINICIAL < 3000 AND UF <> 'CE' AND DESCRIÇÃO = 'CONTA CORRENTE'";
// const teste =
// 	"SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE SALDOINICIAL >= 235 AND UF = 'CE' AND CEP <> '62930000'";
// const teste =
// 	"SELECT LNAME FROM EMPLOYEE, WORKS_ON, PROJECT WHERE PNAME = ‘AQUARIUS’ AND PNUMBER = PNO AND ESSN = SSN AND BDATE > ‘1957-12-31’";

// console.log('----------------------------------------------------------------');
const queryBodies = splitQueryIntoBodies(teste);
//console.log(queryBodies);
console.log();
const tree = new TreeOptimizer(splitQueryIntoBodies(teste));
let treeStructure = tree.buildJunction(tree.leaves);
//console.log("leavessss ----", this.leaves)
console.log('DEBUG');
console.log('final --->', treeStructure);
console.log();

//let graph = new Springy.Graph();

console.log();

export function splitQueryIntoBodies(query) {
	let mySqlStringSplitted = query.split(' ');

	let bodies = {};

	let auxBody = '';
	let keyWords = ['SELECT', 'FROM', 'JOIN', 'ON', 'WHERE'];
	let auxKeyWord = '';

	for (let word of mySqlStringSplitted) {
		if (keyWords.includes(word)) {
			let auxBodyArray =
				bodies[auxKeyWord] == undefined ? [] : bodies[auxKeyWord];
			auxBodyArray.push(auxBody.trim());

			bodies[auxKeyWord] = auxBodyArray;

			auxKeyWord = word;
			auxBody = '';
		} else {
			auxBody += word + ' ';
		}
	}

	bodies[auxKeyWord] = auxBody.trim();

	Object.entries(bodies).forEach(([key, value]) => {
		if (key != 'JOIN' && key != 'ON' && key != 'WHERE') {
			bodies[key] = value[0];
		}
	});

	Object.entries(bodies['ON']).forEach(([key, value]) => {
		let contents = value.split('=');
		let contentLeft = {};
		let contentRight = {};

		if (contents[0].trim().split('.').length < 2) {
			contentLeft = { table: ' ', atribute: contents[0].trim().split('.')[0] };
			contentRight = { table: ' ', atribute: contents[1].trim().split('.')[0] };
		} else {
			contentLeft = {
				table: contents[0].trim().split('.')[0],
				atribute: contents[0].trim().split('.')[1]
			};
			contentRight = {
				table: contents[1].trim().split('.')[0],
				atribute: contents[1].trim().split('.')[1]
			};
		}

		bodies['ON'][key] = {
			left: contentLeft,
			right: contentRight,
			expression: value
		};
	});

	let operatorsPriority = ['=', '<=', '>=', '<', '>', '<>'];
	let expressions = bodies['WHERE'].split('AND');
	let expressionsPriority = new Set();
	let expressionsAtributesPriority = new Set();
	let tables = [bodies['FROM']].concat(bodies['JOIN']);
	let tablesPriority = [];

	for (let i of operatorsPriority) {
		for (let j of expressions) {
			// console.log('sera q tem ', i, ' no ', j, '?', j.includes(i))
			if (j.includes(i)) {
				expressionsPriority.add(j.trim());

				let atribute = j.split(/(=|<|>|<>|<=|>=)/);

				expressionsAtributesPriority.add(atribute[0].trim());
				//expressions.splice(expressions.indexOf(j), 1);
			}
		}
	}

	expressionsAtributesPriority = new Array(...expressionsAtributesPriority);
	expressionsPriority = new Array(...expressionsPriority);

	bodies['WHERE'] = {
		expression: bodies['WHERE'],
		expressions: expressionsPriority,
		atributes: expressionsAtributesPriority
	};

	bodies['WHERE']['atributes'].forEach((value, index) => {
		for (let j of tables) {
			if (databaseTable[j].includes(value)) {
				tablesPriority.push(j);
			}
		}
	});

	bodies['tables'] = tablesPriority;

	delete bodies[''];
	return bodies;
}
