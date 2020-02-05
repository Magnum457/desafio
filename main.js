// variaveis globais
var fileElement = document.querySelector('#app input')
var buttonElement = document.querySelector('#app button')
var tableElement = document.querySelector('#app #tabela')
var CSVReader = new FileReader()
var result = []

// eventos

buttonElement.onclick = processaDados

function leCSV(e) {
    // separando cada linha da tabela em um array
    var linhas = e.target.result.split('\n')

    var header = linhas[0].split(',')

    for(var i=1; i<linhas.length - 1; i++){
        var obj = {}
        var linhaAtual = linhas[i].split(',')

        for(var j=0; j<header.length; j++){
            obj[header[j]] = linhaAtual[j]
        }

        result.push(obj)
    }
    
    geraTabela(result, header)
}

function processaDados() {
    let file = fileElement.files[0]
    
    CSVReader.onload = leCSV

    CSVReader.readAsText(file)
    
    fileElement.value = ''
}


function geraTabela(dados, headers) {
    
    var textoTabela = '<table border="1">'
    
    // cabeçalho da tabela
    textoTabela += '<tr>'
    headers.map((item) => {
        
        textoTabela += `<td>${item}</td>`
        
    })
    textoTabela += '</tr>'

    var dadosPorData = separaPorData(dados)

    // console.log(dadosPorData);
    

    dadosPorData.map((item) => {
        textoTabela += '<tr>'
            textoTabela += `<td>${item.empresa}</td>`
            textoTabela += `<td>${item.fornecedor}</td>`
            textoTabela += `<td>${item.data}</td>`
            textoTabela += `<td>${item.valor}</td>`
        textoTabela += '</tr>'
    })

    textoTabela +='</table>'

    tableElement.innerHTML = textoTabela
}

function separaPorData(dados) {
    // variaveis para fazer a classificação
    var resultado = []
    var anos = []
    var meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    dados.map((item) => {
        var ano = item.data.split('-')[0]
        if(anos.indexOf(ano) === -1) {
            anos.push(ano)
        }
    })

    // separando os dados em anos e meses
    for(var i=0; i < anos.length; i++) {
        for(var j=0; j < meses.length; j++) {          
            // recupera os array entre o ano i e mes j
            var arrayPorData = dados.filter((item) => {
                return item.data.split('-')[0] === anos[i] && item.data.split('-')[1] === meses[j]
            })
            // recupera o maior valor de cada array
            if(arrayPorData.length !== 0) {
                arrayPorData.sort((a, b) => {
                    return parseInt(a.valor) > parseInt(b.valor) ? 1 : -1
                })                
                resultado.push(arrayPorData[arrayPorData.length - 1])
            }
        }
    }

    return resultado
}
