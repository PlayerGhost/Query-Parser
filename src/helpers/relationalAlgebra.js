import { databaseTable } from './db.js'

let operatorsPriority = ['=', '<=', '>=', '<', '>', '<>']

export class TreeOptimizer {
	constructor(query) {
		this.query = query
		this.leaves = []
		this.bottomNodes = []
		this.priorityArray = []
		this.order = 0
		this.hasJoin = false
		this.hasWhere = false

		if (this.query.JOIN != undefined) {
			this.hasJoin = true
		}

		if (this.query.WHERE != undefined) {
			this.hasWhere = true
		}

		this.setupTree()
		this.setupBottomNodes()
		this.calculateTreePriority()
		this.getPriorityOrder()
	}

	setupTree() {
		for (let table of this.query.tables) {
			let tableNode = new No(table)
			this.leaves.push(tableNode)

			if (this.hasWhere) {
				let selections = this.getTableSelections(table, this.query.WHERE)

				for (let selec of selections) {
					let paiTableNode = new No('σ' + selec)
					tableNode.setPai(paiTableNode)
					paiTableNode.setEsquerdo(tableNode)

					tableNode = tableNode.getPai()
				}
			}

			let tableNodePai = new No(
				'π' + this.getTableAtributes(table, this.query.SELECT)
			)

			tableNode.setPai(tableNodePai)
			tableNodePai.setEsquerdo(tableNode)
		}

		if (this.hasJoin) {
			this.tree = this.startBuildJunction(this.leaves)
			return
		}

		this.tree = this.buildTreeSelect(this.leaves[0])
	}

	buildTreeSelect(No) {
		if (No.pai != null) {
			return this.buildTreeSelect(No.pai)
		} else {
			return No
		}
	}

	buildJunction(comparator, index, pairs) {
		if (!comparator[index]) {
			console.log('buildJunction tree leaves', comparator)
			return comparator[0].getPai()
		}

		if (comparator.length == 1) {
			console.log('buildJunction tree', comparator)
			return comparator[0].getPai()
		}

		let proxIndex = index == comparator.length - 1 ? index - 1 : index + 1

		if (comparator[index].getPai()) {
			comparator[index] = comparator[index].getPai()
			//comparator[index].setOrder(++this.order);

			if (comparator[proxIndex].getPai()) {
				comparator[proxIndex] = comparator[proxIndex].getPai()
			}

			return this.buildJunction(comparator, index, pairs)
		} else {
			let atual = comparator[index]
			let prox = comparator[proxIndex]

			let expression = ''

			for (const on of this.query.ON) {
				if (atual.name.includes(on.left.atribute)) {
					expression = on.expression
					break
				}

				if (atual.name.includes(on.right.atribute)) {
					expression = on.expression
					break
				}
			}

			let father = new No(`⋈${expression}`)

			father.setEsquerdo(comparator[Math.min(index, proxIndex)])
			father.setDireito(comparator[Math.max(index, proxIndex)])
			//father.setEsquerdo(comparator[index])
			//father.setDireito(comparator[proxIndex])

			let projectionAttributes = []

			projectionAttributes = atual.name.replaceAll('π', '').split(',')
			projectionAttributes = projectionAttributes.concat(
				prox.name.replaceAll('π', '').split(',')
			)

			console.log('log', projectionAttributes)

			for (let on of this.query.ON) {
				if (expression == on.expression) {
					if (projectionAttributes.includes(on.left.atribute)) {
						if (!this.query.SELECT.includes(on.left.atribute)) {
							let indexToRemove = projectionAttributes.indexOf(
								on.left.atribute
							)
							projectionAttributes.splice(indexToRemove, 1)
						}
					}

					if (projectionAttributes.includes(on.right.atribute)) {
						if (!this.query.SELECT.includes(on.right.atribute)) {
							let indexToRemove = projectionAttributes.indexOf(
								on.right.atribute
							)
							projectionAttributes.splice(indexToRemove, 1)
						}
					}
				}
			}

			let fatherProjection = new No(`π${projectionAttributes.join(',')}`)

			fatherProjection.setEsquerdo(father)

			father.setPai(fatherProjection)

			comparator[index].setPai(father)
			comparator[proxIndex].setPai(father)

			comparator[Math.min(proxIndex, index)] = father
			comparator.splice(Math.max(proxIndex, index), 1)

			/*pairs = [];
			pairs.push(father);*/
			//comparator[Math.min(prox, index)].setOrder(++this.order);
			return this.buildJunction(comparator, proxIndex, pairs)
		}
	}

