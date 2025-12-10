document.addEventListener("DOMContentLoaded", function () {

  const BASE_SHIRT_PRICE = 15.0;
  const TAX_RATE = 0.0825;
//this is the constant
  const form = document.getElementById("orderForm");
  const summary = document.getElementById("summary");
  const summaryContent = document.getElementById("summaryContent");
  const totalAmount = document.getElementById("totalAmount");
  const yearSpan = document.getElementById("year");
  const resetBtn = document.getElementById("resetForm");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
//converts numbers to currency values
  function formatCurrency(amount) {
    //another boolean
    var negative = false;

    if (amount < 0) {
      // this a boolean
      negative = true;
      amount = amount * -1;
    }

    //this is the let
    let str = String(amount);
    // split the string method
    var parts = str.split(".");


    var dollars = parts[0];


    var cents = "0";

    if (parts.length > 1) {
      cents = parts[1];
    }
// slice string method
    cents = cents.padEnd(2, "0").slice(0, 2);

  
    var result = "";
    var count = 0;
// this is the loop
    for (var i = dollars.length - 1; i >= 0; i--) {
      result = dollars[i] + result;
      count++;
      if (count === 3 && i !== 0) {
        result = "," + result;
        count = 0;
      }
    }

    if (negative) {
      return "-$" + result + "." + cents;
    }

    return "$" + result + "." + cents;
  }
//this does all the math

  function calculateTotal(orderDetails) {
    var subtotal = 0;

    subtotal += BASE_SHIRT_PRICE * orderDetails.quantity;
    subtotal += (orderDetails.printStylePrice * 1) * orderDetails.quantity;
// this is the loop
    for (var i = 0; i < orderDetails.addons.length; i++) {
      subtotal += orderDetails.addons[i] * 1;
    }
// changes price depening on the size

// this is an if else
    if (orderDetails.size === "S") {
      subtotal -= 1;
    } else if (orderDetails.size === "XL") {
      subtotal += 2;
    }

    var tax = subtotal * TAX_RATE;
    var total = subtotal + tax;
// third digit  decimal
    var totalStr = String(total).split(".");
    var whole = totalStr[0];
    var decimals = totalStr[1] ? totalStr[1].padEnd(3, "0") : "000";

    // Third digit decides rounding
    var third = Number(decimals[2]);
    var centsTwo = Number(decimals.slice(0, 2));

    if (third >= 5) {
      centsTwo += 1;
      if (centsTwo === 100) {
        whole = String(Number(whole) + 1);
        centsTwo = 0;
      }
    }

    var finalTotal = Number(whole + "." + String(centsTwo).padStart(2, "0"));

    return {
      subtotal: subtotal,
      tax: tax,
      total: finalTotal
    };
  }

  //this is an event listener
  form.addEventListener("submit", function (e) {
    e.preventDefault();
// makes sure you have options to select
    try {
      var firstName = document.getElementById("firstName").value.trim();
      var lastName = document.getElementById("lastName").value.trim();
      var email = document.getElementById("email").value.trim();
      var size = document.getElementById("size").value;
      var quantity = document.getElementById("quantity").value * 1;
      var color = document.getElementById("shirtColor").value;
      var date = document.getElementById("printDate").value;

      if (firstName === "" || lastName === "") {
        alert("Please enter both first and last name.");
        return;
      }

      if (email.indexOf("@") === -1) {
        alert("Please enter a valid email address.");
        return;
      }

      if (!size) {
        alert("Please choose a shirt size.");
        return;
      }

      if (!quantity || quantity < 1) {
        alert("Please enter a quantity of 1 or more.");
        return;
      }

      var printStyleElements = document.getElementsByName("printStyle");
      var printStylePrice = null;


      //this is an array
      for (var i = 0; i < printStyleElements.length; i++) {
        if (printStyleElements[i].checked) {
          printStylePrice = printStyleElements[i].value;
        }
      }

      if (printStylePrice === null) {
        alert("Please select a print style.");
        return;
      }

      var addonElements = document.getElementsByName("addon");
      var addons = [];

      for (var j = 0; j < addonElements.length; j++) {
        if (addonElements[j].checked) {
          addons.push(addonElements[j].value);
        }
      }
// this  keeps all my varables
      var orderDetails = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        size: size,
        quantity: quantity,
        printStylePrice: printStylePrice,
        addons: addons,
        color: color,
        date: date
      };

      var totals = calculateTotal(orderDetails);

      var addonDisplay = "None";
      if (addons.length > 0) {
        var temp = [];
        for (var k = 0; k < addons.length; k++) {
          temp.push(formatCurrency(addons[k]));
        }
        addonDisplay = temp.join(", ");
      }
// this is the part where you make the slection of what you want
      var html =
        "<p><strong>Customer:</strong> " + firstName + " " + lastName + "</p>" +
        "<p><strong>Email:</strong> " + email + "</p>" +
        "<p><strong>Size:</strong> " + size + "</p>" +
        "<p><strong>Quantity:</strong> " + quantity + "</p>" +
        "<p><strong>Print Style:</strong> " + formatCurrency(printStylePrice) + "</p>" +
        "<p><strong>Add-ons:</strong> " + addonDisplay + "</p>" +
        "<p><strong>Color (Hex):</strong> " + color + "</p>" +
        "<p><strong>Date:</strong> " + (date || "No preference") + "</p>" +
        "<hr>" +
        "<p><strong>Subtotal:</strong> " + formatCurrency(totals.subtotal) + "</p>" +
        "<p><strong>Tax:</strong> " + formatCurrency(totals.tax) + "</p>";

      summaryContent.innerHTML = html;
      totalAmount.textContent = formatCurrency(totals.total);
      summary.classList.remove("hidden");
// makes sure nothing goews wrong
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  });

// resets the options
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      summary.classList.add("hidden");
      summaryContent.innerHTML = "";
      totalAmount.textContent = formatCurrency(0);
    });
  }

});
