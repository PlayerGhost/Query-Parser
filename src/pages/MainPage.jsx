import { removeWritespaces } from '../services/backend';
import './MainPage.css';

export default function MainPage() {
	const text = '    eu sou   uma busca  zudaa  ouoooooo     uuuu !! ';
	console.log(`[${text}]`);
	console.log(`[${removeWritespaces(text)}]`);

	return (
		<div className="main">
			<input type="text" id="query" placeholder="Insira!" />
			<button id="parse-query">Receba!</button>
			<div id="results">
				<h2>Resultado da consulta</h2>
				<div id="results-body"></div>
			</div>
		</div>
	);
}
