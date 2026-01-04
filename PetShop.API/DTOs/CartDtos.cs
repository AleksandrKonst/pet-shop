using System.ComponentModel.DataAnnotations;

namespace PetShop.API.DTOs;

public class CartItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal ProductPrice { get; set; }
    public string? ProductImageUrl { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => ProductPrice * Quantity;
}

public class AddToCartDto
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}

public class UpdateCartItemDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}

public class CartSummaryDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalAmount => Items.Sum(i => i.TotalPrice);
    public int TotalItems => Items.Sum(i => i.Quantity);
}



