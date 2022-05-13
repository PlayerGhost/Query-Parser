import { useState } from "react"

import {
	// getAttributesFromTable,
	validateAttributes,
} from "../helpers/load-json"
import { removeWhitespaces } from "../helpers/text-parser"
//import { regex } from '../helpers/regex';
import { splitQueryIntoBodies } from "../helpers/relationalAlgebra"

import "./MainPage.css"

const ENTER_KEYCODE = 13
const ERROR_MESSAGE_TIMEOUT = 3000

export default function MainPage() {
	const [query, setQuery] = useState("")
	const [result, setResult] = useState("")
	const [error, setError] = useState("")

	const onClick = () => {
		if (!query) {
			showErrorMessage("Sem query!")
			return
		}

		const filteredQuery = removeWhitespaces(query)

		if (!filteredQuery.match(regex)) {
			console.warn("Query filtrada", filteredQuery)
			showErrorMessage("Query não passou no regex de verificação inicial!")
			return
		}

		const bodies = splitQueryIntoBodies(filteredQuery)
		if (!bodies) {
			showErrorMessage("Não foi possível decompor a query!")
		}

		if (!validateAttributes(bodies)) {
			showErrorMessage("Algum atributo/tabela não existe no banco de dados!")
		}

		setResult(JSON.stringify(bodies))
	}

	const showErrorMessage = (message) => {
		console.error(message)
		setError(message)
		setTimeout(() => setError(""), ERROR_MESSAGE_TIMEOUT)
	}

	return (
		<div className="main">
			<section className="corpo">
				<h1>Processador de consultas - AV2</h1>
				<div className="user-input">
					<input
						type="text"
						id="query"
						placeholder="Insira sua consulta SQL."
						value={query}
						onChange={(q) => setQuery(q.target.value)}
						onKeyDown={(e) => e.keyCode === ENTER_KEYCODE && onClick()}
					></input>
					<button id="parse-query" onClick={onClick}>
						Executar
					</button>
				</div>
				<div className="results">
					<h2>Resultado da consulta</h2>
					{Boolean(error) && <h3 className="error-message">Erro: {error}</h3>}
					{Boolean(result) && <div id="results-body">{result}</div>}
					{Boolean(result) && <div id="results-body">{result}</div>}
				</div>
			</section>
		</div>
	)
}
