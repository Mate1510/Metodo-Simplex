cont = 0;

function geraMatrizDeInputs() {
  var colunas = parseInt(document.getElementById("variaveis").value);
  var linhas = parseInt(document.getElementById("restricoes").value);
  var fo = "";
  var aux = "";
  var matriz = "";
  var zeros = "";
  const required = document.getElementById("variaveis").value.trim();
  const required2 = document.getElementById("restricoes").value.trim();

  if (!required || !required2) {
    containerDeAtencao.innerHTML = "<h3>Favor preencher os campos!</h3>";
  } else {
    containerDeAtencao.innerHTML = "";

    for (i = 1; i <= colunas; i++) {
      fo +=
        '<input type="number" value="" name="' +
        "X" +
        i +
        '" id="' +
        "X" +
        i +
        '" onClick="this.select();" required="required" style="text-align:right;"> X' +
        i;

      zeros += "X" + i;

      if (i != colunas) {
        fo += " + ";
        zeros += ", ";
      }
    }

    document.getElementById("fo").innerHTML = "<p>Função Objetiva:</p>" + fo;

    for (i = 1; i <= linhas; i++) {
      for (j = 1; j <= colunas; j++) {
        aux +=
          '<input type="text" value="" name="' +
          i +
          "X" +
          j +
          '" id="' +
          i +
          "X" +
          j +
          '" onClick="this.select();" required="required" style="text-align: right;"> X' +
          j;

        if (j != colunas) {
          aux += " + ";
        }
      }

      matriz +=
        aux +
        ' ≤  <input type="text" value="0" name="' +
        "R" +
        i +
        '" id="' +
        "R" +
        i +
        '" onClick="this.select();" required="required"  /><br /><br />';
      aux = "";
    }

    document.getElementById("matriz").innerHTML = "<p>Restrições:</p>" + matriz;
    zeros += " ≥ 0";
    document.getElementById("zeros").innerHTML = zeros;
    document.getElementById("btnResolver").innerHTML = '<input type="button" value="Resolver" id="btResolver" onClick="resolver()">';
    document.getElementById("variaveis").readOnly = true;
    document.getElementById("restricoes").readOnly = true;
  }
}

function criaMatriz(linhas, colunas) {
  matriz = new Array(linhas);

  for (i = 0; i < linhas; i++) {
    matriz[i] = new Array(colunas);

    for (j = 0; j < colunas; j++) {
      matriz[i][j] = 0;
    }
  }
}

function geraMatriz() {
  var variaveis = parseInt(document.getElementById("variaveis").value);
  var restricoes = parseInt(document.getElementById("restricoes").value);

  criaMatriz(restricoes + 2, variaveis + restricoes + 2);
  matriz[0][0] = "Z";
  matriz[restricoes + 1][0] = 1;
  matriz[0][variaveis + restricoes + 1] = "b";

  for (i = 1; i <= variaveis; i++) {
    matriz[0][i] = "X" + i;
  }

  for (i = 1; i <= restricoes; i++) {
    matriz[0][i + variaveis] = "S" + i;
  }

  for (i = 1; i <= restricoes; i++) {
    for (j = 1; j <= variaveis; j++) {
      matriz[i][j] = document.getElementById(i + "X" + j).value;
    }

    matriz[i][variaveis + restricoes + 1] = document.getElementById(
      "R" + i
    ).value;

    for (j = 1; j <= restricoes; j++) {
      matriz[i][i + variaveis] = 1;
    }
  }

  for (j = 1; j <= variaveis; j++) {
    matriz[restricoes + 1][j] = document.getElementById("X" + j).value * -1;
  }

  imprimeTabela();
}

function imprimeTabela() {
  var variaveis = parseInt(document.getElementById("variaveis").value);
  var restricoes = parseInt(document.getElementById("restricoes").value);
  var linhas = restricoes + 2;
  var colunas = variaveis + restricoes + 2;
  var tabela = '<table>' + '<thead>Tabela </thead>' + (cont+1) + ': ';

  for (i = 0; i < linhas; i++) {
    tabela += "<tr>";

    for (j = 0; j < colunas; j++) {
      tabela += "<td>" + matriz[i][j] + "</td>";
    }

    tabela += "</tr>";
  }

  tabela += "</table>";

  document.getElementById("tabela").innerHTML += tabela;
  cont++;
}

