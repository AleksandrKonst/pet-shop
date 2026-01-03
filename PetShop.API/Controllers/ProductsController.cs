using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.API.Data;
using PetShop.API.DTOs;
using PetShop.API.Models;

namespace PetShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(ApplicationDbContext context) : ControllerBase
{

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery] int? categoryId)
    {
        var query = context.Products.Include(p => p.Category).AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        var products = await query
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name
            })
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "Товар не найден" });
        }

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            ImageUrl = product.ImageUrl,
            CategoryId = product.CategoryId,
            CategoryName = product.Category.Name
        };

        return Ok(productDto);
    }

    // POST: api/products
    [HttpPost]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
    {
        // Проверка существования категории
        var categoryExists = await context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "Категория не найдена" });
        }

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        };

        context.Products.Add(product);
        await context.SaveChangesAsync();

        // Загрузка категории для ответа
        await context.Entry(product).Reference(p => p.Category).LoadAsync();

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            ImageUrl = product.ImageUrl,
            CategoryId = product.CategoryId,
            CategoryName = product.Category.Name
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
    {
        var product = await context.Products.FindAsync(id);
        
        if (product == null)
        {
            return NotFound(new { message = "Товар не найден" });
        }

        // Обновление полей, если они указаны
        if (!string.IsNullOrEmpty(dto.Name))
            product.Name = dto.Name;
        
        if (!string.IsNullOrEmpty(dto.Description))
            product.Description = dto.Description;
        
        if (dto.Price.HasValue)
            product.Price = dto.Price.Value;
        
        if (dto.Stock.HasValue)
            product.Stock = dto.Stock.Value;
        
        if (dto.ImageUrl != null)
            product.ImageUrl = dto.ImageUrl;
        
        if (dto.CategoryId.HasValue)
        {
            var categoryExists = await context.Categories.AnyAsync(c => c.Id == dto.CategoryId.Value);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Категория не найдена" });
            }
            product.CategoryId = dto.CategoryId.Value;
        }

        await context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await context.Products.FindAsync(id);
        
        if (product == null)
        {
            return NotFound(new { message = "Товар не найден" });
        }

        context.Products.Remove(product);
        await context.SaveChangesAsync();

        return NoContent();
    }
}

