import { useState } from "react"

import {
	parseCommaWhitespaces,
	removeWhitespaces,
} from "../helpers/text-parser"
import { regex } from "../helpers/regex"
import { splitQueryIntoBodies } from "../helpers/relationalAlgebra"
// import {
// 	getAttributesFromTable,
// 	validateAttributes
// } from '../helpers/load-json';

import "./MainPage.css"

export default function MainPage() {
	const [query, setQuery] = useState("")

	const onClick = () => {
		if (!query) {
			console.warn("Sem query!")
			return
		}

		const filteredQuery = removeWhitespaces(query)

		if (!filteredQuery.match(regex)) {
			console.warn("query não passou no regex de verificação inicial!")
			console.warn("Query filtrada", filteredQuery)
			console.warn("Regex", regex)
			return
		}

		const fixedCommaWhitespaceText = parseCommaWhitespaces(filteredQuery)

		const bodies = splitQueryIntoBodies(fixedCommaWhitespaceText)
		console.log(bodies)
		// setQuery(text)
	}

	return (
		<div className="main">
			<div className="user-input">
				<h2>Processador de consultas</h2>
				<input
					type="text"
					id="query"
					placeholder="Insira!"
					value={query}
					onChange={(q) => setQuery(q.target.value)}
					onKeyDown={(e) => e.keyCode === 13 && onClick()}
				></input>
				<button id="parse-query" onClick={onClick}>
					Receba!
				</button>
			</div>
			<div className="results">
				<h2>Resultado da consulta</h2>
				<div id="results-body">{query}</div>
			</div>
		</div>
	)
}
