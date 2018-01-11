//ZONA SEGURA, PUEDEN JUGAR AQUI
var domain = "gestios.es"


//SI NO ENTIENDES NI PAPA, ATRAS!!!!!
var time_check = 10000 //No lo bajes o quedas ban
var time_pizzas = 60000 //Tampoco lo bajes
var timeout_telewin = 0;
var timeout_telequeda = 0;

function telewin(){

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        if(domain=="gmail.com"){
            var sep = 0;
            return s4() + sep + s4() + sep + s4() + s4() + s4();
        }else{
            var sep = "-";
            return s4() + sep + s4() + s4() + s4();
        }
        
    }


    var data ={
        email: guid()+"@"+domain, 
        receive_offert: false,
    }

    $.ajax({
        type: "POST",
        url: "https://d6ow8diqzony0.cloudfront.net/check-mail",
        dataType: 'json',
        contentType: "application/json",
        crossDomain : true,
        data: JSON.stringify(data), 
        success: function (result) {
            busy = false;

            if(!busy){
                var body = JSON.stringify(JSON.parse(result['body'])  );
                var response = JSON.parse(body);

                if(!busy){
                    switch(response.responseMessage) {

                        case 'EMAIL_SAVED':
                        $.ajax({
                            type: "POST",
                            url: "https://d6ow8diqzony0.cloudfront.net/check-prize",
                            dataType: 'json',
                            contentType: "application/json",
                            crossDomain : true,
                            data: JSON.stringify({email: data.email}), 
                            success: function (result) {
                                busy = false;

                                var body = JSON.stringify(JSON.parse(result['body']));
                                var response = JSON.parse(body); 

                                switch(response.responseMessage) {
                                    case 'USER_IS_WINNER':
                                    console.log("[GANADOR]" + data.email)
                                    break;
                                    case 'USER_NOT_WIN':
                                    console.log("[NO GANADOR]" + data.email)
                                    break;
                                }

                                timeout = setTimeout(function(){telewin()}, time_check);
                            },  
                            error: function (e) {
                                timeout = setTimeout(function(){telewin()}, time_check);
                                console.log("ERROR: "+ e.message);
                            } 
                        });
                        break;  
                    }
                    
                }
            }
        }, 
        error: function (e) {
            console.log("ERROR: "+ e.message);
        } 
    }); 
    
}

var pizzas = 1000;
var busy_telequeda = false;
var timing = 44000
function telequeda() {
    if(!busy_telequeda){
        busy_telequeda = true;
        $.ajax({
            url: "./data.json",
            dataType: "text",
            success: function(e) {
                busy_telequeda = false;
                timeout_telequeda = setTimeout(function(){telequeda()}, time_pizzas);

                var t = JSON.parse(e);
                prizesEnable = JSON.stringify(t.prizesEnable), console.log("[INFO] Quedan " + prizesEnable + " Pizzas")
            }, 
            error: function (e) {
                busy_telequeda = false;
                timeout_telequeda = setTimeout(function(){telequeda()}, time_pizzas);
                console.log("ERROR: "+ e.message);
            } 
        })
    }
}

timeout_telewin = setTimeout(function(){telewin()}, time_check);
timeout_telequeda = setTimeout(function(){telequeda()}, time_pizzas);