function final() {
  var objetivo = document.getElementById("objetivo").value;
  var variaveis = parseInt(document.getElementById("variaveis").value);
  var restricoes = parseInt(document.getElementById("restricoes").value);

  if (objetivo == "max") {
    for (j = 1; j <= variaveis; j++) {
      if (matriz[restricoes + 1][j] < 0) {
        return false;
      }
    }

    return true;
  }

  if (objetivo == "min") {
    for (j = 1; j <= variaveis; j++) {
      if (matriz[restricoes + 1][j] > 0) {
        return false;
      }
    }

    return true;
  }
}

function encontraPivoJ() {
  var objetivo = document.getElementById("objetivo").value;
  var variaveis = parseInt(document.getElementById("variaveis").value);
  var restricoes = parseInt(document.getElementById("restricoes").value);
  var itemLinha = matriz[restricoes + 1][1];
  pivoJ = 1;

  if (objetivo == "max") {
    for (j = 1; j <= variaveis; j++) {
      if (
        matriz[restricoes + 1][j] < itemLinha &&
        matriz[restricoes + 1][j] != 0
      ) {
        itemLinha = matriz[restricoes + 1][j];
        pivoJ = j;
      }
    }
  }

  if (objetivo == "min") {
    for (j = 1; j <= variaveis; j++) {
      if (
        matriz[restricoes + 1][j] > itemLinha &&
        matriz[restricoes + 1][j] != 0
      ) {
        itemLinha = matriz[restricoes + 1][j];

        pivoJ = j;
      }
    }
  }
}

function encontraPivoI() {
  var restricoes = parseInt(document.getElementById("restricoes").value);
  var variaveis = parseInt(document.getElementById("variaveis").value);
  var razao = 0;
  var aux = Number.MAX_VALUE;
  pivoI = 0;

  for (i = 1; i <= restricoes; i++) {
    razao = parseFloat(
      parseFloat(matriz[i][restricoes + variaveis + 1] / matriz[i][pivoJ])
    );

    if (razao > 0 && razao < aux) {
      aux = razao;
      pivoI = i;
    }
  }
}

function divideLinha(i, n) {
  var variaveis = parseInt(document.getElementById("variaveis").value);
  var restricoes = parseInt(document.getElementById("restricoes").value);
  var ncolunas = variaveis + restricoes + 2;

  for (j = 0; j < ncolunas; j++) {
    matriz[i][j] = parseFloat(matriz[i][j]) / n;
  }
}

function resolver() {
  document.getElementById("btResolver").disabled = true;

  geraMatriz();

  var variaveis = parseInt(document.getElementById("variaveis").value);
  var restricoes = parseInt(document.getElementById("restricoes").value);
  var ncolunas = variaveis + restricoes + 2;
  var itemAux = 0;
  var resposta = "<p>Solução: </p>";

  while (final() == false) {
    encontraPivoJ();
    encontraPivoI();
    divideLinha(pivoI, matriz[pivoI][pivoJ]);

    for (i = 1; i <= restricoes + 1; i++) {
      itemAux = matriz[i][pivoJ];

      for (j = 0; j < ncolunas; j++) {
        if (i != pivoI) {
          matriz[i][j] = matriz[i][j] - itemAux * matriz[pivoI][j];
        }
      }
    }

    imprimeTabela();
  }

  for (j = 1; j <= variaveis; j++) {
    for (i = 1; i <= restricoes; i++) {
      if (matriz[i][j] == 1) {
        resposta +=
          matriz[0][j] +
          " = " +
          matriz[i][variaveis + restricoes + 1] +
          " <br>";
      }
    }
  }

  resposta += "Z = " + matriz[restricoes + 1][variaveis + restricoes + 1];

  document.getElementById("tabela").innerHTML += resposta;
  document.getElementById("btnNovoProblema").innerHTML = '<input type="button" value="Novo problema" onClick="location.reload()">';
}
