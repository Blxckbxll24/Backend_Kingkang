import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  create(createProductDto: CreateProductDto) {
    const producto = this.repo.create(createProductDto);
    return this.repo.save(producto);
  }

  findAll() {
    return this.repo.find({ relations: ['category'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const producto = await this.repo.update(id, updateProductDto)
    if (producto.affected === 0) {
      throw new Error(`Product with id ${id} not found`);
    }
    return this.repo.findOne({ where: { id } });
  }

  remove(id: number) {
   return this.repo.delete(id)
  }
}
