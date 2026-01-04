using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetShop.API.Data;
using PetShop.API.DTOs;
using PetShop.API.Models;
using PetShop.API.Services;

namespace PetShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(ApplicationDbContext context, JwtService jwtService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        // Проверка существующего пользователя
        if (await context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "Email уже зарегистрирован" });
        }

        if (await context.Users.AnyAsync(u => u.Username == dto.Username))
        {
            return BadRequest(new { message = "Имя пользователя уже занято" });
        }

        // Валидация роли
        if (dto.Role != "User" && dto.Role != "Manager")
        {
            return BadRequest(new { message = "Неверная роль. Допустимы только User или Manager" });
        }

        // Создание нового пользователя
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = jwtService.HashPassword(dto.Password),
            Role = dto.Role
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Генерация JWT токена
        var token = jwtService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            Token = token
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        // Поиск пользователя
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        
        if (user == null)
        {
            return Unauthorized(new { message = "Неверный email или пароль" });
        }

        // Проверка пароля
        if (!jwtService.VerifyPassword(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Неверный email или пароль" });
        }

        // Генерация JWT токена
        var token = jwtService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            Token = token
        });
    }
}



