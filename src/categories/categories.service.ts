import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}
  create(createCategoryDto: CreateCategoryDto) {
    const categoria = this.repo.create(createCategoryDto);
    return this.repo.save(categoria);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({where: {id} });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categoria = await this.repo.update(id, updateCategoryDto);
    if (categoria.affected === 0) {
      throw new Error(`Category with id ${id} not found`);
    }
    return this.repo.findOne({where: {id}});
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
