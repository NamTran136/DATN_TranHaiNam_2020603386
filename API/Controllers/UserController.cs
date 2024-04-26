using API.DTOs;
using API.Services.UserServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet, Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            if (users.Count == 0)
            {
                return BadRequest("There is currently no users.");
            }
            return Ok(users);
        }
        [HttpGet("{id}"), Authorize]
        public IActionResult GetUserById(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [HttpGet("email"), Authorize]
        public IActionResult GetUserByEmail(string email)
        {
            var user = _userService.GetByEmail(email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            return Ok(_userService.Delete(id));
        }
        [HttpDelete("email={email}"), Authorize]
        public IActionResult DeleteByEmail(string email)
        {
            return Ok(_userService.DeleteByEmail(email));
        }
    }
}
