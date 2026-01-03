using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.API.Data;
using PetShop.API.DTOs;
using PetShop.API.Models;

namespace PetShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class CartController(ApplicationDbContext context) : ControllerBase
{
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    // GET: api/cart
    [HttpGet]
    public async Task<ActionResult<CartSummaryDto>> GetCart()
    {
        var userId = GetUserId();

        var cartItems = await context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.UserId == userId)
            .Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                ProductPrice = ci.Product.Price,
                ProductImageUrl = ci.Product.ImageUrl,
                Quantity = ci.Quantity
            })
            .ToListAsync();

        var summary = new CartSummaryDto
        {
            Items = cartItems
        };

        return Ok(summary);
    }

    // POST: api/cart
    [HttpPost]
    public async Task<ActionResult<CartItemDto>> AddToCart(AddToCartDto dto)
    {
        var userId = GetUserId();

        // Проверка существования товара
        var product = await context.Products.FindAsync(dto.ProductId);
        if (product == null)
        {
            return NotFound(new { message = "Товар не найден" });
        }

        // Проверка наличия товара на складе
        if (product.Stock < dto.Quantity)
        {
            return BadRequest(new { message = "Недостаточно товара на складе" });
        }

        // Проверка существующего элемента в корзине
        var existingCartItem = await context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == dto.ProductId);

        if (existingCartItem != null)
        {
            // Обновление количества
            existingCartItem.Quantity += dto.Quantity;
            
            if (product.Stock < existingCartItem.Quantity)
            {
                return BadRequest(new { message = "Недостаточно товара на складе" });
            }
        }
        else
        {
            // Создание нового элемента корзины
            existingCartItem = new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            };
            context.CartItems.Add(existingCartItem);
        }

        await context.SaveChangesAsync();

        var cartItemDto = new CartItemDto
        {
            Id = existingCartItem.Id,
            ProductId = product.Id,
            ProductName = product.Name,
            ProductPrice = product.Price,
            ProductImageUrl = product.ImageUrl,
            Quantity = existingCartItem.Quantity
        };

        return Ok(cartItemDto);
    }

    // PUT: api/cart/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCartItem(int id, UpdateCartItemDto dto)
    {
        var userId = GetUserId();

        var cartItem = await context.CartItems
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

        if (cartItem == null)
        {
            return NotFound(new { message = "Элемент корзины не найден" });
        }

        // Проверка наличия товара на складе
        if (cartItem.Product.Stock < dto.Quantity)
        {
            return BadRequest(new { message = "Недостаточно товара на складе" });
        }

        cartItem.Quantity = dto.Quantity;
        await context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/cart/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        var userId = GetUserId();

        var cartItem = await context.CartItems
            .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

        if (cartItem == null)
        {
            return NotFound(new { message = "Элемент корзины не найден" });
        }

        context.CartItems.Remove(cartItem);
        await context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/cart
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();

        var cartItems = await context.CartItems
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        context.CartItems.RemoveRange(cartItems);
        await context.SaveChangesAsync();

        return NoContent();
    }
}


