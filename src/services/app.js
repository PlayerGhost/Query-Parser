function loadJson() {
  const data = require("./user.json");
  return data;
}

function findKeyAndValueOnJson(properties) {
  json = loadJson();
  const values = properties.split(".");

  const table = values[0];
  const column = values[1];

  const result = json[table][column];

  if (!result) {
    console.error(`A entidade "${table}" ou o campo "${column}" NÃO existem!`);
    return;
  }

  console.log(`A entidade "${table}" e o campo "${column}" existem!`);
}

//console.log(Object.keys(data).length);

findKeyAndValueOnJson("Usuario.nome");
