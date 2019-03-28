var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Piglet10201234",
    database: "bamazon_db"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    initiationSequence();
});

function initiationSequence() {
    connection.query("SELECT * FROM products",

        function (err, result) {
            if (err) throw err;
            console.log(result)

            productSelection();
        });
}

function productSelection() {
    inquirer
        .prompt({
            type: "input",
            message: "Please enter the ID of the item you wish to purchase",
            name: "itemID"
        })
        .then(function (answer) {
            // console.log(answer.itemID);
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, {
                id: answer.itemID
            }, function (err, res) {
                itemPrice = res[0].price;
                itemName = res[0].name;
                //console.log(res[0].stock);
                itemStock = res[0].stock
                console.log("Thank you for your selection! We currently have " + itemStock + " " + itemName + "(s) in stock! at $" + itemPrice + " each.");

                quantitySelection();
            });
        });
};

function quantitySelection() {
    inquirer
        .prompt({
            type: "input",
            message: "Please enter the qantity you wish to purchase",
            name: "quantity"
        })
        .then(function (answer) {

            purchaseQuantity = answer.quantity;

            if (purchaseQuantity > itemStock) {
                console.log("That's too many!");
                initiationSequence()
            } else {
                console.log("For " + purchaseQuantity + " " + itemName + "(s), your total comes to: $" + itemPrice * purchaseQuantity);

                purchaseConfirmation();
            }


        });
}


function purchaseConfirmation() {
    inquirer
        .prompt({
            type: "list",
            message: "Do you wish to proceed with your purchase?",
            choices: ["Yes", "No"],
            name: "confirmation"
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Yes":
                    confirmed();
                    break;

                case "No":
                    connection.end();
                    break;
            }

        });

};




