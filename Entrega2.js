import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path
    }

    
    generateId() {
        if (this.products.length > 0) {
            const lastProduct = this.products[this.products.length - 1];
            this.code = lastProduct.code + 1;
        } else {
            this.code = 1;
        }
        return this.code;
    }

    addProduct({ title = '', description = '', price = 0, thumbnail = '', code = '', stock = 0 } = {}) {

        
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Error: completa todos los valores obligatorios.');
            return;
        }

        
        const newProduct = {
            id: this.generateId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf8');
    }

    
    getProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            const products = JSON.parse(data);
            return products;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    
    getProductById(code) {
        
        const data = fs.readFileSync(this.path, 'utf-8');
        
        const products = JSON.parse(data);
        
        const product = products.find((p) => p.code === code);
        if (product) {
            return product;
        } else {
            console.log(` Producto código ${code} no encontrado.`);
            return null;
        }
    }

    
    updateProduct(code, { title, description, price, thumbnail, stock } = {}) {
        const productIndex = this.products.findIndex((p) => p.code === code);
        if (productIndex !== -1) {
            const product = this.products[productIndex];
            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.thumbnail = thumbnail || product.thumbnail;
            product.stock = stock || product.stock;
            this.products[productIndex] = product;
            fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf8');
            console.log(` ¨Producto código ${code} ha sido actualizado.`);
        } else {
            console.log(` Producto código ${code} no encontrado.`);
        }
    }

    
    deleteProduct(code) {
        fs.readFile(this.path, 'utf8', (err, data) => {
            if (err) {
                console.log(`Error al leer el archivo: ${err}`);
                return;
            }

            let products = JSON.parse(data);
            const productIndex = products.findIndex((p) => p.code === code);

            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                console.log(`Producto código ${code} ha sido eliminado.`);

                fs.writeFile(this.path, JSON.stringify(products), (err) => {
                    if (err) {
                        console.log(`Error al escribir en el archivo: ${err}`);
                    }
                });
            } else {
                console.log(`Producto código ${code} no ha sido encontrado.`);
            }
        });
    }
}


const manager = new ProductManager('./productos.txt');


manager.addProduct({ title: 'Producto 1', description: 'Descripción del producto 1', price: 10, thumbnail: 'No image', code: 'P8273', stock: 100 });
manager.addProduct({ title: 'Producto 2', description: 'Descripción del producto 2', price: 20, thumbnail: 'No image', code: 'P4772', stock: 200 });
manager.addProduct({ title: 'Producto 3', description: 'Descripción del producto 3', price: 30, thumbnail: 'No image', code: 'P1234', stock: 300 });


const products = manager.getProducts();
console.log(products);


const productNotFound = manager.getProductById('P4077');
console.log(productNotFound)


const product = manager.getProductById('P4772');
console.log(product);


manager.updateProduct('P8273', { title: 'Modificación', description: 'modificación', price: 55, thumbnail: 'modificación', stock: 60 })


manager.deleteProduct('P4772');
console.log(manager.getProducts());


