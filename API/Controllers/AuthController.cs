using API.DTOs;
using API.Entities;
using API.Services.Auth;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]RegisterDto request)
        {
            if(await _authService.CheckEmail(request.Email))
            {
                return BadRequest("Email already exists");
            }
            if(await _authService.CheckUsername(request.Username))
            {
                return BadRequest("Username already exists");
            }
            await _authService.CreateUser(request);
            return Ok(new {message = "Registered successfully."});
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var currentUser = await _authService.GetUserByEmail(request.Email);
            if (currentUser == null)
            {
                return BadRequest("Email not found");
            }
            if (!_authService.VarifyPasswordHash(request.Password, currentUser.PasswordHash, currentUser.PasswordSalt))
            {
                return BadRequest("Wrong password");
            }
            string token = CreateToken(currentUser);
            return Ok(token);
        }

        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody] GoogleDto request)
        {
            var checkUser = await _authService.GetUserByEmail(request.Email);
            if (checkUser == null)
            {
                await _authService.CreateGoogleUser(request);
            }
            var user = await _authService.GetUserByEmail(request.Email);
            string token = CreateToken(user);
            return Ok(token);
        }
        [HttpPut]
        public async Task<IActionResult> Update(UserToEditDto model)
        {
            var check = _authService.Update(model);
            switch (check)
            {
                case 1:
                    return NotFound();
                case 2:
                    return BadRequest("Username should be unique.");
                default:
                    var user = await _authService.GetUserByEmail(model.Email);
                    string token = CreateToken(user);
                    return Ok(token);
            }
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
                new Claim("username", user.Username),
                new Claim("email", user.Email),
                new Claim("role", user.IsAdmin ? "Admin" : "User"),
                new Claim("image", user.ImageUrl)
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    }
}
