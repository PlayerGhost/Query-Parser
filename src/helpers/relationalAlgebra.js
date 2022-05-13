import { databaseTable } from './db.js';

class TreeOptimizer {
	constructor(query) {
		this.query = query
		this.leaves = [];
		/*this.leaves.push(
			new No(
				this.getTableSelections(query.tables[0], query.WHERE),
				this.getTableAtributes(query.tables[0], query.SELECT),
				query.FROM
			)
		);*/

		for (let table of query.tables) {
			let aux = new No(
				this.getTableSelections(table, query.WHERE),
				this.getTableAtributes(table, query.SELECT),
				table
			);

			this.leaves.push(aux);
		}
	}

	buildJunction(currentLeaves) {
		if (currentLeaves.length > 1) {
			const noEsquerdo = currentLeaves[0];
			const noDireito = currentLeaves[1];
			//console.log('esq', noEsquerdo, 'esq')
			//console.log('dir', noDireito, 'dir')
			// const father = new No(
			// 	'',
			// 	noEsquerdo.aresta.projecao.concat(noDireito.aresta.projecao),
			// 	`${noEsquerdo.name + ' |x| <cond> (' + noDireito.name})`
			// );

			for (let onStructure of this.query.ON) {
				if (onStructure.left.table == noEsquerdo.name && onStructure.right.table == noDireito.name) {
					const father = new No(
						'',
						noEsquerdo.aresta.projecao.concat(noDireito.aresta.projecao),
						`|x|${onStructure.expression}`
					);

					noEsquerdo.setPai(father)
					noDireito.setPai(father)
					father.setEsquerdo(noEsquerdo)
					father.setDireito(noDireito)
					return this.buildJunction([father, ...currentLeaves.slice(2)]);
				}
			}
		}

		return currentLeaves[0]
	}

	buildTree(query) { }

	printLeaves() {
		for (let leave of this.leaves) {
			console.log(leave, '-->');
		}
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

class No {
	constructor(selecao, projecao, name) {
		this.aresta = new Aresta(selecao, projecao);
		this.name = name;
		this.pai = null;
		this.esquerdo = null
		this.direito = null
	}

	setPai(no) {
		this.pai = no;
	}

	setEsquerdo(no) {
		if (no == this) return
		this.esquerdo = no
	}

	setDireito(no) {
		if (no == this) return
		this.direito = no
	}
}

class Aresta {
	constructor(selecao, projecao) {
		this.selecao = selecao;
		this.projecao = projecao;
	}
}

let relationalAlgebraStrings = {
	SELECT: function (body) {
		return `π ${body}`;
	},
	JOIN: function (body, fromBody) {
		let relationalBodyString = `${fromBody} ⋈ ${body['ON'][0]} ${body['JOIN'][0]}`;
		//delete body['ON'][0];
		//delete body['JOIN'][0];

		body['JOIN'].forEach((joinValue, index) => {
			const onValue = body['ON'][index];

			relationalBodyString = `${relationalBodyString} ⋈ ${onValue} ${joinValue}`;
		});

		return `(${relationalBodyString})`;
	},
	WHERE: function (body) {
		return `σ ${body} `;
	}
};

/*function printTest() {
	console.log(bodies);
	console.log();
	console.log(relationalAlgebraStrings['SELECT'](bodies['SELECT']));
	console.log(relationalAlgebraStrings['WHERE'](bodies['WHERE']));

	let joinAux = { JOIN: bodies['JOIN'], ON: bodies['ON'] };

	console.log(relationalAlgebraStrings['JOIN'](joinAux, bodies['FROM']));
}*/
/*
SELECT
IDUSUARIO,
NOME,
DATANASCIMENTO,
DESCRICAO,
SALDOINICIAL,
UF, 
DESCRIÇÃO
FROM USUARIO
JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO
JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA
WHERE SALDOINICIAL < 3000 AND UF = 'CE' AND DESCRIÇÃO <> 'CONTA CORRENTE'";
*/

/*
"SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL
FROM USUARIO
JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO
WHERE SALDOINICIAL >=235 AND UF ='CE' AND CEP <> '62930000'";
*/

/*
SELECT LNAME
FROM EMPLOYEE, WORKS_ON, PROJECT
WHERE PNAME = ‘AQUARIUS’ AND
PNUMBER = PNO AND ESSN = SSN AND
BDATE > ‘1957-12-31’
*/
//printTest();
const teste =
	"SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRIÇÃO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA WHERE SALDOINICIAL < 3000 AND UF <> 'CE' AND DESCRIÇÃO = 'CONTA CORRENTE'";
// const teste =
// 	"SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE SALDOINICIAL >= 235 AND UF = 'CE' AND CEP <> '62930000'";
// const teste =
// 	"SELECT LNAME	FROM EMPLOYEE, WORKS_ON, PROJECT WHERE PNAME = ‘AQUARIUS’ AND PNUMBER = PNO AND ESSN = SSN AND BDATE > ‘1957-12-31’";

// console.log('----------------------------------------------------------------');
//console.log(queryBodies);

export function generateGraphToPlot() {
	const queryBodies = splitQueryIntoBodies(teste)
	const tree = new TreeOptimizer(splitQueryIntoBodies(teste))
	let treeStructure = tree.buildJunction(tree.leaves)

	let graph = []
	/*{
		id: 'theworld',
		parent: '',
		name: 'The World',
	}*/

	console.log('DEBUG')
	console.log("final --->", treeStructure)
	console.log()

	return graph
}

generateGraphToPlot()

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

		bodies['ON'][key] = { left: contentLeft, right: contentRight, expression: value };
	});

	let operatorsPriority = ['=', '<=', '>=', '<', '>', '<>'];
	let expressions = bodies['WHERE'].split('AND');
	let expressionsPriority = new Set()
	let expressionsAtributesPriority = new Set()
	let tables = [bodies["FROM"]].concat(bodies["JOIN"])
	let tablesPriority = []

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

	expressionsAtributesPriority = new Array(...expressionsAtributesPriority)
	expressionsPriority = new Array(...expressionsPriority)

	bodies['WHERE'] = {
		expression: bodies['WHERE'],
		expressions: expressionsPriority,
		atributes: expressionsAtributesPriority
	};

	bodies['WHERE']["atributes"].forEach((value, index) => {
		for (let j of tables) {
			if (databaseTable[j].includes(value)) {
				tablesPriority.push(j)
			}
		}
	})

	bodies["tables"] = tablesPriority

	delete bodies[''];
	return bodies;
}
