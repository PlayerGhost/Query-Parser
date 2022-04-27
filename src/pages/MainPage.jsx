import { removeWhitespaces } from '../services/backend';
import './MainPage.css';

export default function MainPage() {
	const text = '    eu sou   uma busca  zudaa  ouoooooo     uuuu !! ';
	console.log(`[${text}]`);
	console.log(`[${removeWhitespaces(text)}]`);

	return (
		<div className="main">
			<div className="user-input">
				<h2>Processador de consultas</h2>
				<input type="text" id="query" placeholder="Insira!" />
				<button id="parse-query">Receba!</button>
			</div>
			<div class="results">
				<h2>Resultado da consulta</h2>
				<div id="results-body"></div>
			</div>
		</div>
	);
}