	startBuildJunction(comparator) {
		console.log(`comparator`, comparator)
		const index = this.getIndexBiggerPriority(comparator)
		console.log(`index`, index)
		return this.buildJunction(comparator, index, [])
	}

	getIndexBiggerPriority(array) {
		let priorityIndex = 10
		let priorityValue = 10
		for (let i = 0; i < array.length; i++) {
			if (
				array[i].pai.priority < priorityValue &&
				array[i].pai.priority != -1
			) {
				priorityIndex = i
				priorityValue = array[i].pai.priority
			}
		}
		return priorityIndex
	}

	getTableAtributes(table, select) {
		let atributes = new Set()

		for (let i of select.split(',')) {
			i = i.trim()

			if (this.isAtributeFromTable(table, i)) {
				atributes.add(i)
			}
		}

		if (this.hasJoin) {
			for (const on of this.query.ON) {
				if (table == on.left.table) {
					atributes.add(on.left.atribute)
				} else if (table == on.right.table) {
					atributes.add(on.right.atribute)
				}
			}
		}

		return Array.from(atributes)
	}

	getTableSelections(table, WHERE) {
		let selections = []

		for (let i of WHERE.atributes) {
			if (this.isAtributeFromTable(table, i)) {
				selections.push(WHERE.expressions[WHERE.atributes.indexOf(i)])
			}
		}

		return selections
	}

	isAtributeFromTable(table, atribute) {
		return databaseTable[table].includes(atribute)
	}

	calculateTreePriority() {

		for (let table of this.bottomNodes) {
			let currentNode = table
			while (currentNode != null) {
				const operatorScore = {
					'σ': 1,
					'π': 5 * currentNode.name.split(',').length,
					'⋈': 10
				}
				const currentScore =(operatorScore[currentNode.name[0]] || 0)
				// priorityArray[currentScore] = priorityArray[currentScore] || [];
                
				currentNode.order = currentScore

				if(currentNode.esquerdo != null){
                      currentNode.order+=currentNode.esquerdo.order
				}

				if(currentNode.direito != null){
					currentNode.order+=currentNode.direito.order
				}

				if (!this.priorityArray.map(x => x[0]).includes(currentNode.name)) {
					this.priorityArray.push([currentNode.name, currentNode.order])
				} else {
					const existingIndex = this.priorityArray.map(x => x[0]).indexOf(currentNode.name)
					this.priorityArray[existingIndex][1] = Math.max(this.priorityArray[existingIndex][1], currentNode.order)
				}

				currentNode = currentNode.pai
			}
		}

		this.priorityArray.sort((a, b) => (a[1] - b[1]))
		console.log('aqui ó', this.priorityArray)
		
	}

	getPriorityOrder() {

		this.priorityArray = this.priorityArray.slice(this.bottomNodes.length)
		console.log('aqui ó', this.priorityArray)

		for (let table of this.bottomNodes) {
			let currentNode = table
			while (currentNode != null) {

				const existingIndex = this.priorityArray.map(x => x[0]).indexOf(currentNode.name)
				currentNode.order = existingIndex + 1
         
				currentNode = currentNode.pai
			}
		}
	}



	setupBottomNodes() {
		this.bottomNodes = []
		this.lookForBottomNode(this.tree)
		this.bottomNodes = this.bottomNodes.filter(
			(n) => n.esquerdo == n.direito && n.direito == null
		)
	}

	lookForBottomNode(currentNode) {
		if (currentNode == null) return

		if (currentNode.esquerdo != null) {
			this.lookForBottomNode(currentNode.esquerdo)
		}

		this.bottomNodes.push(currentNode)

		if (currentNode.direito != null) {
			this.lookForBottomNode(currentNode.direito)
		}
	}

	// calculateNodePriority(currentNode, isGoingDown, accumulatedScore) {
	// 	if (currentNode == null) return accumulatedScore
	// 	if (isGoingDown) {
	// 		return calcu
	// 	}
	// }
}

class No {
	constructor(name) {
		this.name = name
		this.pai = null
		this.esquerdo = null
		this.direito = null
		this.order = 0

		if (name.startsWith('σ')) {
			this.priority = operatorsPriority.indexOf(name.split(' ')[1])
			return
		}

		this.priority = -1
	}

	setPriority(priority) {
		this.priority = priority
	}

	getPriority() {
		return this.priority
	}

	setOrder(order) {
		this.order = order
	}

	getPai() {
		return this.pai
	}

