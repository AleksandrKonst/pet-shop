using Microsoft.EntityFrameworkCore;
using PetShop.API.Models;

namespace PetShop.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Настройка связей и индексов
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.User)
            .WithMany(u => u.CartItems)
            .HasForeignKey(ci => ci.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany(p => p.CartItems)
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Seed данные
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed категории
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Товары для собак", Description = "Всё необходимое для ваших собак" },
            new Category { Id = 2, Name = "Товары для кошек", Description = "Всё необходимое для ваших кошек" },
            new Category { Id = 3, Name = "Товары для птиц", Description = "Всё необходимое для ваших птиц" }
        );

        // Seed товары
        modelBuilder.Entity<Product>().HasData(
            // Товары для собак
            new Product { Id = 1, Name = "Корм для собак премиум", Description = "Высококачественный корм для собак", Price = 1500, Stock = 50, CategoryId = 1 },
            new Product { Id = 2, Name = "Игрушка для собак", Description = "Прочная игрушка для активных игр", Price = 350, Stock = 100, CategoryId = 1 },
            new Product { Id = 3, Name = "Поводок и ошейник", Description = "Комплект поводок + ошейник", Price = 800, Stock = 30, CategoryId = 1 },
            
            // Товары для кошек
            new Product { Id = 4, Name = "Корм для кошек", Description = "Сбалансированный корм для кошек", Price = 1200, Stock = 60, CategoryId = 2 },
            new Product { Id = 5, Name = "Когтеточка", Description = "Удобная когтеточка для котов", Price = 900, Stock = 25, CategoryId = 2 },
            new Product { Id = 6, Name = "Лоток для кошек", Description = "Закрытый лоток с фильтром", Price = 1500, Stock = 20, CategoryId = 2 },
            
            // Товары для птиц
            new Product { Id = 7, Name = "Корм для попугаев", Description = "Витаминизированный корм", Price = 400, Stock = 80, CategoryId = 3 },
            new Product { Id = 8, Name = "Клетка для птиц", Description = "Просторная клетка", Price = 2500, Stock = 15, CategoryId = 3 }
        );
    }
}


