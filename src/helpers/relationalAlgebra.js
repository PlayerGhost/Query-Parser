const KEYWORDS = ['SELECT', 'FROM', 'JOIN', 'ON', 'WHERE']

export function splitQueryIntoBodies(query) {
	let mySqlStringSplitted = query.split(' ')

	let bodies = {}
	let auxBody = ''
	let auxKeyWord = ''

	for (let word of mySqlStringSplitted) {
		if (KEYWORDS.includes(word.toUpperCase())) {
			let auxBodyArray =
				bodies[auxKeyWord] == undefined ? [] : bodies[auxKeyWord]
			auxBodyArray.push(auxBody.trim())

			bodies[auxKeyWord] = auxBodyArray

			auxKeyWord = word
			auxBody = ''
		} else {
			auxBody += word + ' '
		}
	}

	bodies[auxKeyWord] = auxBody.trim()

	Object.entries(bodies).forEach(([key, value]) => {
		if (!(key.toUpperCase() in ['JOIN', 'ON', 'WHERE'])) {
			bodies[key] = value[0]
		}
	})

	delete bodies['']

	return bodies
}



// const relationalAlgebraStrings = {
// 	SELECT: function (body) {
// 		return `π ${body}`
// 	},
// 	JOIN: function (body, fromBody) {
// 		let relationalBodyString = `${fromBody} ⋈ ${body['ON'][0]} ${body['JOIN'][0]}`
// 		delete body['ON'][0]
// 		delete body['JOIN'][0]

// 		body['JOIN'].forEach((joinValue, index) => {
// 			const onValue = body['ON'][index]

// 			relationalBodyString = `${relationalBodyString} ⋈ ${onValue} ${joinValue}`
// 		})

// 		return `(${relationalBodyString})`
// 	},
// 	WHERE: function (body) {
// 		return `σ ${body} `
// 	}
// }

// function printTest() {
// 	console.log(bodies)
// 	console.log()
// 	console.log(relationalAlgebraStrings['SELECT'](bodies['SELECT']))
// 	console.log(relationalAlgebraStrings['WHERE'](bodies['WHERE']))

// 	let joinAux = { JOIN: bodies['JOIN'], ON: bodies['ON'] }

// 	console.log(relationalAlgebraStrings['JOIN'](joinAux, bodies['FROM']))
// }

// printTest()

//console.log(1)
