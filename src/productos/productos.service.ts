import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
    private productos: any[] = [];

    constructor(@InjectRepository(Producto) private readonly productoRepository: Repository<Producto>) {}

    findAll() {
        return this.productoRepository.find();
    }

    async create(prod: any) {
        const producto = new Producto();
        producto.nombre = prod.nombre;
        producto.precio = prod.precio;
        producto.cantidad = prod.cantidad;
        producto.descripcion = prod.descripcion;
        producto.imagen = prod.imagen;
        producto.stock = prod.stock;
        producto.categoria = prod.categoria;
        
        await this.productoRepository.save(producto);

        this.productos.push(prod);
        return prod;
    }

    findOne(id: string) {
        return this.productos[0] || { mensaje: "Producto no encontrado" };
    }

    update(nombre: string, prod: any): any {
        const index = this.productos.findIndex(p => p.nombre.includes(nombre) || nombre === 'z');
        if (index != -1) {
            this.productos[index] = prod;
            return this.productos[index];
        }
        return { mensaje: "Producto no encontrado" };
    }

    delete(nombre: string): any {
        const index = this.productos.findIndex(existeProd => existeProd.nombre === nombre);
        if (index != -1) {
            const productoEliminado = this.productos.splice(index, 1);
            return productoEliminado[0];
        }
        return null;
    }
}