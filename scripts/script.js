document.addEventListener("DOMContentLoaded", () => {
  const BASE_SHIRT_PRICE = 15.0;
  const TAX_RATE = 0.0825;

  const form = document.getElementById("orderForm");
  const summary = document.getElementById("summary");
  const summaryContent = document.getElementById("summaryContent");
  const totalAmount = document.getElementById("totalAmount");
  const yearSpan = document.getElementById("year");
  const resetBtn = document.getElementById("resetForm");

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  function formatCurrency(amount) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  // -------------------------------------------
  //  NO Number() — using unary + for conversion
  // -------------------------------------------
  function calculateTotal(orderDetails) {
    let subtotal = 0;

    subtotal += BASE_SHIRT_PRICE * orderDetails.quantity;
    subtotal += +orderDetails.printStylePrice * orderDetails.quantity;

    for (let i = 0; i < orderDetails.addons.length; i++) {
      subtotal += +orderDetails.addons[i];
    }

    switch (orderDetails.size) {
      case "S":
        subtotal -= 1.0;
        break;
      case "XL":
        subtotal += 2.0;
        break;
    }

    let tax = subtotal * TAX_RATE;
    let total = subtotal + tax;

    total = Math.round(total * 100) / 100;
    return { subtotal, tax, total };
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    try {
      let firstName = document.getElementById("firstName").value.trim();
      let lastName = document.getElementById("lastName").value.trim();
      let email = document.getElementById("email").value.trim();
      let size = document.getElementById("size").value;

      // unary + converts to number
      let quantity = +document.getElementById("quantity").value;

      let color = document.getElementById("shirtColor").value;
      let date = document.getElementById("printDate").value;

      if (firstName === "" || lastName === "") {
        alert("Please enter both first and last name.");
        return;
      }

      if (!email.includes("@")) {
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

      let printStyleElements = document.getElementsByName("printStyle");
      let printStylePrice = null;

      for (let i = 0; i < printStyleElements.length; i++) {
        if (printStyleElements[i].checked) {
          printStylePrice = printStyleElements[i].value; // still a string
        }
      }

      if (printStylePrice === null) {
        alert("Please select a print style.");
        return;
      }

      let addonElements = document.getElementsByName("addon");
      let addons = [];

      for (let i = 0; i < addonElements.length; i++) {
        if (addonElements[i].checked) {
          addons.push(addonElements[i].value);
        }
      }

      let orderDetails = {
        firstName,
        lastName,
        email,
        size,
        quantity,
        printStylePrice,
        addons,
        color,
        date,
      };

      let totals = calculateTotal(orderDetails);

      let html = `
        <p><strong>Customer:</strong> ${orderDetails.firstName} ${
        orderDetails.lastName
      }</p>
        <p><strong>Email:</strong> ${orderDetails.email}</p>
        <p><strong>Size:</strong> ${orderDetails.size}</p>
        <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
        <p><strong>Print Style:</strong> ${formatCurrency(
          +orderDetails.printStylePrice
        )}</p>
        <p><strong>Add-ons:</strong> ${
          addons.length
            ? addons.map((a) => formatCurrency(+a)).join(", ")
            : "None"
        }</p>
        <p><strong>Color (Hex):</strong> ${orderDetails.color}</p>
        <p><strong>Date:</strong> ${orderDetails.date || "No preference"}</p>
        <hr>
        <p><strong>Subtotal:</strong> ${formatCurrency(totals.subtotal)}</p>
        <p><strong>Tax:</strong> ${formatCurrency(totals.tax)}</p>
      `;

      summaryContent.innerHTML = html;
      totalAmount.textContent = formatCurrency(totals.total);

      summary.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred. Please try again.");
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      summary.classList.add("hidden");
      summaryContent.innerHTML = "";
      totalAmount.textContent = formatCurrency(0);
    });
  }
});
