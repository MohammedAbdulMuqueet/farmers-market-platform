document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('category-select');
    const productSelect = document.getElementById('product-select');
    const showImageButton = document.getElementById('show-image');
    const ordersContainer = document.getElementById('ordersContainer');
    const categories = ['Fruits', 'Vegetables', 'Dairy'];
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select a category';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    categorySelect.appendChild(placeholderOption);
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    const defaultProductOption = document.createElement('option');
    defaultProductOption.value = '';
    defaultProductOption.textContent = 'Select a product';
    defaultProductOption.disabled = true;
    defaultProductOption.selected = true;
    productSelect.appendChild(defaultProductOption);
    function displayProductImages(product) {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productName = document.createElement('h3');
        productName.textContent = product.productName || 'Product Name Not Available';

        const productPrice = document.createElement('p');
        productPrice.innerHTML = `<strong>Price Per Kg/Dozen:</strong> ${product.price !== undefined ? `$${product.price.toFixed(2)}` : 'N/A'}`;

        const productQuantity = document.createElement('p');
        productQuantity.innerHTML = `<strong>Quantity Available(Kg/Dozen):</strong> ${product.quantity !== undefined ? product.quantity : 'N/A'}`;
        const productImages = document.createElement('div');
        if (product.images && product.images.length > 0) {
            product.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl; 
                img.alt = product.productName || 'Product Image';
                img.style.width = '500px'; 
                img.style.height = 'auto'; 
                img.classList.add('product-image');
                img.addEventListener('click', () => {
                    showImageModal(imageUrl);
                });
                productImages.appendChild(img);
            });
        } else {
            productImages.innerHTML = '<p>No images available for this product.</p>';
        }
        productDiv.appendChild(productName);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(productQuantity);
        productDiv.appendChild(productImages);
        ordersContainer.innerHTML = ''; 
        ordersContainer.appendChild(productDiv);
    }
    categorySelect.addEventListener('change', async () => {
        const selectedCategory = categorySelect.value;
        if (!selectedCategory) return;
        productSelect.innerHTML = '';
        productSelect.appendChild(defaultProductOption); 
        ordersContainer.innerHTML = ''; 
        productSelect.disabled = true;
        try {
            const response = await fetch(`http://localhost:3000/api/products/category/${selectedCategory}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const products = await response.json();
            const availableProducts = products.filter(product => product.quantity > 0);
            availableProducts.forEach(product => {
                const option = document.createElement('option');
                option.value = product._id;
                option.textContent = product.productName;
                productSelect.appendChild(option);
            });
            productSelect.disabled = availableProducts.length === 0;
            if (availableProducts.length > 1) {
                productSelect.disabled = false;
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products for the selected category');
        }
    });
    productSelect.addEventListener('change', async () => {
        const selectedProductId = productSelect.value;
        if (!selectedProductId) return;
        try {
            const response = await fetch(`http://localhost:3000/api/products/id/${selectedProductId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const product = await response.json();
            console.log('Selected Product Data:', product);
            showImageButton.style.display = 'block';
            showImageButton.dataset.product = JSON.stringify(product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    });
    showImageButton.addEventListener('click', () => {
        const productData = JSON.parse(showImageButton.dataset.product);
        displayProductImages(productData);
    });
    function showImageModal(imageUrl) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="${imageUrl}" alt="Product Image" style="width:100%; height:auto;">
            </div>
        `;
        document.body.appendChild(modal);
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });
        const closeButton = modal.querySelector('.close');
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
    }
    document.getElementById('order-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const productId = productSelect.value;
        const quantity = document.getElementById('quantity').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        try {
            const response = await fetch('http://localhost:3000/api/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId, quantity, cardNumber, expiryDate })
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }
            const result = await response.json();
            alert(result.message || 'Order placed successfully');
            await updateProductAfterOrder(productId);
            fetchOrders();
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order: ' + error.message);
        }
    });
    async function updateProductAfterOrder(productId) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/id/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const product = await response.json();
            if (product.quantity <= 0) {
                const productOption = productSelect.querySelector(`option[value="${product._id}"]`);
                if (productOption) {
                    productSelect.removeChild(productOption);
                }
                ordersContainer.innerHTML = ''; 
                alert(`Product ${product.productName} is out of stock and has been removed.`);
            } else {
                displayProductImages(product);
            }
        } catch (error) {
            console.error('Error updating product details:', error);
            alert('An error occurred while updating product details: ' + error.message);
        }
    }
    document.getElementById('delete-all-products').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete all products?')) {
            try {
                const response = await fetch('http://localhost:3000/api/products', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to delete products');
                }
                const result = await response.json();
                alert(result.message || 'All products deleted successfully');
                productSelect.innerHTML = '';
                productSelect.appendChild(defaultProductOption); 
                ordersContainer.innerHTML = '';
                showImageButton.style.display = 'none'; 
            } catch (error) {
                console.error('Error deleting products:', error);
                alert('An error occurred while deleting the products: ' + error.message);
            }
        }
    });
    async function fetchOrders() {
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('Expected an array of orders');
            }
            const ordersList = document.getElementById('orders-list');
            ordersList.innerHTML = '';
            data.forEach(order => {
                if (order && order.productName) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Product: ${order.productName}, Quantity: ${order.quantity}`;
                    ordersList.appendChild(listItem);
                } else {
                    console.warn('Order or productName is undefined', order);
                }
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }
    fetchOrders();
});