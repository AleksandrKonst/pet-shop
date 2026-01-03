using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.API.Data;
using PetShop.API.DTOs;
using PetShop.API.Models;

namespace PetShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ApplicationDbContext context) : ControllerBase
{

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await context.Categories
            .Include(c => c.Products)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ProductCount = c.Products.Count
            })
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/categories/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return NotFound(new { message = "Категория не найдена" });
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ProductCount = category.Products.Count
        };

        return Ok(categoryDto);
    }

    // POST: api/categories
    [HttpPost]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description
        };

        context.Categories.Add(category);
        await context.SaveChangesAsync();

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ProductCount = 0
        };

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
    }

    // PUT: api/categories/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto dto)
    {
        var category = await context.Categories.FindAsync(id);
        
        if (category == null)
        {
            return NotFound(new { message = "Категория не найдена" });
        }

        if (!string.IsNullOrEmpty(dto.Name))
            category.Name = dto.Name;
        
        if (!string.IsNullOrEmpty(dto.Description))
            category.Description = dto.Description;

        await context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/categories/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (category == null)
        {
            return NotFound(new { message = "Категория не найдена" });
        }

        if (category.Products.Any())
        {
            return BadRequest(new { message = "Нельзя удалить категорию, содержащую товары" });
        }

        context.Categories.Remove(category);
        await context.SaveChangesAsync();

        return NoContent();
    }
}

