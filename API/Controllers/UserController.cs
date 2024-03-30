using API.DTOs;
using API.Services.UserServices;
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
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            if (users.Count == 0)
            {
                return BadRequest("There is currently no users.");
            }
            return Ok(users);
        }
        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [HttpGet("email")]
        public IActionResult GetUserByEmail(string email)
        {
            var user = _userService.GetByEmail(email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [HttpPut]
        public IActionResult Update(UserToEditDto model)
        {
            var check = _userService.Update(model);
            switch (check)
            {
                case 1:
                    return NotFound();
                case 2:
                    return BadRequest("Username should be unique.");
                default:
                    return NoContent();
            }
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return Ok(_userService.Delete(id));
        }
    }
}