	setPai(no) {
		this.pai = no
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


const teste = "SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRIÇÃO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA WHERE SALDOINICIAL < 3000 AND UF = 'CE' AND DESCRIÇÃO <> 'CONTA CORRENTE'";
//const teste = "SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE SALDOINICIAL >= 235 AND UF = 'CE' AND CEP <> '62930000'";
//const teste = "SELECT IDUSUARIO, NOME, DATANASCIMENTO FROM USUARIO WHERE UF = 'CE' AND CEP <> '62930000'"
//const teste = 'SELECT IDUSUARIO, NOME, DATANASCIMENTO FROM USUARIO'

generateGraphToPlot(teste)
export function generateGraphToPlot(userQuery) {
	const queryBodies = splitQueryIntoBodies(userQuery)
	const tree = new TreeOptimizer(queryBodies).tree
	tree.name = `π${queryBodies.SELECT}`
	let graph = getNodeData(tree)

	console.log('test', queryBodies.SELECT)

	console.log('DEBUG')
	console.log('Query bodies: ', queryBodies)
	console.log()
	console.log('tree: ', tree)
	console.log()
	console.log('graphStructure: ', graph)
	console.log()

	return graph
}

function getNodeData(No) {
	let noData = [
		{
			id: No.name,
			parent: No.pai != null ? No.pai.name : '',
			name: `${No.name} (${No.order})`
		}
	]

	if (No.esquerdo != null) {
		noData = noData.concat(getNodeData(No.esquerdo))
	}

	if (No.direito != null) {
		noData = noData.concat(getNodeData(No.direito))
	}

	return noData
}

//generateGraphToPlot()

export function splitQueryIntoBodies(query) {
	let mySqlStringSplitted = query.split(' ')

	let bodies = {}

	let auxBody = ''
	let keyWords = ['SELECT', 'FROM', 'JOIN', 'ON', 'WHERE']
	let auxKeyWord = ''
	let hasJoin = false
	let hasWhere = false

	for (let word of mySqlStringSplitted) {
		if (keyWords.includes(word)) {
			let auxBodyArray = bodies[auxKeyWord] == undefined ? [] : bodies[auxKeyWord]
			auxBodyArray.push(auxBody.trim())

			bodies[auxKeyWord] = auxBodyArray

			auxKeyWord = word
			auxBody = ''
		} else {
			auxBody += word + ' '
		}
	}

	bodies[auxKeyWord] = auxBody.trim()

	if (bodies['WHERE'] != undefined) {
		hasWhere = true
	}

	Object.entries(bodies).forEach(([key, value]) => {
		if (key != 'JOIN' && key != 'ON' && key != 'WHERE') {
			if (!hasWhere) {
				if (key != 'FROM') {
					bodies[key] = value[0]
				}
			} else {
				bodies[key] = value[0]
			}
		}
	})

	if (bodies['JOIN'] != undefined) {
		hasJoin = true
	}

	if (hasJoin) {
		Object.entries(bodies['ON']).forEach(([key, value]) => {
			let contents = value.split('=')
			let contentLeft = {}
			let contentRight = {}

			if (contents[0].trim().split('.').length < 2) {
				contentLeft = {
					table: ' ',
					atribute: contents[0].trim().split('.')[0]
				}
				contentRight = {
					table: ' ',
					atribute: contents[1].trim().split('.')[0]
				}
			} else {
				contentLeft = {
					table: contents[0].trim().split('.')[0],
					atribute: contents[0].trim().split('.')[1]
				}
				contentRight = {
					table: contents[1].trim().split('.')[0],
					atribute: contents[1].trim().split('.')[1]
				}
			}

			bodies['ON'][key] = {
				left: contentLeft,
				right: contentRight,
				expression: value
			}
		})
	}

	let tables = [bodies['FROM']]

	if (hasWhere) {
		let expressions = bodies['WHERE'].split('AND')
		let expressionsPriority = new Set()
		let expressionsAtributesPriority = new Set()

		let tablesPriority = new Set()

		if (hasJoin) {
			tables = tables.concat(bodies['JOIN'])
		}

		for (let i of operatorsPriority) {
			for (let j of expressions) {
				if (j.includes(i)) {
					expressionsPriority.add(j.trim())

					let atribute = j.split(/(=|<|>|<>|<=|>=)/)

					expressionsAtributesPriority.add(atribute[0].trim())
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
		}

		bodies['WHERE']['atributes'].forEach((value, index) => {
			for (let j of tables) {
				if (databaseTable[j].includes(value)) {
					tablesPriority.add(j)
				}
			}
		})

		bodies['tables'] = Array.from(tablesPriority)
	} else {
		bodies['tables'] = tables
	}

	delete bodies['']
	return bodies
}