using API.DTOs;
using API.Services.BookServices;
using API.Services.CommonServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : ControllerBase
    {

        private readonly ICommonService _commonService;
        public CommonController(ICommonService commonService)
        {
            _commonService = commonService;
        }

        // GET api/<CommonController>/5
        [HttpGet("{num}"), Authorize(Roles = "Admin")]
        public int Get(int num)
        {
            return _commonService.Count(num);
        }

        [HttpGet("searchinput={input}/{index}"), Authorize(Roles = "Admin")]
        public ActionResult<List<BookDto>> SearchBook(string input, int index)
        {
            var books = _commonService.SearchBook(input, index);
            if (books == null)
            {
                return NotFound();
            }
            return books;
        }
        [HttpGet("searchuser={input}/{index}"), Authorize(Roles = "Admin")]
        public ActionResult<List<PublicUserDto>> SearchUser(string input, int index)
        {
            var users = _commonService.SearchUser(input, index);
            if (users == null)
            {
                return NotFound();
            }
            return users;
        }
        [HttpGet("topcategories"), Authorize(Roles = "Admin")]
        public ActionResult<List<CategoryDto>> GetTopCategory()
        {
            var categories = _commonService.GetTopCategories();
            if (categories == null)
            {
                return NotFound();
            }
            return categories;
        }

    }
}
