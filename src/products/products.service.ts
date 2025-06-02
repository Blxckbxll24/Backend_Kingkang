import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private readonly logsService: LogsService
  ) {}

  async create(createProductDto: CreateProductDto) {
    const producto = this.repo.create(createProductDto);
    const savedProduct = await this.repo.save(producto);
    await this.logsService.log('createProduct', `Producto creado con id ${savedProduct.id}`);
    return savedProduct;
  }

  async findAll() {
    const productos = await this.repo.find({ relations: ['category'] });
    await this.logsService.log('findAllProducts', `Se listaron ${productos.length} productos`);
    return productos;
  }

  async findOne(id: number) {
    const producto = await this.repo.findOne({ where: { id } });
    if (!producto) {
      await this.logsService.log('findOneProduct', `Producto con id ${id} no encontrado`);
      throw new Error(`Producto con id ${id} no encontrado`);
    }
    await this.logsService.log('findOneProduct', `Producto con id ${id} consultado`);
    return producto;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const result = await this.repo.update(id, updateProductDto);
    if (result.affected === 0) {
      await this.logsService.log('updateProduct', `Intento de actualizar producto no encontrado con id ${id}`);
      throw new Error(`Product with id ${id} not found`);
    }
    await this.logsService.log('updateProduct', `Producto con id ${id} actualizado`);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      await this.logsService.log('removeProduct', `Intento de eliminar producto no encontrado con id ${id}`);
      throw new Error(`Producto con id ${id} no encontrado`);
    }
    await this.logsService.log('removeProduct', `Producto con id ${id} eliminado`);
    return { message: `Producto con id ${id} eliminado` };
  }
}
