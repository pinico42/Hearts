import { ClientWSManager } from "./ClientWSManager";

var wsm: ClientWSManager;
console.log("EGG")
export function setPanel(p: JQuery<any>) {
    var panels = $(".panel");
    panels.hide();
    p.show();
    console.log(p)
}

$(document).ready(function () {
    setPanel($("#panel_greet"));
    wsm = new ClientWSManager();

    $("#newgame").click(function () {
        wsm.newGame();
    })

    $("#joingame").click(function () {
        $("#joingame").hide();
        $("#joingameinput").show().focus().keypress(function (e) {
            if (e.which == 13) {
                var id = $("#joingameinput").val();
                wsm.joinGame(id);
                return false;
            }
        });
    });

    $("#startgame").click(function () {
        wsm.startGame();
    })

    $("#handaround_button").click(function () {
        wsm.setHandaround();
        $("#handaround_await_message").show();
        $("#handaround_button").hide();
    })
    
})