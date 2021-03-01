const sql = require("msnodesqlv8");
const data = require('date-fns');
var nodemailer = require('nodemailer');
var sleep = require('system-sleep');
const { ro } = require("date-fns/locale");

const connectionString = "server=Servidor2;Database=disbat_automate;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

const query1 = "select cliente, empresa, email from notifica_email where email is not null group by cliente, empresa, email";
//select cliente, empresa, email from notifica_email where email is not null group by cliente, empresa, email
//select cliente, empresa, email from notifica_email where empresa = 'POLO' and email is not null group by cliente, empresa, email
//select cliente, empresa, email from notifica_email where empresa = 'NORTESUL' and email is not null group by cliente, empresa, email


sql.query(connectionString, query1, (err1, rows) => {

    var clienteJS = [rows];
  
    tamanho = Object.keys(clienteJS[0]).length;
    
    for (let j = 0; j < tamanho ; j++) {

        sleep(2000)

        var cliente = rows[j].cliente;
        var empresa = rows[j].empresa;
        var emailEmpresa = "";

        if (empresa === "DISBAT") {

            emailEmpresa = "disbatbaterias@outlook.com";
            
            var remetente = nodemailer.createTransport({
                service: 'outlook', //serviço
                host: 'smtp.office365.com', //servidor smtp
                port: '587', //porta smtp
                auth: {
                    user: 'disbatbaterias@outlook.com', //email
                    pass: 'Disbat210*', //senha
                 
                }
            });
        } else if (empresa === "POLO") {

            emailEmpresa = "polobaterias@outlook.com";
            
            var remetente = nodemailer.createTransport({
                service: 'outlook', //serviço
                host: 'smtp.office365.com', //servidor smtp
                port: '587', //porta smtp
                auth: {
                    user: 'polobaterias@outlook.com', //email
                    pass: 'Disbat210*', //senha
                 
                }
            });
        } else if (empresa === "NORTESUL") {

            emailEmpresa = "nortesulbaterias@outlook.com";
            
            var remetente = nodemailer.createTransport({
                service: 'outlook', //serviço
                host: 'smtp.office365.com', //servidor smtp
                port: '587', //porta smtp
                auth: {
                    user: 'nortesulbaterias@outlook.com', //email
                    pass: 'Disbat210*', //senha
                    
                }
            });
        }
       
        var query = `select * from notifica_email where cliente like '${cliente}'`;

        
        sql.query(connectionString, query, (err2, rows2) => {

            
            var clienteJS2 = [rows2]

            tamanho2 = Object.keys(clienteJS2[0]).length;
            
            var arrayDt = [];
            var arrayNumDock = [];
            var arraySucata = [];
            var somatorioSucata = 0;
            var mensagem = "";
            var cabecalho = "";
            var rodape = "";
            var agradecimentos = "";
            var clienteS = [];
            var empresaS = [];
            var emaiL = [];

            for (var i = 0; i < tamanho2; i++) {

                arrayDt[i] = rows2[i].dt_emissao;
                Data = data.format(new Date(arrayDt[i]), "dd-MM-yyyy")
                arrayNumDock[i] = rows2[i].num_doc;
                arraySucata[i] = rows2[i].sucata
                clienteS = rows[j].cliente;
                empresaS = rows[j].empresa;
                emaiL = rows[j].email
                somatorioSucata = somatorioSucata + rows2[i].sucata;

                cabecalho = `Caro ${cliente},<br> A ${empresa} informa que há as seguintes quantidades de sucata em aberto:<br><br>`

                
                mensagem = mensagem + `<tr><td>${Data}</td><td>${arrayNumDock[i]}</td><td>${arraySucata[i]}</td></tr>`
                rodape = `\n\nTotal em aberto: ${somatorioSucata} KG\n\n`
                agradecimentos = `Atenciosamente, <br>${empresaS}`

            }
           

            var destinatario = {
                from: emailEmpresa, //de quem
                to: emaiL , //emaiL
                subject: 'Saldo de sucatas de baterias', //assunto
                //text: 
                html: `${cabecalho}` + `
                        <table border="1">
                    <tr>
                        <td>Dt_Emissão</td>
                        <td>Num_Doc</td>
                        <td>Sucata KG</td>
                    </tr>
                    ${mensagem}
                </table>` + `<br>${rodape}<br>` + `<br>${agradecimentos}`
            };

            async function enviar() {
                await remetente.sendMail(destinatario, (err, inf) =>{
                    console.log(err);
                });
            }
            
        
            enviar();
            console.log("Email enviado para " + cliente);
        })


    }//fim do for

})

var remetente = nodemailer.createTransport({
    service: 'outlook', //serviço
    host: 'smtp.office365.com', //servidor smtp
    port: '587', //porta smtp
    auth: {
        user: 'disbatbaterias@outlook.com', //email
        pass: 'Disbat210*' //senha
    }
});

    var destinatario = {
        from: 'disbatbaterias@outlook.com', //de quem
        to: 'raul@disbat.com.br',
        subject: 'Notificação de Push', //assunto
        text: "Informamos que os emails de cobrança de sucata foram enviados neste dia"
        
    };


    async function enviar() {
        await remetente.sendMail(destinatario);
    }

    enviar()