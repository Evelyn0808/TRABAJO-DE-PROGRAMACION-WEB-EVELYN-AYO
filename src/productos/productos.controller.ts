import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
    constructor(private productosService: ProductosService){}

    @Get()
    funListar(){ return this.productosService.findAll(); }

    @Post()
    funGuardar(@Body() prod: any){ return this.productosService.create(prod); }

    @Get(':id')
    funObtenerUno(@Param('id') id: string){ return this.productosService.findOne(id); }

    @Put(':nombre')
    funModificar(@Param('nombre') nombre: string, @Body() prod: any){ return this.productosService.update(nombre, prod); }

    @Delete(':id')
    funEliminar(@Param('id') id){
        return this.productosService.delete(id)

    }
}