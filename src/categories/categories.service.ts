import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
    private readonly logsService: LogsService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoria = this.repo.create(createCategoryDto);
    const saved = await this.repo.save(categoria);
    await this.logsService.log('createCategory', `Categoría creada: ${saved.name}`, undefined);
    return saved;
  }

  async findAll() {
    const all = await this.repo.find();
    await this.logsService.log('findAllCategories', `Se listaron ${all.length} categorías`, undefined);
    return all;
  }

  async findOne(id: number) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) {
      await this.logsService.log('findOneCategory', `Categoría con id ${id} no encontrada`, undefined);
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    await this.logsService.log('findOneCategory', `Se consultó la categoría: ${category.name}`, undefined);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const result = await this.repo.update(id, updateCategoryDto);
    if (result.affected === 0) {
      await this.logsService.log('updateCategory', `Intento fallido de actualizar categoría con id ${id}`, undefined);
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    const updated = await this.repo.findOne({ where: { id } });
    await this.logsService.log('updateCategory', `Categoría actualizada: ${updated?.name}`, undefined);
    return updated;
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      await this.logsService.log('deleteCategory', `Intento fallido de eliminar categoría con id ${id}`, undefined);
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    }
    await this.logsService.log('deleteCategory', `Categoría con id ${id} eliminada`, undefined);
    return { message: `Categoría con id ${id} eliminada correctamente` };
  }
}
