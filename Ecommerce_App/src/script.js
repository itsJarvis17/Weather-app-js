document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cart--list");
  const emptyProductsMsg = document.getElementById("error--msg");
  const emptyCart = document.getElementById("empty-cart--msg");
  const productsContainer = document.getElementById("products--list");
  const subtotal = document.getElementById("subtotal--msg");
  const total = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout--btn");
  let sum = 0;
  const products = [
    { id: 1, name: "Product-1", price: 24.99 },
    { id: 2, name: "Product-2", price: 30 },
    { id: 3, name: "Product-3", price: 68.999 },
  ];
  let cart = [];
  const renderCart = (item = cart) => {
    // console.log(cart);
    if (cart.length === 0) {
      emptyCart.classList.remove("hidden");
      cartList.innerHTML = "";
      subtotal.classList.replace("flex", "hidden");
    } else {
      // cartList.innerHTML = "";
      // console.log(item);
      const markup = `<li 
              class="border-2 my-5 bg-gray-400 border-black mx-auto w-11/12 flex justify-evenly items-center"
            >
              <span>${item.name} - $ ${item.price}</span>
              
              <button id=${item.id}
                class="border-2 align-sub text-black border-yellow-200 bg-yellow-400 hover:bg-yellow-400 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 me-2 mb-2 dark:bg-yellow-400 dark:hover:bg-yellow-400 focus:outline-none dark:focus:ring-yellow-400"
              >
                Delete
              </button>
            </li>
          `;

      total.textContent = (sum += +item.price).toFixed(2);
      emptyCart.classList.add("hidden");
      cartList.insertAdjacentHTML("beforeend", markup);
      subtotal.classList.replace("hidden", "flex");
    }
  };
  const deleteItemFromCart = (id) => {
    cart = cart.filter((item) => item.id !== id);
    total.textContent = cart.reduce(
      (accumulator, currVal) => accumulator - currVal.price,
      sum
    );

    cartList.innerHTML = "";
    // console.log(cart.price);
    console.log();
    renderCart(...cart);
  };
  products.forEach((product) => {
    const element = `
    <li 
           
            class="border-2 my-5 bg-gray-400 border-black mx-auto w-11/12 flex justify-evenly items-center"
          >
            <span >${product.name} - $ ${product.price.toFixed(2)}</span>
            <button
              id="${product.id}"
              type="button"
              class="border-2 text-black border-yellow-200 bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 me-2 mb-2 dark:bg-yellow-400 dark:hover:bg-yellow-500 focus:outline-none dark:focus:ring-yellow-400"
            >
              Add to cart
            </button>
          </li>`;
    productsContainer.insertAdjacentHTML("beforeend", element);
    emptyProductsMsg.classList.toggle("hidden");
  });

  productsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    // console.log(btn);
    let product = products.filter((product) =>
      product.id === +btn.id ? product : null
    );

    if (!btn) return;
    cart = cart.concat(...product);
    console.log(cart);
    renderCart(...product);
  });
  checkoutBtn.addEventListener("click", () => {
    cart = [];
    renderCart(cart);
  });
  cartList.addEventListener("click", (e) => {
    const btn = e.target;
    if (btn.tagName !== "BUTTON") return;
    deleteItemFromCart(+btn.id);
  });
});
