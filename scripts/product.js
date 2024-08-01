document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category-select');
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
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(productForm);
        try {
            const response = await fetch('http://localhost:3000/api/add-product', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: formData
            });
            if (response.ok) {
                alert('Product added successfully');
                productForm.reset();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product: ' + error.message);
        }
    });
});