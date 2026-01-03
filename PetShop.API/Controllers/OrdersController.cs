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
[Authorize] // Требуется авторизация, роль проверяется на уровне методов
public class OrdersController(ApplicationDbContext context) : ControllerBase
{

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }

    // GET: api/orders/all (только для Manager)
    [HttpGet("all")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
    {
        var orders = await context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders (только свои заказы для User)
    [HttpGet]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
    {
        var userId = GetUserId();

        var orders = await context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.CreatedAt,
                Items = o.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    Price = oi.Price
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var userId = GetUserId();

        var order = await context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

        if (order == null)
        {
            return NotFound(new { message = "Заказ не найден" });
        }

        var orderDto = new OrderDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        };

        return Ok(orderDto);
    }

    // POST: api/orders
    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<ActionResult<OrderDto>> CreateOrder()
    {
        var userId = GetUserId();

        // Получение товаров из корзины
        var cartItems = await context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        if (!cartItems.Any())
        {
            return BadRequest(new { message = "Корзина пуста" });
        }

        // Проверка наличия товаров на складе
        foreach (var cartItem in cartItems)
        {
            if (cartItem.Product.Stock < cartItem.Quantity)
            {
                return BadRequest(new { message = $"Недостаточно товара '{cartItem.Product.Name}' на складе" });
            }
        }

        // Создание заказа
        var order = new Order
        {
            UserId = userId,
            TotalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity),
            Status = "Pending"
        };

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        // Создание элементов заказа и обновление остатков
        foreach (var cartItem in cartItems)
        {
            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity,
                Price = cartItem.Product.Price
            };

            context.OrderItems.Add(orderItem);
            
            // Уменьшение количества товара на складе
            cartItem.Product.Stock -= cartItem.Quantity;
        }

        // Очистка корзины
        context.CartItems.RemoveRange(cartItems);

        await context.SaveChangesAsync();

        // Загрузка заказа с элементами для ответа
        var createdOrder = await context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstAsync(o => o.Id == order.Id);

        var orderDto = new OrderDto
        {
            Id = createdOrder.Id,
            TotalAmount = createdOrder.TotalAmount,
            Status = createdOrder.Status,
            CreatedAt = createdOrder.CreatedAt,
            Items = createdOrder.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        };

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
    }
}

